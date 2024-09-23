import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { ConfigurationError } from "@pipedream/platform";
import axios from "axios";
import Bottleneck from "bottleneck";
import { exec } from "child_process";
import FormData from "form-data";
import fs from "fs";
import {
  extname,
  join,
} from "path";
import stream from "stream";
import { promisify } from "util";
import openai from "../../openai.app.mjs";
import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";
import lang from "../common/lang.mjs";

const COMMON_AUDIO_FORMATS_TEXT = "Your audio file must be in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.";
const CHUNK_SIZE_MB = 20;

const execAsync = promisify(exec);
const pipelineAsync = promisify(stream.pipeline);

export default {
  name: "Create Transcription (Whisper)",
  version: "0.1.12",
  key: "openai-create-transcription",
  description: "Transcribes audio into the input language. [See the documentation](https://platform.openai.com/docs/api-reference/audio/create).",
  type: "action",
  props: {
    openai,
    uploadType: {
      label: "Audio Upload Type",
      description: "Are you uploading an audio file from [your workflow's `/tmp` directory](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory), or providing a URL to the file?",
      type: "string",
      options: [
        "File",
        "URL",
      ],
      reloadProps: true,
    },
    language: {
      label: "Language",
      description: "**Optional**. The language of the input audio. Supplying the input language will improve accuracy and latency.",
      type: "string",
      optional: true,
      options: lang.LANGUAGES.map((l) => ({
        label: l.label,
        value: l.value,
      })),
    },
  },
  async additionalProps() {
    const props = {};
    switch (this.uploadType) {
    case "File":
      props.path = {
        type: "string",
        label: "File Path",
        description: `A path to your audio file to transcribe, e.g. \`/tmp/audio.mp3\`. ${COMMON_AUDIO_FORMATS_TEXT} Add the appropriate extension (mp3, mp4, etc.) on your filename — OpenAI uses the extension to determine the file type. [See the Pipedream docs on saving files to \`/tmp\`](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)`,
      };
      break;
    case "URL":
      props.url = {
        type: "string",
        label: "URL",
        description: `A public URL to the audio file to transcribe. This URL must point directly to the audio file, not a webpage that links to the audio file. ${COMMON_AUDIO_FORMATS_TEXT}`,
      };
      break;
    default:
      throw new ConfigurationError("Invalid upload type specified. Please provide 'File' or 'URL'.");
    }
    // Because we need to display the file or URL above, and not below, these optional props
    // TODO: Will be fixed when we render optional props correctly when used with additionalProps
    props.prompt = {
      label: "Prompt",
      description: "**Optional** text to guide the model's style or continue a previous audio segment. The [prompt](https://platform.openai.com/docs/guides/speech-to-text/prompting) should match the audio language.",
      type: "string",
      optional: true,
    };
    props.responseFormat = {
      label: "Response Format",
      description: "**Optional**. The format of the response. The default is `json`.",
      type: "string",
      default: "json",
      optional: true,
      options: constants.TRANSCRIPTION_FORMATS,
    };
    props.temperature = common.props.temperature;

    return props;
  },
  methods: {
    createForm({
      file, outputDir,
    }) {
      const form = new FormData();
      form.append("model", "whisper-1");
      if (this.prompt) form.append("prompt", this.prompt);
      if (this.temperature) form.append("temperature", this.temperature);
      if (this.language) form.append("language", this.language);
      if (this.responseFormat) form.append("response_format", this.responseFormat);
      const readStream = fs.createReadStream(join(outputDir, file));
      form.append("file", readStream);
      return form;
    },
    async splitLargeChunks(files, outputDir) {
      for (const file of files) {
        if (fs.statSync(`${outputDir}/${file}`).size / (1024 * 1024) > CHUNK_SIZE_MB) {
          await this.chunkFile({
            file: `${outputDir}/${file}`,
            outputDir,
            index: file.slice(6, 9),
          });
          await execAsync(`rm -f "${outputDir}/${file}"`);
        }
      }
    },
    async chunkFileAndTranscribe({
      file, $,
    }) {
      const outputDir = join("/tmp", "chunks");
      await execAsync(`mkdir -p "${outputDir}"`);
      await execAsync(`rm -f "${outputDir}/*"`);

      await this.chunkFile({
        file,
        outputDir,
      });

      let files = await fs.promises.readdir(outputDir);
      // ffmpeg will sometimes return chunks larger than the allowed size,
      // so we need to identify large chunks and break them down further
      await this.splitLargeChunks(files, outputDir);
      files = await fs.promises.readdir(outputDir);

      return this.transcribeFiles({
        files,
        outputDir,
        $,
      });
    },
    async chunkFile({
      file, outputDir, index,
    }) {
      const ffmpegPath = ffmpegInstaller.path;
      const ext = extname(file);

      const fileSizeInMB = fs.statSync(file).size / (1024 * 1024);
      // We're limited to 26MB per request. Because of how ffmpeg splits files,
      // we need to be conservative in the number of chunks we create
      const conservativeChunkSizeMB = CHUNK_SIZE_MB;
      const numberOfChunks = !index
        ? Math.ceil(fileSizeInMB / conservativeChunkSizeMB)
        : 2;

      if (numberOfChunks === 1) {
        await execAsync(`cp "${file}" "${outputDir}/chunk-000${ext}"`);
        return;
      }

      const { stdout } = await execAsync(`${ffmpegPath} -i "${file}" 2>&1 | grep "Duration"`);
      const duration = stdout.match(/\d{2}:\d{2}:\d{2}\.\d{2}/s)[0];
      const [
        hours,
        minutes,
        seconds,
      ] = duration.split(":").map(parseFloat);

      const totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds;
      const segmentTime = Math.ceil(totalSeconds / numberOfChunks);

      const command = `${ffmpegPath} -i "${file}" -f segment -segment_time ${segmentTime} -c copy "${outputDir}/chunk-${index
        ? `${index}-`
        : ""}%03d${ext}"`;
      await execAsync(command);
    },
    transcribeFiles({
      files, outputDir, $,
    }) {
      const limiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 1000 / 59,
      });

      return Promise.all(files.map((file) => {
        return limiter.schedule(() => this.transcribe({
          file,
          outputDir,
          $,
        }));
      }));
    },
    transcribe({
      file, outputDir, $,
    }) {
      const form = this.createForm({
        file,
        outputDir,
      });
      return this.openai.createTranscription({
        $,
        form,
      });
    },
    getFullText(transcriptions = []) {
      return transcriptions.map((t) => t.text || t).join(" ");
    },
  },
  async run({ $ }) {
    const {
      url,
      path,
    } = this;

    if (!url && !path) {
      throw new ConfigurationError("Must specify either File URL or File Path");
    }

    let file;

    if (path) {
      if (!fs.existsSync(path)) {
        throw new ConfigurationError(`${path} does not exist`);
      }

      file = path;
    } else if (url) {
      const ext = extname(url).split("?")[0];

      const response = await axios({
        method: "GET",
        url,
        responseType: "stream",
        timeout: 250000,
      });

      const bufferStream = new stream.PassThrough();
      response.data.pipe(bufferStream);

      const downloadPath = join("/tmp", `audio${ext}`);
      const writeStream = fs.createWriteStream(downloadPath);

      await pipelineAsync(bufferStream, writeStream);

      file = downloadPath;
    }

    const transcriptions = await this.chunkFileAndTranscribe({
      file,
      $,
    });

    if (transcriptions.length) {
      $.export("$summary", "Successfully created transcription");
    }

    return {
      transcription: this.getFullText(transcriptions),
      transcriptions,
    };
  },
};

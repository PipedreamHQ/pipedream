import axios from "axios";
import fs from "fs";
import {
  join, extname,
} from "path";
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/common.mjs";
import constants from "../common/constants.mjs";
import lang from "../common/lang.mjs";
import openai from "../../app/openai.app.mjs";
import { promisify } from "util";
import stream from "stream";
import { exec } from "child_process";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const COMMON_AUDIO_FORMATS_TEXT = "Your audio file must be in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.";

const execAsync = promisify(exec);
const pipelineAsync = promisify(stream.pipeline);

export default {
  name: "Create Transcription",
  version: "0.0.3",
  key: "openai-create-transcription",
  description: "Transcribes audio into the input language. [See docs here](https://platform.openai.com/docs/api-reference/audio/create).",
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
      default: "en",
      options: lang.LANGUAGES.map((l) => ({
        label: l.label,
        value: l.value,
      })),
    },
  },
  methods: {
    async chunkFileAndTranscribe({
      file, form, $,
    }) {
      const ffmpegPath = ffmpegInstaller.path;
      const ext = extname(file);
      const outputDir = join("/tmp", "chunks");
      await execAsync(`mkdir -p ${outputDir}`);

      const command = `${ffmpegPath} -i ${file} -f segment -segment_time 60 -c copy ${outputDir}/chunk-%03d${ext}`;
      try {
        await execAsync(command);
      } catch (err) {
        throw new Error(err);
      }

      const files = await fs.promises.readdir(outputDir);
      let transcription = "";
      for (const file of files) {
        const readStream = fs.createReadStream(join(outputDir, file));
        form.append("file", readStream);
        const response = await this.openai.createTranscription({
          $,
          form,
        });
        transcription += response.data?.text;
      }

      return {
        transcription,
      };
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
  async run({ $ }) {
    const {
      url,
      path,
    } = this;

    if (!url && !path) {
      throw new Error("Must specify either File URL or File Path");
    }

    const form = new FormData();
    form.append("model", "whisper-1");
    if (this.prompt) form.append("prompt", this.prompt);
    if (this.temperature) form.append("temperature", this.temperature);
    if (this.language) form.append("language", this.language);
    if (this.responseFormat) form.append("response_format", this.responseFormat);

    let file;
    if (path) {
      if (!fs.existsSync(path)) {
        throw new Error(`${path} does not exist`);
      }
      file = path;
    } else if (url) {
      const ext = extname(url);

      const response = await axios({
        method: "GET",
        url,
        responseType: "stream",
        timeout: 250000,
      });

      const bufferStream = new stream.PassThrough();
      response.data.pipe(bufferStream);

      const downloadPath = join("/tmp", `audio.${ext}`);
      const writeStream = fs.createWriteStream(downloadPath);

      try {
        await pipelineAsync(bufferStream, writeStream);
      } catch (err) {
        throw new Error(err);
      }

      file = downloadPath;
    }

    const response = await this.chunkFileAndTranscribe({
      file,
      form,
      $,
    });

    if (response) {
      $.export("$summary", "Successfully created transcription");
    }

    return response;
  },
};

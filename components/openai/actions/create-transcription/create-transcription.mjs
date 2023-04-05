import fs from "fs";
import got from "got";
import { extname } from "path";
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/common.mjs";
import constants from "../common/constants.mjs";
import lang from "../common/lang.mjs";
import openai from "../../app/openai.app.mjs";

const COMMON_AUDIO_FORMATS_TEXT = "Your audio file must be in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.";

export default {
  name: "Create Transcription",
  version: "0.0.2",
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

    if (path) {
      if (!fs.existsSync(path)) {
        throw new Error(`${path} does not exist`);
      }
      const readStream = fs.createReadStream(path);
      form.append("file", readStream);
    } else if (url) {
      const ext = extname(url);
      // OpenAI only supports a few audio formats and uses the extension to determine the format
      const tempFilePath = `/tmp/audioFile${ext}`;

      const writeStream = fs.createWriteStream(tempFilePath);
      const responseStream = got.stream(url);
      responseStream.pipe(writeStream);
      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
        responseStream.on("error", reject);
      });
      const readStream = fs.createReadStream(tempFilePath);
      form.append("file", readStream);
    }
    const response = await this.openai.createTranscription({
      $,
      form,
    });

    if (response) {
      $.export("$summary", "Successfully created transcription");
    }

    return response;
  },
};

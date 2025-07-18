import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import {
  checkTmp,
  clearObj,
} from "../../common/utils.mjs";
import pdforge from "../../pdforge.app.mjs";

export default {
  props: {
    pdforge,
    convertToImage: {
      type: "boolean",
      label: "Convert to Image",
      description: "If true, will return a .PNG file instead of a .PDF file",
      default: false,
    },
    asyncMode: {
      type: "boolean",
      label: "Async Mode",
      description: "If `true`, the request will be executed in the background and the response will be sent to the webhook URL.",
      default: false,
      reloadProps: true,
    },
    saveS3: {
      type: "boolean",
      label: "Save to S3",
      description: "If `true`, the generated file will be saved to the provided s3 bucket; if `false`, the generated file will be saved to the Pipedream `/tmp` directory.",
      default: true,
      reloadProps: true,
      hidden: true,
    },
    s3bucket: {
      propDefinition: [
        pdforge,
        "s3bucket",
      ],
      hidden: true,
    },
    s3key: {
      propDefinition: [
        pdforge,
        "s3key",
      ],
      hidden: true,
    },
    fileName: {
      propDefinition: [
        pdforge,
        "fileName",
      ],
      hidden: true,
    },
    webhook: {
      propDefinition: [
        pdforge,
        "webhook",
      ],
      hidden: true,
    },
  },
  async additionalProps(props) {
    const isAsync = this.asyncMode;
    const saveAtS3 = this.saveS3;

    props.webhook.hidden = !isAsync;
    props.saveS3.hidden = isAsync;

    const showS3 = !isAsync && saveAtS3;
    props.s3bucket.hidden = !showS3;
    props.s3key.hidden = !showS3;
    props.fileName.hidden = showS3;
    return {};
  },
  async run({ $ }) {
    let response;

    const data = {
      ...this.getAdditionalData(),
      convertToImage: this.convertToImage,
      webhook: this.webhook,
    };

    if (this.saveS3) {
      data.s3Bucked = this.s3Bucked;
      data.s3Key = this.s3Key;
    }

    if (this.asyncMode) {
      data.webhook = this.webhook;
    }

    const fn = this.getFunction();

    const asyncResponse = await fn({
      $,
      asyncMode: this.asyncMode,
      data: clearObj(data),
    });

    response = asyncResponse;

    if (!this.saveS3 && !this.asyncMode) {
      const fileStream = await this.pdforge._makeRequest({
        baseUrl: response.signedUrl,
        responseType: "stream",
        removeHeader: true,
      });

      const filePath = checkTmp(
        `${this.fileName}.${this.convertToImage
          ? "PNG"
          : "PDF"}`,
      );

      const pipeline = promisify(stream.pipeline);
      await pipeline(fileStream, fs.createWriteStream(filePath));

      response = {
        ...asyncResponse,
        filePath,
      };
    }

    if (this.asyncMode) {
      $.export("$summary", "Asynchronous request initiated. Await the webhook callback for completion.");
    } else {
      $.export("$summary", this.getSummary(this));
    }

    return response;
  },
};

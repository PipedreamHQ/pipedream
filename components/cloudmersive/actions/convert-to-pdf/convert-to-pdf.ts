import { defineAction } from "@pipedream/types";
import {
  ConfigurationError,
  getFileStream,
} from "@pipedream/platform";
import cloudmersive from "../../app/cloudmersive.app";
import { DOCS } from "../../common/constants";
import { ConvertToPDFParams } from "../../common/types";
import { Readable } from "stream";

export default defineAction({
  name: "Convert to PDF",
  description: `Convert Office Word Documents (docx) to PDF [See the documentation](${DOCS.convertToPDF})`,
  key: "cloudmersive-convert-to-pdf",
  version: "1.0.0",
  type: "action",
  props: {
    cloudmersive,
    file: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/file.docx`)",
    },
  },
  methods: {
    streamToBuffer(stream: Readable): Promise<Buffer> {
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    const { file } = this;
    let fileBuffer: Buffer;

    try {
      const stream = await getFileStream(file);
      fileBuffer = await this.streamToBuffer(stream);
    } catch (err) {
      throw new ConfigurationError(
        `**Error when reading file** - check the file path and try again.
        ${err}`,
      );
    }

    const params: ConvertToPDFParams = {
      $,
      file: fileBuffer,
    };

    const response = await this.cloudmersive.convertToPDF(params);

    $.export("$summary", `Converted file "${file}"`);

    return response;
  },
});

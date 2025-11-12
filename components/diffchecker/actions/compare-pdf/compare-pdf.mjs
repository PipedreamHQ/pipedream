import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import diffchecker from "../../diffchecker.app.mjs";

export default {
  key: "diffchecker-compare-pdf",
  name: "Compare PDFs",
  description: "Compares two PDFs and returns the result. [See the documentation](https://www.diffchecker.com/public-api/)",
  version: "1.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    diffchecker,
    outputType: {
      propDefinition: [
        diffchecker,
        "outputType",
      ],
    },
    diffLevel: {
      propDefinition: [
        diffchecker,
        "diffLevel",
      ],
      optional: true,
    },
    leftPdf: {
      type: "string",
      label: "Left PDF (File Path Or Url)",
      description: "Left PDF file you want to compare. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.pdf`).",
    },
    rightPdf: {
      type: "string",
      label: "Right PDF (File Path Or Url)",
      description: "Right PDF file you want to compare. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.pdf`).",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    let data = new FormData();
    const [
      leftStream,
      rightStream,
    ] = await Promise.all([
      getFileStreamAndMetadata(this.leftPdf),
      getFileStreamAndMetadata(this.rightPdf),
    ]);

    data.append("left_pdf", leftStream.stream, {
      contentType: leftStream.metadata.contentType,
      knownLength: leftStream.metadata.size,
      filename: leftStream.metadata.name,
    });
    data.append("right_pdf", rightStream.stream, {
      contentType: rightStream.metadata.contentType,
      knownLength: rightStream.metadata.size,
      filename: rightStream.metadata.name,
    });

    const response = await this.diffchecker.comparePdfs({
      data,
      outputType: this.outputType,
      diffLevel: this.diffLevel,
      headers: data.getHeaders(),
    });

    $.export("$summary", "Successfully compared PDFs");
    return response;
  },
};

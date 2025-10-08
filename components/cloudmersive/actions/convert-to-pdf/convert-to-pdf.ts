import path from "path";
import { promises as fs } from "fs";
import FormData from "form-data";
import { defineAction } from "@pipedream/types";
import {
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";
import cloudmersive from "../../app/cloudmersive.app";
import { DOCS } from "../../common/constants";

export default defineAction({
  name: "Convert to PDF",
  description: `Convert Office Word Documents (docx) to PDF [See the documentation](${DOCS.convertToPDF})`,
  key: "cloudmersive-convert-to-pdf",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudmersive,
    file: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/file.docx`)",
    },
    outputType: {
      type: "string",
      label: "Output Type",
      description: "The desired output type. Select **File Path** to save the converted file to `/tmp` and return the path.",
      options: [
        {
          label: "Binary",
          value: "binary",
        },
        {
          label: "File Path",
          value: "file_path",
        },
      ],
      default: "binary",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      cloudmersive,
      file,
      outputType,
    } = this;

    const data = new FormData();
    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(file);

    try {

      data.append("inputFile", stream, {
        filename: metadata.name,
        contentType: metadata.contentType,
      });

    } catch (err) {
      throw new ConfigurationError(
        `**Error when reading file** - check the file path and try again.
        ${err}`,
      );
    }

    const response = await cloudmersive.convertToPDF({
      $,
      data,
    });

    if (outputType === "file_path") {
      const fileName = path.parse(metadata.name).name;
      const outputPath = `/tmp/${fileName}.pdf`;
      await fs.writeFile(outputPath, response);
      $.export("$summary", `Successfully converted \`${file}\` and saved to \`${outputPath}\`.`);
      return {
        outputPath,
      };
    }

    $.export("$summary", `Successfully converted \`${file}\``);

    return response;
  },
});

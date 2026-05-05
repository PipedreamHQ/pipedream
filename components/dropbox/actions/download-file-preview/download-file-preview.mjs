import dropbox from "../../dropbox.app.mjs";
import fs from "fs";
import got from "got";
import stream from "stream";
import { promisify } from "util";
import consts from "../../common/consts.mjs";
import { checkTmp } from "../../common/utils.mjs";

export default {
  name: "Download File Preview",
  description: "Download a file preview from Dropbox. [See the documentation](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesGetPreview__anchor)",
  key: "dropbox-download-file-preview",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dropbox,
    info: {
      type: "alert",
      alertType: "info",
      content: `PDF previews are generated for files with the following extensions: .ai, .doc, .docm, .docx, .eps, .gdoc, .gslides, .odp, .odt, .pps, .ppsm, .ppsx, .ppt, .pptm, .pptx, .rtf.
      \nHTML previews are generated for files with the following extensions: .csv, .ods, .xls, .xlsm, .gsheet, .xlsx.`,
    },
    path: {
      propDefinition: [
        dropbox,
        "path",
      ],
    },
    name: {
      type: "string",
      label: "File Name",
      description: "The new name of the file to be saved, including its extension. e.g: `myFile.pdf`",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      PDF_PREVIEW_EXTENSIONS, HTML_PREVIEW_EXTENSIONS,
    } = consts;

    const path = this.dropbox.getNormalizedPath(this.path, false);

    let filePath = null;
    const extension = path.split(".").pop();
    const newFilename = this.name?.split(".").slice(0, -1);
    const newExtension = this.name?.split(".").pop();

    if (
      !PDF_PREVIEW_EXTENSIONS.includes(extension)
      && !HTML_PREVIEW_EXTENSIONS.includes(extension)
    ) {
      // file not supported for preview, download in original format
      try {
        const linkResponse = await this.dropbox.filesGetTemporaryLink({
          path,
        });

        if (!linkResponse || !linkResponse.result) {
          throw new Error("Failed to get temporary download link from Dropbox");
        }

        const {
          link, metadata,
        } = linkResponse.result;

        const fileName = this.name
          ? extension === newExtension
            ? this.name
            : `${newFilename}.${extension}`
          : metadata.name;
        const cleanFileName = fileName.replace(/[?$#&{}[]<>\*!@:\+\\\/]/g, "");

        filePath = checkTmp(cleanFileName);
        const pipeline = promisify(stream.pipeline);

        await pipeline(
          got.stream(link),
          fs.createWriteStream(filePath),
        );
      } catch (error) {
        throw new Error(`Failed to download file: ${error.message}`);
      }

      $.export("$summary", `Successfully downloaded file in original format to "${filePath}"`);
    } else {
      // file supported for preview, download preview
      try {
        const previewResponse = await this.dropbox.filesGetPreview({
          path,
        });
        const buffer = previewResponse.result.fileBinary;
        filePath = checkTmp(this.name);
        fs.writeFileSync(filePath, buffer);
      } catch (error) {
        throw new Error(`Failed to download file preview: ${error.message}`);
      }

      $.export("$summary", `Successfully downloaded file preview to "${filePath}"`);
    }

    return {
      filePath,
    };
  },
};

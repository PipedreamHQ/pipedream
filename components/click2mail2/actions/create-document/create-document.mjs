import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import click2mail2 from "../../click2mail2.app.mjs";
import { FORMATS } from "../../common/constants.mjs";

export default {
  key: "click2mail2-create-document",
  name: "Create Document",
  version: "1.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new document in your account from an uploaded file or a URL. [See the documentation for file](https://developers.click2mail.com/reference/createdocument_1).  [See the documentation for URL](https://developers.click2mail.com/reference/createdocumentfromurl)",
  type: "action",
  props: {
    click2mail2,
    documentName: {
      type: "string",
      label: "Document Name",
      description: "Document name as it will be stored in your account.",
      optional: true,
    },
    documentFormat: {
      type: "string",
      label: "Document Format",
      description: "The format of the document.",
      options: FORMATS,
    },
    documentClass: {
      propDefinition: [
        click2mail2,
        "documentClass",
      ],
    },
    file: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`).",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      click2mail2,
      file,
      documentName,
      documentFormat,
      documentClass,
    } = this;

    const isUrl = file.startsWith("http://") || file.startsWith("https://");

    const objToSend = {
      params: {
        documentName,
        documentFormat,
        documentClass,
      },
    };

    if (!isUrl) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);
      const formData = new FormData();
      formData.append("file", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });

      objToSend.data = formData;
      objToSend.headers = formData.getHeaders();

    } else {
      objToSend.params.url = file;
    }

    const response = await click2mail2.create({
      $,
      path: `${!isUrl
        ? "documents"
        : "documents/url"}`,
      ...objToSend,
    });

    $.export("$summary", `A new file with Id: ${response.id} was successfully created!`);
    return response;
  },
};

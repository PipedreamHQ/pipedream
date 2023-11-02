import FormData from "form-data";
import fs from "fs";
import click2mail2 from "../../click2mail2.app.mjs";
import { FORMATS } from "../../common/constants.mjs";

export default {
  key: "click2mail2-create-document",
  name: "Create Document",
  version: "0.0.1",
  description: "Creates a new document in your account from an uploaded file or a URL. [See the documentation for file](https://developers.click2mail.com/reference/createdocument_1).  [See the documentation for URL](https://developers.click2mail.com/reference/createdocumentfromurl)",
  type: "action",
  props: {
    click2mail2,
    uploadType: {
      type: "string",
      label: "Upload Type",
      description: "The type of the upload.",
      reloadProps: true,
      options: [
        "URL",
        "File",
      ],
    },
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
  },
  async additionalProps() {
    const props = {};
    if (this.uploadType === "URL") {
      props.url = {
        type: "string",
        label: "URL",
        description: "Document url",
      };
    } else {
      props.file = {
        type: "string",
        label: "File",
        description: "Path of the file in /tmp folder. To upload a file to /tmp folder, please follow the [doc here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      click2mail2,
      uploadType,
      file,
      ...params
    } = this;

    let objToSend = {};

    if (uploadType === "File") {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(file));

      objToSend = {
        data: formData,
        headers: formData.getHeaders(),
      };
    }
    const response = await click2mail2.create({
      $,
      path: `${uploadType === "File"
        ? "documents"
        : "documents/url"}`,
      params,
      ...objToSend,
    });

    $.export("$summary", `A new file with Id: ${response.id} was successfully created!`);
    return response;
  },
};

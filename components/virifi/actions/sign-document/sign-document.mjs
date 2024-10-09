import fs from "fs";
import FormData from "form-data";
import app from "../../virifi.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "virifi-sign-document",
  name: "Sign Document",
  description: "Enables the sending process of a PDF document for signing. Upload the PDF document and specify the participants who need to sign the document, if any. [See the documentation](https://virifi.io/open/api-guide)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file to be sent for signing.",
    },
    digitalTwin: {
      propDefinition: [
        app,
        "digitalTwin",
      ],
    },
    doc: {
      type: "string",
      label: "Document",
      description: "The PDF document to be sent for signing. This should be the path to the file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    signBy: {
      type: "string",
      label: "Sign By",
      description: "The participants who need to sign the document.",
      options: Object.values(constants.SIGN_BY_OPTION),
    },
    signUser: {
      type: "string[]",
      label: "Sign Users",
      description: "The participants who need to sign the document where each row should contain at least the email address of the participant in JSON format. Eg. `{\"email\":\"user@company.com\",\"number\":\"1234567890\"}`. The account owner's email address should be listed as the first entry when selecting `signByYourself` or `signAndInviteOthers` in the **Sign By** property.",
    },
    signatureType: {
      type: "string",
      label: "Signature Type",
      description: "The type of signature to use.",
      options: Object.values(constants.SIGNATURE_TYPE_OPTION),
    },
  },
  methods: {
    signDocument(args = {}) {
      return this.app.post({
        path: "/sign-document",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      signDocument,
      doc,
      fileName,
      digitalTwin,
      signBy,
      signUser,
      signatureType,
    } = this;

    const form = new FormData();
    form.append("doc", fs.createReadStream(doc));
    form.append("fileName", fileName);
    form.append("digitalTwin", String(digitalTwin));
    form.append("signBy", signBy);
    form.append("signUser", JSON.stringify(signUser));
    form.append("signatureType", signatureType);

    const response = await signDocument({
      $,
      data: form,
      headers: form.getHeaders(),
    });

    $.export("$summary", "Document sent for signing successfully");
    return response;
  },
};

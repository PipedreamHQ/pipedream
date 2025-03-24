import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import { LANGUAGE_OPTIONS } from "../../common/constants.mjs";
import {
  checkTmp, parseObject,
} from "../../common/utils.mjs";
import ignisign from "../../ignisign.app.mjs";

export default {
  key: "ignisign-create-signature-request",
  name: "Create Signature Request",
  description: "Creates a document signature request through IgniSign. [See the documentation](https://ignisign.io/docs/ignisign-api/init-signature-request)",
  version: "0.0.1",
  type: "action",
  props: {
    ignisign,
    signerIds: {
      propDefinition: [
        ignisign,
        "signerIds",
      ],
    },
    documentLabel: {
      type: "string",
      label: "Document Label",
      description: "A user-friendly label to identify the document.",
      optional: true,
    },
    documentDescription: {
      type: "string",
      label: "Document Description",
      description: "A detailed, human-readable description of the document.",
      optional: true,
    },
    documentExternalId: {
      type: "string",
      label: "Document External Id",
      description: "An optional external identifier that can be used to reference the document from external systems. It's a free text. Ignisign's system do not interprete it.",
      optional: true,
    },
    file: {
      type: "string",
      label: "Document File",
      description: "The file to be uploaded, please provide a file from `/tmp`. To upload a file to `/tmp` folder, please follow the doc [here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the signature request.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the signature request.",
      optional: true,
    },
    expirationDateIsActivated: {
      type: "boolean",
      label: "Expiration Date Is Activated",
      description: "Indicates whether the expiration date is activated.",
      reloadProps: true,
      optional: true,
    },
    expirationDate: {
      type: "string",
      label: "Expiration Date",
      description: "The expiration date. The action linked to this date is performed every 5 minutes, at 5, 10, 15... 55.",
      optional: true,
      hidden: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Represents the languages for signatures supported by a signature profile.",
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
  },
  async additionalProps(props) {
    props.expirationDate.hidden = !this.expirationDateIsActivated;
    return {};
  },
  async run({ $ }) {
    const data = new FormData();

    const { signatureRequestId } = await this.ignisign.initSignatureRequest();

    const { documentId } = await this.ignisign.initDocument({
      data: {
        signatureRequestId,
        label: this.documentLabel,
        description: this.documentDescription,
        externalId: this.documentExternalId,
      },
    });

    const path = checkTmp(this.file);
    if (!fs.existsSync(path)) {
      await this.ignisign.closeSignatureRequest({
        signatureRequestId,
      });
      throw new ConfigurationError("File does not exist!");
    }
    const file = fs.createReadStream(path);
    data.append("file", file);

    await this.ignisign.uploadFile({
      documentId,
      data,
      headers: data.getHeaders(),
    });

    await this.ignisign.updateSignatureRequest({
      signatureRequestId,
      data: {
        title: this.title,
        description: this.description,
        expirationDateIsActivated: this.expirationDateIsActivated,
        expirationDate: this.expirationDate,
        language: this.language,
        documentIds: [
          documentId,
        ],
        signerIds: parseObject(this.signerIds),
      },
    });

    await this.ignisign.publishSignatureRequest({
      $,
      signatureRequestId,
    });

    $.export("$summary", `Successfully published signature request with ID ${signatureRequestId}`);
    return {
      signatureRequestId,
    };
  },
};

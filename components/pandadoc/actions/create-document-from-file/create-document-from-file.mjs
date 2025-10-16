import { ConfigurationError } from "@pipedream/platform";
import app from "../../pandadoc.app.mjs";
import createDocumentAttachment from "../create-document-attachment/create-document-attachment.mjs";

export default {
  key: "pandadoc-create-document-from-file",
  name: "Create Document From File",
  description: "Create a document from a file or public file URL. [See the documentation here](https://developers.pandadoc.com/reference/create-document-from-pdf)",
  type: "action",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    recipients: {
      propDefinition: [
        app,
        "recipients",
      ],
    },
    file: {
      propDefinition: [
        app,
        "file",
      ],
    },
    documentFolderId: {
      propDefinition: [
        app,
        "documentFolderId",
      ],
    },
    fields: {
      type: "string",
      label: "Fields",
      description: `A \`fields\` object containing fields to add to the document. [See the documentation](https://developers.pandadoc.com/reference/create-document-from-pdf) for more information about fields.
      \nE.g. \`{ "name": { "value": "Jane", "role": "user" }, "like": { "value": true, "role": "user" } }\``,
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: createDocumentAttachment.methods,
  async run({ $ }) {
    const {
      name,
      recipients,
      file,
      documentFolderId,
    } = this;

    let parsedRecipients;
    try {
      parsedRecipients = recipients.map((s) => JSON.parse(s));
    } catch (err) {
      throw new ConfigurationError("**Error parsing recipients** - each must be a valid JSON-stringified object");
    }

    const json = {
      name,
      recipients: parsedRecipients,
      folder_uuid: documentFolderId,
    };
    if (this.fields) {
      json.parse_form_fields = true;
      json.fields = typeof this.fields === "string"
        ? JSON.parse(this.fields)
        : this.fields;
    }

    const data = await this.getFormData(file);
    const contentType = `multipart/form-data; boundary=${data._boundary}`;
    data.append("data", JSON.stringify(json));

    const response = await this.app.createDocument({
      $,
      data,
      headers: {
        "Content-Type": contentType,
      },
    });

    $.export("$summary", `Successfully created document with ID: ${response.uuid}`);
    return response;
  },
};

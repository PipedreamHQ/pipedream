import salesforce from "../../salesforce_rest_api.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-salesforce-insert-blob-data",
  name: "Insert Blob Data",
  description: toSingleLineString(`
    Inserts blob data in Salesforce standard objects.
    See [docs](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_insert_update_blob.htm)
  `),
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    entiy_name: {
      type: "string",
      label: "Entity Name",
      description: "Name of the entity to insert as part of the form-data sent along the Salesforce API as a request with multipart/form-data content type. I.e. entity_document for Documents.",
    },
    entity_document: {
      type: "string",
      label: "Entity Document",
      description: "Salesforce object entity to insert.",
    },
    form_content_name: {
      type: "string",
      label: "Form Content Name",
      description: "Name of the binary content to insert as part of  the form-data sent along the Salesforce API as a request with multipart/form-data content type.",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Filename of the blob data to insert.",
    },
    content_type: {
      type: "string",
      label: "Content Type",
      description: "Mime type of the content to insert.",
    },
    attachment_binarycontent: {
      type: "string",
      label: "Attachment Binary Content",
      description: "Binary content of the blob data to insert.",
    },
    sobject_name: {
      type: "string",
      label: "SObject Type",
      description: "Salesforce standard object type to insert.",
    },
  },
  async run({ $ }) {
    const payloadPart1 = `----------------------------932677621329676389151855
    \r\nContent-Disposition: form-data; name="${this.entiy_name}""
    \r\nContent-Type: application/json
    \r\n\r\n${this.entity_document}\r\n\r\n
    \r\n\r\n----------------------------932677621329676389151855
    \r\nContent-Disposition: form-data; name="${this.form_content_name}"; filename="${this.filename}"
    \r\nContent-Type: ${this.content_type}
    \r\n\r\n`;

    const payloadPart2 = "\r\n\r\n----------------------------932677621329676389151855--";

    const data = `${payloadPart1}${this.attachment_binarycontent}${payloadPart2}`;

    const headers = {
      "Content-Type": "multipart/form-data; boundary=--------------------------932677621329676389151855",
    };

    const response = await this.salesforce.insertBlobData(this.sobject_name, {
      $,
      headers,
      data,
    });
    $.export("$summary", `Inserted Blob data to ${this.sobject_name}`);
    return response;
  },
};

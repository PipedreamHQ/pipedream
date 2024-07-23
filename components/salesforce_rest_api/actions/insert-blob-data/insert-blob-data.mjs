import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-insert-blob-data",
  name: "Insert Blob Data",
  description: "Inserts blob data in Salesforce standard objects. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_insert_update_blob.htm)",
  version: "0.2.8",
  type: "action",
  props: {
    salesforce,
    entiyName: {
      type: "string",
      label: "Entity Name",
      description: "Name of the entity to insert as part of the form-data sent along the Salesforce API as a request with multipart/form-data content type. I.e. entityDocument for Documents.",
    },
    entityDocument: {
      type: "string",
      label: "Entity Document",
      description: "Salesforce object entity to insert.",
    },
    formContentName: {
      type: "string",
      label: "Form Content Name",
      description: "Name of the binary content to insert as part of  the form-data sent along the Salesforce API as a request with multipart/form-data content type.",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Filename of the blob data to insert.",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Mime type of the content to insert.",
    },
    attachmentBinarycontent: {
      type: "string",
      label: "Attachment Binary Content",
      description: "Binary content of the blob data to insert.",
    },
    sobjectName: {
      type: "string",
      label: "SObject Type",
      description: "Salesforce standard object type to insert.",
    },
  },
  async run({ $ }) {
    const payloadPart1 = `----------------------------932677621329676389151855
    \r\nContent-Disposition: form-data; name="${this.entiyName}""
    \r\nContent-Type: application/json
    \r\n\r\n${this.entityDocument}\r\n\r\n
    \r\n\r\n----------------------------932677621329676389151855
    \r\nContent-Disposition: form-data; name="${this.formContentName}"; filename="${this.filename}"
    \r\nContent-Type: ${this.contentType}
    \r\n\r\n`;

    const payloadPart2 = "\r\n\r\n----------------------------932677621329676389151855--";

    const data = `${payloadPart1}${this.attachmentBinarycontent}${payloadPart2}`;

    const headers = {
      "Content-Type": "multipart/form-data; boundary=--------------------------932677621329676389151855",
    };

    const response = await this.salesforce.insertBlobData(this.sobjectName, {
      $,
      headers,
      data,
    });
    $.export("$summary", `Successfully inserted blob data in ${this.sobjectName}`);
    return response;
  },
};

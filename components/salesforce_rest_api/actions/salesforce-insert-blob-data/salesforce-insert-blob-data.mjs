// legacy_hash_id: a_a4i8Gv
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-insert-blob-data",
  name: "Insert Blob Data",
  description: "Inserts blob data in Salesforce standard objects.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    entiy_name: {
      type: "string",
      description: "Name of the entity to insert as part of the form-data sent along the Salesforce API as a request with multipart/form-data content type. I.e. entity_document for Documents.",
    },
    entity_document: {
      type: "string",
      description: "Salesforce object entity to insert.",
    },
    form_content_name: {
      type: "string",
      description: "Name of the binary content to insert as part of  the form-data sent along the Salesforce API as a request with multipart/form-data content type.",
    },
    filename: {
      type: "string",
      description: "Filename of the blob data to insert.",
    },
    content_type: {
      type: "string",
      description: "Mime type of the content to insert.",
    },
    attachment_binarycontent: {
      type: "string",
      description: "Binary content of the blob data to insert.",
    },
    sobject_name: {
      type: "string",
      description: "Salesforce standard object type to insert.",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm

    const payloadPart1 = `----------------------------932677621329676389151855
    \r\nContent-Disposition: form-data; name=\"${this.entiy_name}\""
    \r\nContent-Type: application/json
    \r\n\r\n${this.entity_document}\r\n\r\n
    \r\n\r\n----------------------------932677621329676389151855
    \r\nContent-Disposition: form-data; name=\"${this.form_content_name}\"; filename=\"${this.filename}\"
    \r\nContent-Type: ${this.content_type}
    \r\n\r\n`;

    const payloadPart2 = "\r\n\r\n----------------------------932677621329676389151855--";

    const data = `${payloadPart1}${this.attachment_binarycontent}${payloadPart2}`;

    return await axios($, {
      method: "post",
      url: `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/sobjects/${this.sobject_name}/`,
      headers: {
        "Authorization": `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
        "Content-Type": "multipart/form-data; boundary=--------------------------932677621329676389151855",
      },
      data,
    });
  },
};

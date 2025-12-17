import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import { TYPE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import signaturit from "../../signaturit.app.mjs";

export default {
  key: "signaturit-create-certified-email",
  name: "Create Certified Email",
  description: "Initiates the creation of a certified email. [See the documentation](https://docs.signaturit.com/api/latest#emails_create_email)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    signaturit,
    body: {
      propDefinition: [
        signaturit,
        "body",
      ],
      optional: true,
    },
    brandingId: {
      propDefinition: [
        signaturit,
        "brandingId",
      ],
      optional: true,
    },
    eventsUrl: {
      propDefinition: [
        signaturit,
        "eventsUrl",
      ],
      optional: true,
    },
    data: {
      propDefinition: [
        signaturit,
        "data",
      ],
      optional: true,
    },
    attachments: {
      propDefinition: [
        signaturit,
        "attachments",
      ],
      optional: true,
    },
    recipients: {
      propDefinition: [
        signaturit,
        "recipients",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of certified email.",
      options: TYPE_OPTIONS,
      optional: true,
    },
    subject: {
      propDefinition: [
        signaturit,
        "subject",
      ],
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const formData = new FormData();

    let i = 0;
    for (const recipient of parseObject(this.recipients)) {
      for (const [
        key,
        value,
      ] of Object.entries(recipient)) {
        formData.append(`recipients[${i}][${key}]`, value);
      }
      i++;
    }
    if (this.data) {
      for (const [
        key,
        value,
      ] of Object.entries(this.data)) {
        formData.append(`data[${key}]`, value);
      }
      i++;
    }
    if (this.body) formData.append("body", this.body);
    if (this.brandingId) formData.append("branding_id", this.brandingId);
    if (this.eventsUrl) formData.append("events_url", this.eventsUrl);
    if (this.type) formData.append("type", this.type);
    if (this.subject) formData.append("subject", this.subject);

    if (this.attachments) {
      let j = 0;
      for (const file of parseObject(this.attachments)) {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(file);
        formData.append(`attachments[${j++}]`, stream, {
          contentType: metadata.contentType,
          knownLength: metadata.size,
          filename: metadata.name,
        });
      }
    }
    const response = await this.signaturit.createCertifiedEmail({
      $,
      data: formData,
      headers: formData.getHeaders(),
    });
    $.export("$summary", `Created certified email with ID: ${response.id}`);
    return response;
  },
};

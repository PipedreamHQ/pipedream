import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import {
  DELIVERY_TYPE_OPTIONS,
  SIGNATURE_TYPE_OPTIONS,
  SIGNING_MODE_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import signaturit from "../../signaturit.app.mjs";

export default {
  key: "signaturit-create-signature-request-from-template",
  name: "Create Signature Request from Template",
  description: "Creates a signature request using a pre-existing template. [See the documentation](https://docs.signaturit.com/api/latest#signatures_create_signature)",
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
      description: "Email body (html code is allowed) for **email** and **sms** type requests. Note: For **sms** request types it will be truncated to 120 characters Note: For **sms** the body should contain the tag **{{url}}** where we will include the document url.",
      optional: true,
    },
    brandingId: {
      propDefinition: [
        signaturit,
        "brandingId",
      ],
      optional: true,
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "Url to redirect the user when finish the signature process.",
      optional: true,
    },
    data: {
      propDefinition: [
        signaturit,
        "data",
      ],
      optional: true,
    },
    deliveryType: {
      type: "string",
      label: "Delivery Type",
      description: "Delivery type for signature request.",
      options: DELIVERY_TYPE_OPTIONS,
      optional: true,
    },
    expireTime: {
      type: "integer",
      label: "Expiration Time (days)",
      description: "Expiration time of the document in days (max 365).",
      min: 1,
      max: 365,
      optional: true,
    },
    eventsUrl: {
      propDefinition: [
        signaturit,
        "eventsUrl",
      ],
      optional: true,
    },
    files: {
      propDefinition: [
        signaturit,
        "attachments",
      ],
      label: "Files",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name assigned to the signature request.",
    },
    recipients: {
      propDefinition: [
        signaturit,
        "recipients",
      ],
      description: "List of recipients in JSON format, e.g., '{\"name\": \"John Doe\", \"email\": \"john@example.com\", \"phone\": \"34555667788\"}'. [See the documentation](https://docs.signaturit.com/api/latest#signatures_create_signature) for further information.",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "List with email recipients containing name and email for people that will receive a copy of the signed document when the process is completed. e.g., '{\"name\": \"John Doe\", \"email\": \"john@example.com\"}'.",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "Email Reply-To address.",
      optional: true,
    },
    reminders: {
      type: "string[]",
      label: "Reminders (days)",
      description: "Reminders in days to send automatic reminders. You can set it 0 to disable reminders. E.g. [1,3,4]",
      optional: true,
    },
    signingMode: {
      type: "string",
      label: "Signing Mode",
      description: "The signing mode lets you control the order in which your recipients receive and sign your documents.",
      options: SIGNING_MODE_OPTIONS,
      optional: true,
    },
    subject: {
      propDefinition: [
        signaturit,
        "subject",
      ],
      optional: true,
    },
    templates: {
      propDefinition: [
        signaturit,
        "templates",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the signature.",
      options: SIGNATURE_TYPE_OPTIONS,
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    transformArray({
      arr, prefixBase, formData,
    }) {
      let result = [];
      function processObject(obj, prefix = "") {
        for (let key in obj) {
          if (Array.isArray(obj[key])) {
            obj[key].forEach((item, index) => {
              processObject(item, `${prefix}[${key}][${index}]`);
            });
          } else if (typeof obj[key] === "object") {
            processObject(obj[key], `${prefix}[${key}]`);
          } else {
            result.push({
              key: `${prefixBase}${prefix}[${key}]`,
              value: `${obj[key]}`,
            });
          }
        }
      }
      arr.map((item, index) => {
        processObject(item, `[${index}]`);
      });
      for (const {
        key, value,
      } of result) {
        formData.append(key, value);
      }
      return result;
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    this.transformArray({
      arr: parseObject(this.recipients),
      prefixBase: "recipients",
      formData,
    });
    if (this.cc) {
      let j = 0;
      for (const item of parseObject(this.cc)) {
        formData.append(`cc[${j++}]`, item);
      }
    }
    if (this.data) {
      for (const [
        key,
        value,
      ] of Object.entries(parseObject(this.data))) {
        formData.append(`data[${key}]`, value);
      }
    }
    if (this.templates) {
      let k = 0;
      for (const templateId of parseObject(this.templates)) {
        formData.append(`templates[${k++}]`, templateId);
      }
    }
    if (this.reminders) {
      let m = 0;
      for (const reminder of parseObject(this.reminders)) {
        formData.append(`reminders[${m++}]`, reminder);
      }
    }
    if (this.body) formData.append("body", this.body);
    if (this.brandingId) formData.append("branding_id", this.brandingId);
    if (this.callbackUrl) formData.append("callback_url", this.callbackUrl);
    if (this.deliveryType) formData.append("delivery_type", this.deliveryType);
    if (this.expireTime) formData.append("expire_time", this.expireTime);
    if (this.eventsUrl) formData.append("events_url", this.eventsUrl);
    if (this.name) formData.append("name", this.name);
    if (this.replyTo) formData.append("reply_to", this.replyTo);
    if (this.type) formData.append("type", this.type);

    if (this.files) {
      let k = 0;
      for (const file of parseObject(this.files)) {
        const {
          stream, metadata,
        } = await getFileStreamAndMetadata(file);
        formData.append(`files[${k++}]`, stream, {
          contentType: metadata.contentType,
          knownLength: metadata.size,
          filename: metadata.name,
        });
      }
    }
    const response = await this.signaturit.createSignatureRequest({
      $,
      data: formData,
      headers: formData.getHeaders(),
    });
    $.export("$summary", `Created signature request with ID: ${response.id}`);
    return response;
  },
};

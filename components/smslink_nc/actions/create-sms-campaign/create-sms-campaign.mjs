import utils from "../../common/utils.mjs";
import app from "../../smslink_nc.app.mjs";

export default {
  key: "smslink_nc-create-sms-campaign",
  name: "Create SMS Campaign",
  description: "Create a new SMS campaign.",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the SMS campaign.",
    },
    sender: {
      type: "string",
      label: "Sender",
      description: "The sender of the SMS campaign. Eg. `SMSLink`.",
      default: "SMSLink",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the SMS campaign.",
    },
    autoOptimizeText: {
      type: "boolean",
      label: "Auto Optimize Text",
      description: "Whether to auto optimize the text of the SMS campaign.",
    },
    autoRemoveBlocklistedNumbers: {
      type: "boolean",
      label: "Auto Remove Blocklisted Numbers",
      description: "Whether to auto remove blocklisted numbers.",
      optional: true,
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The purpose of the SMS campaign.",
      optional: true,
      options: [
        "push",
      ],
    },
    test: {
      type: "boolean",
      label: "Test",
      description: "Whether the SMS campaign is a test.",
      optional: true,
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "The recipients of the SMS campaign. Where each recipient should be a phone number.",
      propDefinition: [
        app,
        "contactId",
        () => ({
          mapper: ({
            phone_number: value, first_name: firstName, last_name: lastName,
          }) => ({
            value,
            label: `${firstName || ""} ${lastName || ""} (${value})`.trim(),
          }),
        }),
      ],
    },
  },
  methods: {
    createCampaign(args = {}) {
      return this.app.post({
        path: "/sms-campaign",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createCampaign,
      title,
      sender,
      text,
      autoOptimizeText,
      autoRemoveBlocklistedNumbers,
      purpose,
      test,
      recipients,
    } = this;

    const response = await createCampaign({
      $,
      data: {
        title,
        sender,
        text,
        auto_optimize_text: autoOptimizeText,
        auto_remove_blocklisted_numbers: autoRemoveBlocklistedNumbers,
        purpose,
        test,
        recipients: utils.parseArray(recipients)?.map((phoneNumber) => ({
          phone_number: phoneNumber,
        })),
      },
    });
    $.export("$summary", "Successfully created SMS campaign.");
    return response;
  },
};

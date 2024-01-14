import postmark from "../../postmark.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "postmark-send-batch-with-templates",
  name: "Send Batch With Templates",
  description: "Send a batch of emails using a template [See the documentation](https://postmarkapp.com/developer/api/templates-api#send-batch-with-templates)",
  version: "0.0.1",
  type: "action",
  props: {
    postmark,
    amountOfEmails: {
      type: "integer",
      label: "Amount of emails",
      description: "The amount of emails to send in the batch.",
      min: 1,
      max: 20,
      reloadProps: true,
    },
    templateModel: {
      type: "string",
      label: "Template Model",
      description:
        "The model to be applied to the specified template to generate the email body and subject.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    return {
      templateAlias: {
        propDefinition: [
          postmark,
          "templateAlias",
        ],
      },
    };
  },
  async run({ $ }) {
    $;
    return this.templateAlias;
  },
};

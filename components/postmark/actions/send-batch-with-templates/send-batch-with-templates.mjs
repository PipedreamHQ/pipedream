import { ConfigurationError } from "@pipedream/platform";
import postmark from "../../postmark.app.mjs";
import common from "../common/common.mjs";
import props from "../common/props.mjs";
import templateProps from "../common/templateProps.mjs";

export default {
  ...common,
  key: "postmark-send-batch-with-templates",
  name: "Send Batch With Templates",
  description: "Send a batch of emails using a template [See the documentation](https://postmarkapp.com/developer/api/templates-api#send-batch-with-templates)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postmark,
    messages: {
      type: "string[]",
      label: "Messages",
      description: `You can specify the JSON-stringified email objects here directly. Example value:
\`\`\`
{
  "From": "sender@example.com",
  "To": "receiver2@example.com",
  "TemplateAlias": "welcome-notification",
  "TemplateModel": {
      "fizz": "buzz"
  }
}
\`\`\``,
      optional: true,
    },
    amountOfEmails: {
      type: "integer",
      label: "Amount of emails",
      description: "The amount of emails to send in the batch. Use this to build the email objects instead of using the `Messages` prop.",
      min: 1,
      max: 20,
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const allProps = {
      ...templateProps,
      ...props,
    };
    const amount = this.amountOfEmails ?? 0;
    const arr = [];
    for (let i = 1; i <= amount; i++) {
      arr.push(i);
    }
    return Object.fromEntries(arr.flatMap((i) => Object.entries(allProps).map(([
      key,
      value,
    ]) => [
      `${i}_${key}`,
      {
        ...value,
        label: `Email #${i} - ${value.label}`,
      },
    ])));
  },
  async run({ $ }) {
    let {
      amountOfEmails, messages,
    } = this;
    if (!amountOfEmails && !messages?.length) {
      throw new ConfigurationError("You must either specify the `Messages` object or use `Amount of Emails` to build the objects.");
    }
    const useMessages = messages?.length;
    const data = {
      Messages: useMessages || [],
    };
    if (useMessages) {
      try {
        data.Messages = typeof messages === "string"
          ? JSON.parse(messages)
          : messages.map(JSON.parse);
      } catch (err) {
        throw new ConfigurationError("Error when parsing `Messages` as JSON. Make sure all items are a valid JSON-stringified object.");
      }
    }

    else {
      for (let i = 1; i <= amountOfEmails; i++) {
        data.Messages.push(Object.fromEntries(Object.entries({
          From: this[`${i}_fromEmail`],
          To: this[`${i}_toEmail`],
          Cc: this[`${i}_ccEmail`],
          Bcc: this[`${i}_bccEmail`],
          Tag: this[`${i}_tag`],
          ReplyTo: this[`${i}_replyTo`],
          Headers: this[`${i}_customHeaders`],
          TrackOpens: this[`${i}_trackOpens`],
          TrackLinks: this[`${i}_trackLinks`],
          Attachments: this.getAttachmentData(this[`${i}_attachments`]),
          Metadata: this[`${i}_metadata`],
          MessageStream: this[`${i}_messageStream`],
          TemplateAlias: this[`${i}_templateAlias`],
          TemplateModel: this[`${i}_templateModel`],
        }).filter(([
          , value,
        ]) => value !== undefined)));
      }
    }

    const response = await this.postmark.sendBatchWithTemplate({
      $,
      data,
    });
    $.export("$summary", `Sent batch of ${data.Messages.length} emails successfully`);
    return response;
  },
};

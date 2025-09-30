import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-approve-workflow",
  name: "Approve Workflow",
  description: "Suspend the workflow until approved by email. [See the documentation](https://pipedream.com/docs/code/nodejs/rerun#flowsuspend)",
  version: "0.0.8",
  type: "action",
  props: {
    microsoftOutlook,
    recipients: {
      propDefinition: [
        microsoftOutlook,
        "recipients",
      ],
      optional: false,
    },
    subject: {
      propDefinition: [
        microsoftOutlook,
        "subject",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const {
      resume_url, cancel_url,
    } = $.flow.suspend();
    const opts = {
      content: `Click here to approve the workflow: ${resume_url}, \nand cancel here: ${cancel_url}`,
      ccRecipients: [],
      bccRecipients: [],
      ...this,
    };
    const response = await this.microsoftOutlook.sendEmail({
      $,
      data: {
        message: {
          ...this.microsoftOutlook.prepareMessageBody(opts),
        },
      },
    });
    $.export("$summary", "Email has been sent.");
    return response;
  },
};

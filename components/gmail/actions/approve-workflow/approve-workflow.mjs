import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-approve-workflow",
  name: "Approve Workflow",
  description: "Suspend the workflow until approved by email. [See the documentation](https://pipedream.com/docs/code/nodejs/rerun#flowsuspend)",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gmail,
    to: {
      propDefinition: [
        gmail,
        "to",
      ],
    },
    subject: {
      propDefinition: [
        gmail,
        "subject",
      ],
    },
    body: {
      propDefinition: [
        gmail,
        "body",
      ],
      description: "Include an email body to send. Supports HTML",
      optional: true,
    },
    bodyType: {
      propDefinition: [
        gmail,
        "bodyType",
      ],
      hidden: true,
      default: "html",
    },
  },
  async run({ $ }) {
    const {
      resume_url, cancel_url,
    } = $.flow.suspend();
    const approvalText = `Click here to approve:<br />${resume_url}<br /><br />Cancel here:<br />${cancel_url}`;
    const opts = await this.gmail.getOptionsToSendEmail($, {
      ...this,
      body: this.body
        ? `${this.body}<br /><br />${approvalText}`
        : `${approvalText}`,
    });
    const response = await this.gmail.sendEmail(opts);
    $.export("$summary", `Successfully sent email to ${this.to}`);
    return response;
  },
};

import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-approve-workflow",
  name: "Approve Workflow",
  description: "Suspend the workflow until approved by email. [See the documentation](https://pipedream.com/docs/code/nodejs/rerun#flowsuspend)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const {
      resume_url, cancel_url,
    } = $.flow.suspend();
    const opts = await this.gmail.getOptionsToSendEmail($, {
      body: `Click here to approve the workflow: ${resume_url}, \nand cancel here: ${cancel_url}`,
      ...this,
    });
    const response = await this.gmail.sendEmail(opts);
    $.export("$summary", `Successfully sent email to ${this.to}`);
    return response;
  },
};

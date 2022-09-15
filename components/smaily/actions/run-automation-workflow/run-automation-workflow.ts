import { defineAction } from "@pipedream/types";
import smaily from "../../app/smaily.app";

export default defineAction({
  name: "Run Automation Workflow",
  version: "0.0.1",
  key: "smaily-run-automation-workflow",
  description: "Send Automation Workflow. [See docs here](https://smaily.com/help/api/automations-2/autoresponder)",
  type: "action",
  props: {
    smaily,
    automationWorkflowId: {
      label: "Automation Workflow ID",
      description: "The ID of the automation workflow. E.g. This URL `...sendsmaily.net/workflows/35` the ID will be `35`",
      type: "string",
    },
    emails: {
      label: "Emails",
      description: "The emails to run",
      type: "string[]",
    },
  },
  async run({ $ }) {
    const parsedEmails = !Array.isArray(this.emails)
      ? JSON.parse(this.emails)
      : this.emails;

    const response = await this.smaily.sendConfirmationEmail({
      $,
      data: {
        autoresponder: this.automationWorkflowId,
        addresses: parsedEmails.map((email) => ({
          email,
        })),
      },
    });

    if (response.code < 300) {
      $.export("$summary", "Successfully runned workflow"); // this requested don't return an ID
    }

    return response;
  },
});

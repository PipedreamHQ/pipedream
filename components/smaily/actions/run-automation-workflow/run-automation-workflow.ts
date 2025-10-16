import { defineAction } from "@pipedream/types";
import smaily from "../../app/smaily.app";

export default defineAction({
  name: "Run Automation Workflow",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "smaily-run-automation-workflow",
  description: "Send Automation Workflow. [See docs here](https://smaily.com/help/api/automations-2/autoresponder)",
  type: "action",
  props: {
    smaily,
    automationWorkflowId: {
      propDefinition: [
        smaily,
        "automationWorkflowId",
      ],
    },
    segmentId: {
      propDefinition: [
        smaily,
        "segmentId",
      ],
    },
    emails: {
      propDefinition: [
        smaily,
        "emails",
        (c) => ({
          segmentId: c.segmentId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const parsedEmails = !Array.isArray(this.emails)
      ? JSON.parse(this.emails)
      : this.emails;

    const response = await this.smaily.runAutomationWorkflow({
      $,
      data: {
        autoresponder: this.automationWorkflowId,
        addresses: parsedEmails.map((email) => ({
          email,
        })),
      },
    });

    if (response.code < 300) {
      $.export("$summary", "Successfully ran workflow"); // this request doesn't return an ID
    }

    return response;
  },
});

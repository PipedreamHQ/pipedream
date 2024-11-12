import campaignMonitor from "../../campaign_monitor.app.mjs";

export default {
  key: "campaign_monitor-send-smart-transactional-email",
  name: "Send Smart Transactional Email",
  description: "Sends an intelligent transactional email to a specified recipient.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    campaignMonitor,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the recipient",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the email",
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.campaignMonitor.sendIntelligentEmail(
      this.email,
      this.subject,
      this.content,
      this.listId,
    );
    $.export("$summary", "Successfully sent smart transactional email");
    return response;
  },
};

import campaignMonitor from "../../campaign_monitor.app.mjs";

export default {
  key: "campaign_monitor-send-smart-transactional-email",
  name: "Send Smart Transactional Email",
  description: "Sends an intelligent transactional email to a specified recipient. [See the documentation](https://www.campaignmonitor.com/api/v3-3/transactional/#send-smart-email)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    campaignMonitor,
    clientId: {
      propDefinition: [
        campaignMonitor,
        "clientId",
      ],
    },
    smartEmailId: {
      propDefinition: [
        campaignMonitor,
        "smartEmailId",
        (c) => ({
          clientId: c.clientId,
        }),
      ],
    },
    to: {
      type: "string",
      label: "To",
      description: "An array of email addresses to send the email to",
    },
    cc: {
      type: "string",
      label: "CC",
      description: "An array of email address to carbon copy the email to",
      optional: true,
    },
    bcc: {
      type: "string",
      label: "BCC",
      description: "An array of email address to blind carbon copy the email to",
      optional: true,
    },
    consentToTrack: {
      propDefinition: [
        campaignMonitor,
        "consentToTrack",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.campaignMonitor.sendSmartEmail({
      $,
      smartEmailId: this.smartEmailId,
      data: {
        To: this.to,
        CC: this.cc,
        BCC: this.bcc,
        ConsentToTrack: this.consentToTrack,
      },
    });
    $.export("$summary", "Successfully sent smart transactional email");
    return response;
  },
};

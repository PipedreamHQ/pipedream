import campaignMonitor from "../../campaign_monitor.app.mjs";

export default {
  key: "campaign_monitor-add-subscriber",
  name: "Add Subscriber",
  description: "Creates a new subscriber on a specific list. [See the documentation](https://www.campaignmonitor.com/api/v3-3/subscribers/)",
  version: "0.0.3",
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
    listId: {
      propDefinition: [
        campaignMonitor,
        "listId",
        (c) => ({
          clientId: c.clientId,
        }),
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the subscriber",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the subscriber. Example: `+5012398752`",
      optional: true,
    },
    consentToTrack: {
      propDefinition: [
        campaignMonitor,
        "consentToTrack",
      ],
    },
    consentToSendSMS: {
      type: "string",
      label: "Consent to Send SMS",
      description: "Indicates if consent has been granted by the subscriber to receive Sms",
      options: [
        "Yes",
        "No",
        "Unchanged",
      ],
      default: "Unchanged",
      optional: true,
    },
    resubscribe: {
      type: "boolean",
      label: "Resubscribe",
      description: "Resubscribe if the email address has previously been unsubscribed",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.campaignMonitor.createSubscriber({
      $,
      listId: this.listId,
      data: {
        EmailAddress: this.email,
        Name: this.name,
        MobileNumber: this.phone,
        ConsentToTrack: this.consentToTrack,
        ConsentToSendSms: this.consentToSendSMS,
        Resubscribe: this.resubscribe,
      },
    });
    $.export("$summary", `Successfully added subscriber ${this.email}`);
    return response;
  },
};

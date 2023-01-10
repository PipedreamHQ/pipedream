import rev from "../../rev.app.mjs";

export default {
  key: "rev-create-automated-transcription-order-external-link",
  name: "Create Automated Transcription Order Using External Link",
  description: "Submit a new automated transcription order using a external link that contains the media. [See docs here.](https://www.rev.com/api/orderspostautomatedtranscription)",
  type: "action",
  version: "0.0.1",
  props: {
    rev,
    externalLink: {
      type: "string",
      label: "External Link",
      description: "A link to a web page where the media is embedded, but not a link to the media file.",
    },
    audioLength: {
      type: "integer",
      label: "Audio Seconds Length",
      description: "Required, except for Youtube URLs.",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference ID",
      description: "A reference number for the order, like the order ID tracked by another system.",
      optional: true,
    },
    notificationUrl: {
      type: "string",
      label: "Notification URL",
      description: "The url for notifications. Can be a Pipedream Webhook.",
      optional: true,
    },
    notificationLevel: {
      type: "string",
      label: "Notification Level",
      description: "Specifies which notifications are sent.",
      options: [
        {
          label: "A notification is sent whenever the order is in a new status or has a new comment.",
          value: "Detailed",
        },
        {
          label: "[Default] A notification is sent only when the order is complete.",
          value: "FinalOnly",
        },
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    await this.rev.placeOrder({
      data: {
        client_ref: this.reference,
        automated_transcription_options: {
          inputs: [
            {
              audio_length_seconds: this.audioLength,
              external_link: this.externalLink,
            },
          ],
          notification: {
            url: this.notificationUrl,
            level: this.notificationLevel,
          },
        },
      },
    });
    $.export("$summary", "Successfully created automated transcription order");
  },
};

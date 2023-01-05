import rev from "../../rev.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "rev-create-transcription-order-external-link",
  name: "Create Transcription Order Using External Link",
  description: "Submit a new transcription order using a external link that contains the media. [See docs here.](https://www.rev.com/api/ordersposttranscription)",
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
    speakers: {
      type: "string[]",
      label: "Speakers",
      description: "List of speaker names.",
      optional: true,
    },
    accents: {
      type: "string[]",
      label: "Accents",
      description: "List speaker accents.",
      options: constants.ACCENTS,
      optional: true,
    },
    timestamps: {
      type: "boolean",
      label: "Include Timestamps",
      description: "Timestamps are available in the JSON format, and are free.",
      optional: true,
    },
    outputFormat: {
      type: "string[]",
      label: "Output File Formats",
      description: "The desired file formats for the finished transcription files.",
      options: constants.OUTPUT_FORMATS,
      optional: true,
    },
    rush: {
      type: "boolean",
      label: "Rush",
      description: "Should the order be rushed? Rush will deliver your files up to 5x faster. Requesting Rush adds $1.25 per audio minute to the cost of your orders.",
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
        transcription_options: {
          inputs: [
            {
              audio_length_seconds: this.audioLength,
              external_link: this.externalLink,
              speakers: this.speakers,
              accents: this.accents,
            },
          ],
          timestamps: this.timestamps,
          rush: this.rush,
          output_file_formats: this.outputFormat,
          notification: {
            url: this.notificationUrl,
            level: this.notificationLevel,
          },
        },
      },
    });
    $.export("$summary", "Successfully created transcription order");
  },
};

import rev from "../../rev.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "rev-create-caption-order-external-link",
  name: "Create Caption Order Using External Link",
  description: "Submit a new caption order using a external link that contains the media. [See docs here.](https://www.rev.com/api/orderspostcaption)",
  type: "action",
  version: "0.0.1",
  props: {
    rev,
    externalLink: {
      type: "string",
      label: "External Link",
      description: "A link to a web page where the media is embedded, but not a link to the media file.",
    },
    videoLength: {
      type: "integer",
      label: "Video Seconds Length",
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
    languages: {
      type: "string[]",
      label: "Subtitle Languages",
      description: "Language codes to request foreign language subtitles. Examples: `es-es`, `it`.",
      optional: true,
    },
    formats: {
      type: "string[]",
      label: "Output File Formats",
      description: "What file formats should the captions be optimized for. Defaults to `Subrip`.",
      options: constants.FILE_FORMATS,
      optional: true,
    },
    rush: {
      type: "boolean",
      label: "Rush",
      description: "Should the order be rushed? Rush will deliver your files up to 5x faster. Requesting Rush adds $1.25 per audio minute to the cost of your orders.",
      optional: true,
    },
    burnedInCaptions: {
      type: "boolean",
      label: "Burned-in Captions",
      description: "Should burned-in captions be generated? Requesting burned-in captions adds $0.30 per audio minute to the cost of your orders. Burned-in captions will be available to download via the API for 7 days after they are generated.",
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
        caption_options: {
          inputs: [
            {
              video_length_seconds: this.videoLength,
              external_link: this.externalLink,
              speakers: this.speakers,
            },
          ],
          subtitle_languages: this.languages,
          output_file_formats: this.formats,
          rush: this.rush,
          burned_in_captions: this.burnedInCaptions,
          notification: {
            url: this.notificationUrl,
            level: this.notificationLevel,
          },
        },
      },
    });
    $.export("$summary", "Successfully created caption order");
  },
};

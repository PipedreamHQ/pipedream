import rev from "../../rev.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "rev-create-caption-order-external-link",
  name: "Create Caption Order Using External Link",
  description: "Submit a new caption order using a external link that contains the media. [See docs here.](https://www.rev.com/api/orderspostcaption)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rev,
    externalLink: {
      propDefinition: [
        rev,
        "externalLink",
      ],
    },
    videoLength: {
      propDefinition: [
        rev,
        "videoLength",
      ],
    },
    reference: {
      propDefinition: [
        rev,
        "reference",
      ],
    },
    speakers: {
      propDefinition: [
        rev,
        "speakers",
      ],
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
    burnedInCaptions: {
      type: "boolean",
      label: "Burned-in Captions",
      description: "Should burned-in captions be generated? Requesting burned-in captions adds $0.30 per audio minute to the cost of your orders. Burned-in captions will be available to download via the API for 7 days after they are generated.",
      optional: true,
    },
    rush: {
      propDefinition: [
        rev,
        "rush",
      ],
    },
    notificationUrl: {
      propDefinition: [
        rev,
        "notificationUrl",
      ],
    },
    notificationLevel: {
      propDefinition: [
        rev,
        "notificationLevel",
      ],
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
        },
        notification: {
          url: this.notificationUrl,
          level: this.notificationLevel,
        },
      },
    });
    $.export("$summary", "Successfully created caption order");
  },
};

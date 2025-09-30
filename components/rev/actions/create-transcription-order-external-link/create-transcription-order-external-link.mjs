import rev from "../../rev.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "rev-create-transcription-order-external-link",
  name: "Create Transcription Order Using External Link",
  description: "Submit a new transcription order using a external link that contains the media. [See docs here.](https://www.rev.com/api/ordersposttranscription)",
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
    audioLength: {
      propDefinition: [
        rev,
        "audioLength",
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
    accents: {
      propDefinition: [
        rev,
        "accents",
      ],
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
        },
        notification: {
          url: this.notificationUrl,
          level: this.notificationLevel,
        },
      },
    });
    $.export("$summary", "Successfully created transcription order");
  },
};

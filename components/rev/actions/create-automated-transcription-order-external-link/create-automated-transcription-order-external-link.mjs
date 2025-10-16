import rev from "../../rev.app.mjs";

export default {
  key: "rev-create-automated-transcription-order-external-link",
  name: "Create Automated Transcription Order Using External Link",
  description: "Submit a new automated transcription order using a external link that contains the media. [See docs here.](https://www.rev.com/api/orderspostautomatedtranscription)",
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
        automated_transcription_options: {
          inputs: [
            {
              audio_length_seconds: this.audioLength,
              external_link: this.externalLink,
            },
          ],
        },
        notification: {
          url: this.notificationUrl,
          level: this.notificationLevel,
        },
      },
    });
    $.export("$summary", "Successfully created automated transcription order");
  },
};

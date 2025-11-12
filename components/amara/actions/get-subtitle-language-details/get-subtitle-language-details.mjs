import amara from "../../amara.app.mjs";

export default {
  key: "amara-get-subtitle-language-details",
  name: "Get Subtitle Language Details",
  description: "Get details on a single subtitle language. [See the docs here](https://apidocs.amara.org/#get-details-on-a-single-subtitle-language)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    amara,
    team: {
      propDefinition: [
        amara,
        "team",
      ],
    },
    videoId: {
      propDefinition: [
        amara,
        "videoId",
        ({ team }) => ({
          team,
        }),
      ],
    },
    language: {
      propDefinition: [
        amara,
        "language",
        ({ videoId }) => ({
          videoId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      videoId,
      language,
    } = this;

    const response = await this.amara.getSubtitleLanguage({
      $,
      videoId,
      language,
    });

    $.export("$summary", `Successfully fetched ${response.name} subtitle language details`);

    return response;
  },
};

import amara from "../../amara.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "amara-fetch-subtitles-data",
  name: "Fetch Subtitles Data",
  description: "Fetch subtitles data. [See the docs here](https://apidocs.amara.org/#fetch-subtitles-data)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    versionNumber: {
      propDefinition: [
        amara,
        "versionNumber",
        ({
          videoId, language,
        }) => ({
          videoId,
          language,
        }),
      ],
    },
    subFormat: {
      propDefinition: [
        amara,
        "subFormat",
      ],
    },
  },
  async run({ $ }) {
    const {
      videoId,
      language,
      versionNumber,
      subFormat,
    } = this;

    const response = await this.amara.getSubtitles({
      $,
      videoId,
      language,
      params: {
        version_number: utils.emptyStrToUndefined(versionNumber),
        sub_format: subFormat,
      },
    });

    $.export("$summary", `Successfully fetched ${response.language.name} subtitles for "${response.video_title}"`);

    return response;
  },
};

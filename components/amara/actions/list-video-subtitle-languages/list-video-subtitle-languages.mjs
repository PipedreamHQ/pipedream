import amara from "../../amara.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "amara-list-video-subtitle-languages",
  name: "List Video Subtitle Languages",
  description: "Get a list of subtitle languages for a video. [See the docs here](https://apidocs.amara.org/#list-subtitle-languages-for-a-video)",
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
    max: {
      propDefinition: [
        amara,
        "max",
      ],
    },
    limit: {
      propDefinition: [
        amara,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const limit = utils.emptyStrToUndefined(this.limit);
    let subtitleLanguages = [];

    const resourcesStream = await this.amara.getResourcesStream({
      resourceFn: this.amara.getVideoSubtitleLanguages,
      resourceFnArgs: {
        $,
        videoId: this.videoId,
      },
      limit,
      max: this.max,
    });

    for await (const subtitleLanguage of resourcesStream) {
      subtitleLanguages.push(subtitleLanguage);
    }

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${subtitleLanguages?.length} subtitle ${subtitleLanguages?.length === 1 ? "language" : "languages"}`);

    return subtitleLanguages;
  },
};

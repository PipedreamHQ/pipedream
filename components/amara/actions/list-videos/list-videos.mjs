import amara from "../../amara.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "amara-list-videos",
  name: "List Videos",
  description: "List videos. [See the docs here](https://apidocs.amara.org/#list-videos)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    amara,
    videoUrl: {
      description: "Filter by video URL",
      optional: true,
      propDefinition: [
        amara,
        "videoUrl",
      ],
    },
    team: {
      description: "Filter by team. Passing in `null` will return only videos that are in the public area.",
      propDefinition: [
        amara,
        "team",
      ],
    },
    primaryAudioLanguageCode: {
      description: "Filter team videos by video language (only works when **Team** is given a non-null value).",
      propDefinition: [
        amara,
        "primaryAudioLanguageCode",
      ],
    },
    project: {
      description: "Filter by team project. Passing in `null` will return only videos that don’t belong to a project.",
      propDefinition: [
        amara,
        "project",
        ({ team }) => ({
          team,
        }),
      ],
    },
    orderBy: {
      type: "string",
      label: "Order by",
      description: "Order the list by this criteria",
      optional: true,
      options: [
        {
          label: "Title (ascending)",
          value: constants.ORDER_BY.TITLE_ASC,
        },
        {
          label: "Title (descending)",
          value: constants.ORDER_BY.TITLE_DESC,
        },
        {
          label: "Older videos first",
          value: constants.ORDER_BY.CREATED_ASC,
        },
        {
          label: "Newer videos",
          value: constants.ORDER_BY.CREATED_DESC,
        },
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
    offset: {
      propDefinition: [
        amara,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const {
      max,
      videoUrl,
      project,
      primaryAudioLanguageCode,
      orderBy,
    } = this;

    const limit = utils.emptyStrToUndefined(this.limit);
    const offset = utils.emptyStrToUndefined(this.offset);
    const team = utils.emptyStrToUndefined(this.team);
    let videos = [];

    const params = {
      video_url: videoUrl,
      team,
      project,
      primary_audio_language_code: primaryAudioLanguageCode,
      order_by: orderBy,
    };

    const resourcesStream = await this.amara.getResourcesStream({
      resourceFn: this.amara.listVideos,
      resourceFnArgs: {
        $,
        params,
      },
      offset,
      limit,
      max,
    });

    for await (const video of resourcesStream) {
      videos.push(video);
    }

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${videos?.length} ${videos?.length === 1 ? "video" : "videos"}`);

    return videos;
  },
};

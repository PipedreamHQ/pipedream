import amara from "../../amara.app.mjs";
import constants from "../../constants.mjs";

export default {
  key: "amara-list-video",
  name: "List videos",
  description: "List videos. [See the docs here](https://apidocs.amara.org/#list-videos).",
  type: "action",
  version: "0.0.6",
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
      description: "Filter team videos by video language (only works when the team parameter is also present).",
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
      limit,
      offset,
      videoUrl,
      team,
      project,
      primaryAudioLanguageCode,
      orderBy,
    } = this;

    const params = {
      limit,
      offset,
      video_url: videoUrl,
      team,
      project,
      primary_audio_language_code: primaryAudioLanguageCode,
      order_by: orderBy,
    };

    const { objects: videos } = await this.amara.listVideos({
      $,
      params,
    });

    return videos;
  },
};

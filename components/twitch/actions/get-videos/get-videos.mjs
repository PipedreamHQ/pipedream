import common from "../common.mjs";

export default {
  ...common,
  name: "Get Videos",
  key: "twitch-get-videos",
  description: "Gets video information by video ID, user ID, or game ID. [See the documentation](https://dev.twitch.tv/docs/api/reference/#get-videos)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    id: {
      type: "string",
      label: "Video ID",
      description: `ID of the video being queried. If this is specified, you cannot use any of the optional query parameters below.
        Each request must specify one video id, one user_id, or one game_id.`,
      optional: true,
    },
    userId: {
      propDefinition: [
        common.props.twitch,
        "user",
      ],
      description: "The Twitch user whose videos to retrieve. Accepts a numeric user ID (e.g. `141981764`) or login name (e.g. `twitchdev`). Each request must specify one video ID, user ID, or game ID.",
      optional: true,
    },
    gameId: {
      type: "string",
      label: "Game ID",
      description: "ID of the game the video is of. Each request must specify one video id, one user_id, or one game_id.",
      optional: true,
    },
    language: {
      propDefinition: [
        common.props.twitch,
        "language",
      ],
      description: "Language of the video being queried. A language value must be either the ISO 639-1 two-letter code for a supported stream language or “other”.",
      optional: true,
    },
    period: {
      type: "string",
      label: "Period",
      description: "Period during which the video was created. Defaults to “all” if left blank",
      options: [
        "all",
        "day",
        "week",
        "month",
      ],
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order of the videos. Defaults to “time” if left blank",
      options: [
        "time",
        "trending",
        "views",
      ],
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of video. Defaults to “all” if left blank",
      options: [
        "all",
        "upload",
        "archive",
        "highlight",
      ],
      optional: true,
    },
    max: {
      propDefinition: [
        common.props.twitch,
        "max",
      ],
      description: "Maximum number of videos to return",
    },
  },
  async run({ $ }) {
    const userId = await this.twitch.resolveUserId(this.userId);
    let params = {
      id: this.id,
      user_id: userId,
      game_id: this.gameId,
      language: this.language,
      period: this.period,
      sort: this.sort,
      type: this.type,
    };
    // remove empty values from params
    Object.keys(params).forEach((k) => (params[k] == null || params[k] == "") && delete params[k]);
    const videos = await this.paginate(
      this.twitch.getVideos.bind(this),
      params,
      this.max,
    );
    const results = await this.getPaginatedResults(videos);
    $.export("$summary", `Retrieved ${results.length} video(s)`);
    return results;
  },
};

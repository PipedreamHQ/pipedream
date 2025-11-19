import common from "../common.mjs";

export default {
  ...common,
  name: "Get Clips",
  key: "twitch-get-clips",
  description: "Gets clip information by clip ID, user ID, or game ID",
  version: "0.1.4",
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
      label: "Clip ID",
      description: `ID of the video being queried.
        For a query to be valid, id, broadcaster_id, or game_id must be specified. You may specify only one of these parameters.`,
      optional: true,
    },
    broadcaster: {
      propDefinition: [
        common.props.twitch,
        "broadcaster",
      ],
      description: `ID of the broadcaster for whom clips are returned. Results are ordered by view count.
        For a query to be valid, id, broadcaster_id, or game_id must be specified. You may specify only one of these parameters.`,
      optional: true,
    },
    gameId: {
      type: "string",
      label: "Game ID",
      description: `ID of the game the clip is of.
        For a query to be valid, id, broadcaster_id, or game_id must be specified. You may specify only one of these parameters.`,
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
  async run() {
    let params = {
      id: this.id,
      broadcaster_id: this.broadcaster,
      game_id: this.gameId,
    };
    // remove empty values from params
    Object.keys(params).forEach((k) => (params[k] == null || params[k] == "") && delete params[k]);
    const clips = await this.paginate(
      this.twitch.getClips.bind(this),
      params,
      this.max,
    );
    return await this.getPaginatedResults(clips);
  },
};

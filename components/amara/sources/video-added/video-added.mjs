import constants from "../../constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "amara-video-added",
  name: "Video Added",
  description: "Emit new event when a video is added. [See the docs here](https://apidocs.amara.org/#team-activity)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  async run({ $ }) {
    await this.emitEvents({
      resourceFn: this.amara.getTeamActivity,
      resourceFnArgs: {
        $,
        team: this.team,
      },
      allowedEvents: [
        constants.ACTIVITY_TYPES.VIDEO_ADDED,
      ],
    });
  },
};

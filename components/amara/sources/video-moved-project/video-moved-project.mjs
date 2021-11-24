import constants from "../../constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "amara-video-moved-project",
  name: "Video Moved Project",
  description: "Emit new event when a video has been moved from project. [See the docs here](https://apidocs.amara.org/#video-notifications)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  async run({ $ }) {
    await this.emitEvents({
      resourceFn: this.amara.getTeamNotifications,
      resourceFnArgs: {
        $,
        team: this.team,
      },
      allowedEvents: [
        constants.EVENT_TYPES.VIDEO_MOVED_PROJECT,
      ],
    });
  },
};

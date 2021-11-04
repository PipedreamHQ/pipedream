import constants from "../../constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "amara-video-removed",
  name: "Video removed",
  description: "Emit new event when a video is removed. [See the docs here](https://apidocs.amara.org/#video-notifications)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  async run({ $ }) {
    await this.emitEvents({
      $,
      team: this.team,
      allowedEvents: [
        constants.EVENT_TYPES.VIDEO_REMOVED,
      ],
    });
  },
};

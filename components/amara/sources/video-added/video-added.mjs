import constants from "../../constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "amara-video-added",
  name: "Video added",
  description: "Emit new event when a video is added. [See the docs here](https://apidocs.amara.org/#video-notifications)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  async run({ $ }) {
    await this.emitEvents({
      $,
      team: this.team,
      allowedEvents: [
        constants.EVENT_TYPES.VIDEO_ADDED,
      ],
    });
  },
};

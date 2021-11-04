import constants from "../../constants.mjs";
import common from "../common.mjs";

const allowedEvents = [
  constants.EVENT_TYPES.VIDEO_MOVED_PROJECT,
];

export default {
  ...common,
  key: "amara-video-moved-project",
  name: "Video moved project",
  description: "Emit new event when a video has been moved from project. [See the docs here](https://apidocs.amara.org/#video-notifications)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  async run({ $ }) {
    await this.emitEvents({
      $,
      team: this.team,
      allowedEvents,
    });
  },
};

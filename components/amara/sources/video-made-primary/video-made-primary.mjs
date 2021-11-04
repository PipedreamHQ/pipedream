import constants from "../../constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "amara-video-made-primary",
  name: "Video made primary",
  description: "Emit new event when a video has been made primary. [See the docs here](https://apidocs.amara.org/#video-notifications)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  async run({ $ }) {
    await this.emitEvents({
      $,
      team: this.team,
      allowedEvents: [
        constants.EVENT_TYPES.VIDEO_MADE_PRIMARY,
      ],
    });
  },
};

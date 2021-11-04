import constants from "../../constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "amara-subtitles-unpublished",
  name: "Subtitles unpublished",
  description: "Emit new event when subtitles have been unpublished. [See the docs here](https://apidocs.amara.org/#video-notifications)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  async run({ $ }) {
    await this.emitEvents({
      $,
      team: this.team,
      allowedEvents: [
        constants.EVENT_TYPES.SUBTITLES_UNPUBLISHED,
      ],
    });
  },
};

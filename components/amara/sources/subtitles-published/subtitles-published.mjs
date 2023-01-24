import constants from "../../common/constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "amara-subtitles-published",
  name: "Subtitles Published",
  description: "Emit new event when subtitles have been published. [See the docs here](https://apidocs.amara.org/#video-notifications)",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.amara.getTeamNotifications;
    },
    getResourceFnArgs(args) {
      return {
        ...args,
        team: this.team,
      };
    },
    getAllowedEvents() {
      return [
        constants.EVENT_TYPES.SUBTITLES_PUBLISHED,
      ];
    },
    getSummary(resource) {
      const { data } = resource;
      return `${data.amara_video_id} (${data.language_code})`;
    },
  },
};

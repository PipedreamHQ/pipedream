import constants from "../../common/constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "amara-video-made-primary",
  name: "Video Made Primary",
  description: "Emit new event when a video has been made primary. [See the docs here](https://apidocs.amara.org/#video-notifications)",
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
        constants.EVENT_TYPES.VIDEO_MADE_PRIMARY,
      ];
    },
    getSummary(resource) {
      const { data } = resource;
      return `${data.amara_video_id}: ${data.url}`;
    },
  },
};

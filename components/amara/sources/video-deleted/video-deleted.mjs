import constants from "../../common/constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "amara-video-deleted",
  name: "Video Deleted",
  description: "Emit new event when a video is deleted. [See the docs here](https://apidocs.amara.org/#team-activity)",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.amara.getTeamActivity;
    },
    getResourceFnArgs(args) {
      return {
        ...args,
        team: this.team,
      };
    },
    getAllowedEvents() {
      return [
        constants.ACTIVITY_TYPES.VIDEO_DELETED,
      ];
    },
    getSummary(resource) {
      return `Video deleted: ${resource.title ?? resource.video}`;
    },
  },
};

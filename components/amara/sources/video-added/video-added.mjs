import constants from "../../common/constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "amara-video-added",
  name: "Video Added",
  description: "Emit new event when a video is added. [See the docs here](https://apidocs.amara.org/#team-activity)",
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
        constants.ACTIVITY_TYPES.VIDEO_ADDED,
      ];
    },
    getSummary(resource) {
      // eslint-disable-next-line multiline-ternary
      return `Video Added: ${resource.video}${resource.language ? ` (${resource.language})` : ""}`;
    },
  },
};

import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "wakatime-new-commit-created",
  name: "New Commit Created",
  description: "Emit new event when a new commit is created in WakaTime. [See the documentation](https://wakatime.com/developers#commits)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    project: {
      propDefinition: [
        common.props.wakatime,
        "project",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.wakatime.listCommits;
    },
    getArgs() {
      return {
        project: this.project,
      };
    },
    getResourceKey() {
      return "commits";
    },
    getSummary(item) {
      return `New Commit Created: ${item.message}`;
    },
  },
  sampleEmit,
};

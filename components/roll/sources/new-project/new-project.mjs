import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Project Created",
  key: "roll-new-project",
  description: "Emit new event when a project is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Spondyr API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...common.methods,
    getFieldId() {
      return "ProjectId";
    },
    getFieldResponse() {
      return "project";
    },
    getFn() {
      return this.roll.listProjects;
    },
    getDataToEmit({
      ProjectId,
      Created,
    }) {
      const dateTime = Created || new Date().getTime();
      return {
        id: ProjectId,
        summary: `New project with ProjectId ${ProjectId} was successfully created!`,
        ts: dateTime,
      };
    },
  },
};


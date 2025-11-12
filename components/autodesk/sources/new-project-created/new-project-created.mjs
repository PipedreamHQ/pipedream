import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "autodesk-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created in Autodesk. [See the documentation](https://aps.autodesk.com/en/docs/data/v2/reference/http/hubs-hub_id-projects-GET/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    hubId: {
      propDefinition: [
        common.props.autodesk,
        "hubId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getFn() {
      return this.autodesk.listProjects;
    },
    getArgs() {
      return {
        hubId: this.hubId,
      };
    },
    generateMeta(project) {
      return {
        id: project.id,
        summary: `New Project: ${project.attributes.name}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};

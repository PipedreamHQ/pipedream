import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../seqera.app.mjs";

export default {
  key: "seqera-new-run-created",
  name: "New Run Created",
  description: "Emit new event when a new run is created in Seqera. [See the documentation](https://docs.seqera.io/platform/23.3.0/api/overview)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
      optional: false,
    },
  },
  methods: {
    getResourceName() {
      return "workflows";
    },
    getResourcesFn() {
      return this.app.listWorkflows;
    },
    getResourcesFnArgs() {
      return {
        workspaceId: this.workspaceId,
      };
    },
    generateMeta({ workflow }) {
      return {
        id: workflow.id,
        summary: `New Run: ${workflow.id}`,
        ts: Date.parse(workflow.dateCreated),
      };
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
  async run() {
    const {
      app,
      getResourcesFn,
      getResourcesFnArgs,
      getResourceName,
      processResource,
    } = this;

    const resources = await app.paginate({
      resourcesFn: getResourcesFn(),
      resourcesFnArgs: getResourcesFnArgs(),
      resourceName: getResourceName(),
    });

    Array.from(resources)
      .reverse()
      .forEach(processResource);
  },
};

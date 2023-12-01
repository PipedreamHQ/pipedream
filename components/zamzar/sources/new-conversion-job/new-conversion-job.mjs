import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zamzar-new-conversion-job",
  name: "New Conversion Job",
  description: "Emit new event when a conversion job has completed. [See the documentation](https://developers.zamzar.com/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "last",
  props: {
    ...common.props,
    jobId: {
      propDefinition: [
        common.props.app,
        "jobId",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Conversion Job Completed: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  async run() {
    const {
      app,
      jobId,
      processResource,
    } = this;

    const resource = await app.retrieveJob({
      jobId,
    });

    if (resource.status !== "successful") {
      return console.log("Resource has not been completed yet");
    }

    processResource(resource);
  },
  sampleEmit,
};

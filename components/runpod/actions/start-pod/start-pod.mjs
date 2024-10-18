import app from "../../runpod.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "runpod-start-pod",
  name: "Start Pod",
  description: "Starts a stopped pod, making it available for use. [See the documentation](https://docs.runpod.io/sdks/graphql/manage-pods#start-spot-pod)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    podId: {
      propDefinition: [
        app,
        "podId",
      ],
    },
    gpuCount: {
      propDefinition: [
        app,
        "gpuCount",
      ],
    },
    bidPerGpu: {
      propDefinition: [
        app,
        "bidPerGpu",
      ],
    },
  },
  methods: {
    startPod(variables) {
      return this.app.makeRequest({
        query: mutations.startPod,
        variables,
      });
    },
  },
  async run({ $ }) {
    const {
      startPod,
      podId,
      gpuCount,
      bidPerGpu,
    } = this;

    const response = await startPod({
      input: {
        podId,
        gpuCount,
        bidPerGpu: parseFloat(bidPerGpu),
      },
    });

    $.export("$summary", `Sucessfully started pod with ID \`${response.id}\`.`);
    return response;
  },
};

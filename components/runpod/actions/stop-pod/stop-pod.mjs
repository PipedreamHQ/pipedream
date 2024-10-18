import app from "../../runpod.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "runpod-stop-pod",
  name: "Stop Pod",
  description: "Stops a running pod, freeing up resources and preventing further charges. [See the documentation](https://docs.runpod.io/sdks/graphql/manage-pods#stop-pods)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    podId: {
      description: "The ID of the pod to stop.",
      propDefinition: [
        app,
        "podId",
      ],
    },
    incrementVersion: {
      type: "boolean",
      label: "Increment Version",
      description: "Whether to increment the pod version after stopping it.",
      optional: true,
    },
  },
  methods: {
    stopPod(variables) {
      return this.app.makeRequest({
        query: mutations.stopPod,
        variables,
      });
    },
  },
  async run({ $ }) {
    const {
      stopPod,
      podId,
      incrementVersion,
    } = this;

    const response = await stopPod({
      input: {
        podId,
        incrementVersion,
      },
    });

    $.export("$summary", `Succesfully stopped pod with ID \`${response.id}\`.`);

    return response;
  },
};

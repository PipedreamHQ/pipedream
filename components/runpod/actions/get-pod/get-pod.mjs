import app from "../../runpod.app.mjs";
import queries from "../../common/queries.mjs";

export default {
  key: "runpod-get-pod",
  name: "Get Pod Details",
  description: "Get details of a pod by ID. [See the documentation](https://docs.runpod.io/sdks/graphql/manage-pods#get-pod-by-id).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    podId: {
      description: "The ID of the pod to get details for.",
      propDefinition: [
        app,
        "podId",
      ],
    },
  },
  methods: {
    getPodDetails(variables) {
      return this.app.makeRequest({
        query: queries.getPod,
        variables,
      });
    },
  },
  async run({ $ }) {
    const {
      getPodDetails,
      podId,
    } = this;

    const response = await getPodDetails({
      input: {
        podId,
      },
    });
    $.export("$summary", `Succesfully retrieved details for pod with ID \`${response.id}\`.`);
    return response;
  },
};

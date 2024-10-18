import "graphql/language/index.js";
import { GraphQLClient } from "graphql-request";
import queries from "./common/queries.mjs";

export default {
  type: "app",
  app: "runpod",
  propDefinitions: {
    bidPerGpu: {
      type: "string",
      label: "Bid Per GPU",
      description: "The bid amount per GPU for spot pods.",
    },
    gpuCount: {
      type: "integer",
      label: "GPU Count",
      description: "The number of GPUs to allocate to the pod. Set to 0 for pods without GPU.",
    },
    podId: {
      type: "string",
      label: "Pod ID",
      description: "The ID of the pod to start.",
      async options() {
        const { myself: { pods } } = await this.listPods();
        return pods.map(({
          id: value, name: label,
        }) => ({
          label: label || value,
          value,
        }));
      },
    },
    gpuTypeId: {
      type: "string",
      label: "GPU Type ID",
      description: "The ID of the GPU type to use for the pod.",
      async options({ input = {} }) {
        const { gpuTypes } = await this.listGpuTypes({
          input,
        });
        return gpuTypes.map(({
          id: value, displayName: label,
        }) => ({
          label: label || value,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl() {
      return `https://api.runpod.io/graphql?api_key=${this.$auth.api_key}`;
    },
    getClient() {
      return new GraphQLClient(this.getUrl(), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    makeRequest({
      query, variables,
    } = {}) {
      return this.getClient().request(query, variables);
    },
    listPods() {
      return this.makeRequest({
        query: queries.listPods,
      });
    },
    listGpuTypes(variables) {
      return this.makeRequest({
        query: queries.listGpuTypes,
        variables,
      });
    },
  },
};

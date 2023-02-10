import constants from "../../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Prime Contract Event (Instant)",
  key: "procore-prime-contract",
  description:
    "Emit new event each time a Prime Contract is created, updated, or deleted in a project.",
  version: "0.1.0",
  type: "source",
  methods: {
    ...common.methods,
    getPrimeContract({
      primeContractId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/prime_contract/${primeContractId}`,
        ...args,
      });
    },
    getResourceName() {
      return constants.RESOURCE_NAMES.PRIME_CONTRACTS;
    },
    async getDataToEmit(body) {
      const {
        companyId,
        projectId,
      } = this;
      const { resource_id: resourceId } = body;
      const resource =
        await this.getPrimeContract({
          primeContractId: resourceId,
          headers: this.app.companyHeader(companyId),
          params: {
            project_id: projectId,
          },
        });
      return {
        ...body,
        resource,
      };
    },
    getMeta({
      id, event_type, timestamp, resource,
    }) {
      const { title } = resource;
      const eventType = event_type;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `${eventType} ${title}`,
        ts,
      };
    },
  },
};

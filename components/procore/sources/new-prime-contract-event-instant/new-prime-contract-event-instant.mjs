import common from "../common/webhook.mjs";
import resourceNames from "../../common/resource-names.mjs";

export default {
  ...common,
  name: "New Prime Contract Event (Instant)",
  key: "procore-new-prime-contract-event-instant",
  description: "Emit new event when a new prime contract event is created. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return resourceNames.PRIME_CONTRACTS;
    },
    async getDataToEmit(body) {
      const {
        app,
        companyId,
        projectId,
      } = this;
      const { resource_id: primeContractId } = body;

      if (!projectId) {
        console.log("If you need to get more details about the prime contract, please provide a project ID.");
        return body;
      }

      const resource = await app.getPrimeContract({
        companyId,
        primeContractId,
        params: {
          project_id: projectId,
        },
      });
      return {
        ...body,
        resource,
      };
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New Prime Contract Event: ${body.resource_id}`,
        ts: new Date(body.timestamp).getTime(),
      };
    },
  },
};


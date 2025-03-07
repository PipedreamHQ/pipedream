import common from "../common/webhook.mjs";
import resourceNames from "../../common/resource-names.mjs";

export default {
  ...common,
  name: "New RFI Event (Instant)",
  key: "procore-new-rfi-event-instant",
  description: "Emit new event when a new RFI event is created. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return resourceNames.RFIS;
    },
    async getDataToEmit(body) {
      const {
        app,
        companyId,
        projectId,
      } = this;
      const { resource_id: rfiId } = body;

      if (!projectId) {
        console.log("If you need to get more details about the RFI, please provide a project ID.");
        return body;
      }

      const resource = await app.getRFI({
        companyId,
        projectId,
        rfiId,
      });
      return {
        ...body,
        resource,
      };
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New RFI Event: ${body.resource_id}`,
        ts: new Date(body.timestamp).getTime(),
      };
    },
  },
};

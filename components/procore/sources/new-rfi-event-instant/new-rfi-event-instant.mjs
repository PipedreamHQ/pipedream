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
      } = this;
      const {
        resource_id: rfiId,
        project_id: projectId,
      } = body;

      try {
        const resource = await app.getRFI({
          companyId,
          projectId,
          rfiId,
        });
        return {
          ...body,
          resource,
        };
      } catch (error) {
        console.log(error.message || error);
        return body;
      }
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

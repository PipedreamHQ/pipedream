import common from "../common/webhook.mjs";
import resourceNames from "../../common/resource-names.mjs";

export default {
  ...common,
  name: "New Commitment Change Order Event (Instant)",
  key: "procore-new-commitment-change-order-event-instant",
  description: "Emit new event when a new commitment change order event is created. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return resourceNames.CHANGE_EVENTS;
    },
    async getDataToEmit(body) {
      const {
        app,
        companyId,
      } = this;
      const {
        resource_id: changeEventId,
        project_id: projectId,
      } = body;

      try {
        const resource = await app.getChangeEvent({
          companyId,
          changeEventId,
          params: {
            project_id: projectId,
          },
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
        summary: `New Commitment Change Order Event: ${body.resource_id}`,
        ts: new Date(body.timestamp).getTime(),
      };
    },
  },
};

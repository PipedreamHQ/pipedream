import common from "../common/webhook.mjs";
import resourceNames from "../../common/resource-names.mjs";

export default {
  ...common,
  name: "New Change Order Package Event (Instant)",
  key: "procore-new-change-order-package-event-instant",
  description: "Emit new event when a new change order package event is created. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return resourceNames.CHANGE_ORDER_PACKAGES;
    },
    async getDataToEmit(body) {
      const {
        app,
        companyId,
        projectId,
      } = this;
      const { resource_id: changeOrderPackageId } = body;

      if (!projectId) {
        console.log("If you need to get more details about the change order package, please provide a project ID.");
        return body;
      }

      const resource = await app.getChangeOrderPackage({
        companyId,
        changeOrderPackageId,
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
        summary: `New Change Order Package Event: ${body.resource_id}`,
        ts: new Date(body.timestamp).getTime(),
      };
    },
  },
};

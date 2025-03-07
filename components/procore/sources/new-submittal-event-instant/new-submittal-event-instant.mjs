import common from "../common/webhook.mjs";
import resourceNames from "../../common/resource-names.mjs";

export default {
  ...common,
  name: "New Submittal Event (Instant)",
  key: "procore-new-submittal-event-instant",
  description: "Emit new event when a new submittal event is created. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return resourceNames.SUBMITTALS;
    },
    async getDataToEmit(body) {
      const {
        app,
        companyId,
        projectId,
      } = this;
      const { resource_id: submittalId } = body;

      if (!projectId) {
        console.log("If you need to get more details about the submittal, please provide a project ID.");
        return body;
      }

      const resource = await app.getSubmittal({
        companyId,
        projectId,
        submittalId,
      });
      return {
        ...body,
        resource,
      };
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New Submittal Event: ${body.resource_id}`,
        ts: new Date(body.timestamp).getTime(),
      };
    },
  },
};

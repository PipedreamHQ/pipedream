import common from "../common/webhook.mjs";
import resourceNames from "../../common/resource-names.mjs";

export default {
  ...common,
  name: "New Timecard Entry Event (Instant)",
  key: "procore-new-timecard-entry-event-instant",
  description: "Emit new event when a new timecard entry is created. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return resourceNames.TIMECARD_ENTRIES;
    },
    async getDataToEmit(body) {
      const {
        app,
        companyId,
        projectId,
      } = this;
      const { resource_id: timecardEntryId } = body;

      if (!projectId) {
        console.log("If you need to get more details about the timecard entry, please provide the project ID.");
        return body;
      }

      const resource = await app.getTimecardEntry({
        companyId,
        timecardEntryId,
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
        summary: `New Timecard Entry Event: ${body.resource_id}`,
        ts: new Date(body.timestamp).getTime(),
      };
    },
  },
};

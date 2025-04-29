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
      } = this;
      const {
        resource_id: timecardEntryId,
        project_id: projectId,
      } = body;

      try {
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
      } catch (error) {
        console.log(error.message || error);
        return body;
      }
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

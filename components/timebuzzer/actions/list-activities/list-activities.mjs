import timebuzzer from "../../timebuzzer.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "timebuzzer-list-activities",
  name: "List Activities",
  description: "Retrieves a list of all activities in Timebuzzer. [See the documentation](https://my.timebuzzer.com/doc/#api-Activities-GetFilteredActivities)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    timebuzzer,
    userIds: {
      propDefinition: [
        timebuzzer,
        "userId",
      ],
      type: "integer[]",
      label: "User IDs",
      description: "Filter by User Ids",
      optional: true,
    },
    startDate: {
      propDefinition: [
        timebuzzer,
        "startDate",
      ],
      description: "Returns Activities which starts after this date in UTC. e.g. `2016-12-10T09:00:00.000Z`",
      optional: true,
    },
    endDate: {
      propDefinition: [
        timebuzzer,
        "endDate",
      ],
      description: "Returns Activities which ends before this date in UTC. e.g. `2016-12-10T09:00:00.000Z`",
      optional: true,
    },
    note: {
      propDefinition: [
        timebuzzer,
        "note",
      ],
      optional: true,
    },
    runnintActivities: {
      type: "boolean",
      label: "Runnint Activities",
      description: "If `true`, activities without an end date will be found",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = [];
    const data = {
      userIds: this.userIds,
      startDate: this.startDate,
      endDate: this.endDate,
      note: this.note,
      runningActivities: this.runningActivities,
    };
    const params = {
      count: constants.DEFAULT_LIMIT,
      offset: 0,
    };
    let total;
    do {
      const { activities } = await this.timebuzzer.listFilteredActivities({
        $,
        data,
        params,
      });
      results.push(...activities);
      total = activities?.length;
      params.offset += params.count;
    } while (total === params.count);

    $.export("$summary", `Fetched ${results.length} activit${results.length === 1
      ? "y"
      : "ies"} successfully`);
    return results;
  },
};

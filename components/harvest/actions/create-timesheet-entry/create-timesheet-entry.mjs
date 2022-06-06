import { ConfigurationError } from "@pipedream/platform";
import harvest from "../../harvest.app.mjs";
import {
  isValidDate, isValidTime, removeNullEntries,
} from "../../common/utils.mjs";

export default {
  key: "harvest-create-timesheet-entry",
  name: "Create Timesheet Entry",
  description: `Creates a new time entry object. 
  [Create a time entry via duration documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#create-a-time-entry-via-duration),
  [Create a time entry via start and end time documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#create-a-time-entry-via-start-and-end-time)`,
  version: "0.0.1",
  type: "action",
  props: {
    harvest,
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        harvest,
        "taskId",
      ],
    },
    spentDate: {
      type: "string",
      label: "Spent date (YYYY-MM-DD)",
      description: "The ISO 8601 formatted date on which the time entry was spent. Example: 2019-07-26",
    },
    userId: {
      propDefinition: [
        harvest,
        "userId",
      ],
    },
    specifyStartEndTime: {
      type: "boolean",
      label: "Specify start and end time",
      description: "Specify start and end time",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.specifyStartEndTime === true) {
      props.startedTime = {
        type: "string",
        label: "Start time(H:MM am/pm)",
        description: "The time the entry started. Defaults to the current time. Example: 8:00am.",
      };
      props.endedTime = {
        type: "string",
        label: "End time(H:MM am/pm)",
        description: "The time the entry ended. Defaults to the current time. Example: 8:00am.",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {

    if (this.spentDate && !isValidDate(this.spentDate)) {
      throw new ConfigurationError("Invalid spent date. Ensure format is YYYY-MM-DD");
    }

    if (this.startedTime && !isValidTime(this.startedTime)) {
      throw new ConfigurationError("Invalid start time. Ensure format is (H:MM am/pm)");
    }

    if (this.endedTime && !isValidTime(this.endedTime)) {
      throw new ConfigurationError("Invalid end time. Ensure format is (H:MM am/pm)");
    }

    const params = removeNullEntries({
      project_id: this.projectId,
      task_id: this.taskId,
      user_id: this.userId,
      spent_date: this.spentDate,
      started_time: this.startedTime.replace(/\s/g, ""),
      ended_time: this.endedTime.replace(/\s/g, ""),
    });
    const response = await this.harvest.createTimeEntry({
      $,
      params,
    });
    response && $.export("$summary", "Successfully created time entry");
    return response;
  },
};

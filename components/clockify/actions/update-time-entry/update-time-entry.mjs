import { ConfigurationError } from "@pipedream/platform";
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-update-time-entry",
  name: "Update Time Entry",
  description: "Updates an existing time entry in Clockify — change its start/end time, project, task, description, billable status, or tags. Clockify's update endpoint replaces the entire entry, so this action first fetches the current entry and merges your changes into it before saving — fields you don't set are left unchanged. Use **List Time Entries** to find the ID of the entry to update. [See the documentation](https://docs.clockify.me/#tag/Time-entry/operation/updateTimeEntry)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    timeEntryId: {
      propDefinition: [
        clockify,
        "timeEntryId",
      ],
    },
    projectId: {
      propDefinition: [
        clockify,
        "projectId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        clockify,
        "taskId",
        (c) => ({
          workspaceId: c.workspaceId,
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    start: {
      propDefinition: [
        clockify,
        "start",
      ],
    },
    end: {
      propDefinition: [
        clockify,
        "end",
      ],
    },
    timeEntryDescription: {
      propDefinition: [
        clockify,
        "timeEntryDescription",
      ],
    },
    billable: {
      propDefinition: [
        clockify,
        "billable",
      ],
    },
    tagIds: {
      propDefinition: [
        clockify,
        "tagIds",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    timeEntryType: {
      propDefinition: [
        clockify,
        "timeEntryType",
      ],
    },
  },
  async run({ $ }) {
    if (this.projectId === undefined
      && this.taskId === undefined
      && this.start === undefined
      && this.end === undefined
      && this.timeEntryDescription === undefined
      && this.billable === undefined
      && this.tagIds === undefined
      && this.timeEntryType === undefined) {
      throw new ConfigurationError("Set at least one field to update.");
    }

    const entry = await this.clockify.getTimeEntry({
      $,
      workspaceId: this.workspaceId,
      timeEntryId: this.timeEntryId,
    });

    const response = await this.clockify.updateTimeEntry({
      $,
      workspaceId: this.workspaceId,
      timeEntryId: this.timeEntryId,
      data: {
        start: this.start ?? entry.timeInterval?.start,
        end: this.end ?? entry.timeInterval?.end,
        projectId: this.projectId ?? entry.projectId,
        taskId: this.taskId ?? entry.taskId,
        description: this.timeEntryDescription ?? entry.description,
        billable: this.billable ?? entry.billable,
        tagIds: this.tagIds ?? entry.tagIds,
        type: this.timeEntryType ?? entry.type,
      },
    });

    $.export("$summary", `Successfully updated time entry with ID ${this.timeEntryId}`);

    return response;
  },
};

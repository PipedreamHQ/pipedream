import app from "../../clickup.app.mjs";
import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-create-time-entry",
  name: "Create Time Entry",
  description: "Create a new time entry. [See the documentation](https://developer.clickup.com/reference/createatimeentry)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        common.props.clickup,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.clickup,
        "listId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        common.props.clickup,
        "taskId",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
      description: "To show options please select a **List** first",
      optional: true,
    },
    tags: {
      propDefinition: [
        app,
        "tags",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    start: {
      type: "string",
      label: "Start Time",
      description: "The Start Time, can be ISO 8601 Date (.e.g `2025-08-06T01:50:19Z`) or Unix timestamp in milliseconds (.e.g `1595282645000`)",
    },
    end: {
      type: "string",
      label: "End Time",
      description: "The End Time, can be ISO 8601 Date (.e.g `2025-08-06T01:50:19Z`) or Unix timestamp in milliseconds (.e.g `1595282645000`)",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the time entry",
    },
  },
  async run({ $ }) {
    const start = new Date(+this.start || this.start).getTime();
    const end = new Date(+this.end || this.end).getTime();

    const data = {
      tid: this.taskId,
      description: this.description,
      start,
      end,
      stop: end,
    };

    console.log(data);

    const response = await this.clickup.createTimeEntry({
      $,
      teamId: this.workspaceId,
      params: {
        custom_task_ids: this.useCustomTaskIds,
      },
      data,
    });

    $.export("$summary", "Successfully created a new time entry");

    return response;
  },
};

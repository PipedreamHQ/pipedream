// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";
import {
  TASK_STATUS_OPTIONS, TASK_IMPORTANCE_OPTIONS,
} from "../../common/constants.mjs";
import _ from "lodash";

export default {
  key: "wrike-new-task",
  name: "New Task",
  description: "Create a Wrike task under a specified folder ID. [See the documentation](https://developers.wrike.com/api/v4/tasks/#create-task)",
  version: "0.3.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wrike,
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder to create the task in, e.g. `IEAASDF3`. Run **List Folder ID Options** to look up folder IDs.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of task",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of task. Defaults to `Active`",
      optional: true,
      options: TASK_STATUS_OPTIONS,
    },
    importance: {
      type: "string",
      label: "Importance",
      description: "The importance of task. Defaults to `Normal`",
      optional: true,
      options: TASK_IMPORTANCE_OPTIONS,
    },
    responsibles: {
      type: "string[]",
      label: "Responsibles",
      description: "Contact IDs to make responsible for the task, e.g. `KUABCDEF`. Run **List Contact ID Options** to look up IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = _.pickBy(_.pick(this, [
      "title",
      "description",
      "status",
      "importance",
      "responsibles",
    ]));

    const task = await this.wrike.createTask({
      $,
      folderId: this.folderId,
      data,
    });

    $.export("$summary", `Successfully created new task ${task.title}`);

    return task;
  },
};

import wrike from "../../wrike.app.mjs";
import _ from "lodash";

export default {
  key: "wrike-new-task",
  name: "New Task",
  description: "Create a Wrike task under a specified folder ID. [See the documentation](https://developers.wrike.com/api/v4/tasks/#create-task)",
  version: "0.3.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wrike,
    folderId: {
      propDefinition: [
        wrike,
        "folderId",
      ],
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
      options: [
        "Active",
        "Completed",
        "Deferred",
        "Cancelled",
      ],
    },
    importance: {
      type: "string",
      label: "Importance",
      description: "The importance of task. Defaults to `Normal`",
      optional: true,
      options: [
        "High",
        "Normal",
        "Low",
      ],
    },
    responsibles: {
      propDefinition: [
        wrike,
        "contactId",
      ],
      type: "string[]",
      label: "Responsibles",
      description: "Makes specified users responsible for the task",
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

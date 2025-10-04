import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-create-task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Task",
  description: "Create a task [See the docs here](https://api.salesflare.com/docs#operation/postTasks)",
  props: {
    app,
    account: {
      propDefinition: [
        app,
        "accountIds",
      ],
      label: "Account ID",
      type: "integer",
      description: "Account ID",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the task",
    },
    reminderDate: {
      type: "string",
      label: "Reminder Date",
      description: "Reminder date, Must be in ISO format. e.g. `2022-11-17T08:07:00Z`. Defaults to current time.",
      optional: true,
    },
    assignees: {
      propDefinition: [
        app,
        "userId",
      ],
      type: "integer[]",
      label: "Assignees",
      description: "Assignees for the task.",
    },
  },
  async run ({ $ }) {
    const pairs = {
      reminderDate: "reminder_date",
    };
    const data = utils.extractProps(this, pairs);
    const resp = await this.app.createTask({
      $,
      data,
    });
    $.export("$summary", `Task (ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};

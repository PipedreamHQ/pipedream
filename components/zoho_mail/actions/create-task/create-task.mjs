import zohoMail from "../../zoho_mail.app.mjs";

export default {
  key: "zoho_mail-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the docs here](https://www.zoho.com/mail/help/api/post-add-new-task.html)",
  version: "0.0.1",
  type: "action",
  props: {
    zohoMail,
    title: {
      type: "string",
      label: "Title",
      description: "The title for the task that is being added",
    },
    assignee: {
      propDefinition: [
        zohoMail,
        "account",
      ],
      label: "Assignee",
      description: "The zuid of the member to whom the task is assigned",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The task description",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority to be given for the task",
      options: [
        "high",
        "medium",
        "low",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      description: this.description,
      priority: this.priority,
      assignee: parseInt(this.assignee),
    };
    const resp = this.zohoMail.createTask({
      $,
      data,
    });
    $.export("$summary", "Successfully created task");
    return resp;
  },
};

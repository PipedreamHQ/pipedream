import zohoMail from "../../zoho_mail.app.mjs";

export default {
  key: "zoho_mail-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the docs here](https://www.zoho.com/mail/help/api/post-add-new-task.html)",
  //version: "0.0.1",
  version: "0.0.18",
  type: "action",
  props: {
    zohoMail,
    title: {
      type: "string",
      label: "Title",
      description: "The title for the task that is being added",
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
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date that you want to set for the task in `dd/mm/yyyy` format",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      description: this.description,
      priority: this.priority,
      dueDate: this.dueDate,
    };
    const resp = await this.zohoMail.createTask({
      $,
      data,
    });
    $.export("$summary", "Successfully created task");
    return resp;
  },
};

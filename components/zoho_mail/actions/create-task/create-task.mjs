import zohoMail from "../../zoho_mail.app.mjs";

export default {
  key: "zoho_mail-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the docs here](https://www.zoho.com/mail/help/api/post-add-new-task.html)",
  version: "0.0.2",
  type: "action",
  props: {
    zohoMail,
    title: {
      propDefinition: [
        zohoMail,
        "title",
      ],
    },
    description: {
      propDefinition: [
        zohoMail,
        "description",
      ],
    },
    priority: {
      propDefinition: [
        zohoMail,
        "priority",
      ],
    },
    dueDate: {
      propDefinition: [
        zohoMail,
        "dueDate",
      ],
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

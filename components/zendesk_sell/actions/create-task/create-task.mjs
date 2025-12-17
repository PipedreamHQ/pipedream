import zendeskSell from "../../zendesk_sell.app.mjs";

export default {
  key: "zendesk_sell-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the documentation](https://developer.zendesk.com/api-reference/sales-crm/resources/tasks/#create-a-task).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zendeskSell,
    resourceType: {
      type: "string",
      label: "Resource Type",
      description: "Name of the resource type the task is attached to",
      options: [
        "contact",
        "lead",
        "deal",
      ],
      reloadProps: true,
    },
    contactId: {
      propDefinition: [
        zendeskSell,
        "contactId",
      ],
      hidden: true,
    },
    leadId: {
      propDefinition: [
        zendeskSell,
        "leadId",
      ],
      hidden: true,
    },
    dealId: {
      propDefinition: [
        zendeskSell,
        "dealId",
      ],
      hidden: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the task",
    },
    completed: {
      type: "boolean",
      label: "Completed",
      description: "Indicator of whether the task is completed or not",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Date and time the task is due in UTC (ISO8601 format)",
      optional: true,
    },
  },
  async additionalProps(props) {
    props.contactId.hidden = this.resourceType !== "contact";
    props.leadId.hidden = this.resourceType !== "lead";
    props.dealId.hidden = this.resourceType !== "deal";
    return {};
  },
  async run({ $ }) {
    const response = await this.zendeskSell.createTask({
      $,
      data: {
        data: {
          resource_type: this.resourceType,
          resource_id: this.resourceType === "contact"
            ? this.contactId
            : this.resourceType === "lead"
              ? this.leadId
              : this.dealId,
          content: this.content,
          completed: this.completed,
          due_date: this.dueDate,
        },
      },
    });
    return response;
  },
};

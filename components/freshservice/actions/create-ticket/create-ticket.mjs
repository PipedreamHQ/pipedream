import freshservice from "../../freshservice.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "freshservice-create-ticket",
  name: "Create Ticket",
  description: "Create a new ticket in Freshservice. [See the documentation](https://api.freshservice.com/v2/#create_ticket)",
  version: "0.0.1",
  type: "action",
  props: {
    freshservice,
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the ticket",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the ticket",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the requester",
    },
    priority: {
      propDefinition: [
        freshservice,
        "ticketPriority",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        freshservice,
        "ticketStatus",
      ],
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the requester",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the requester",
      optional: true,
    },
    company_id: {
      propDefinition: [
        freshservice,
        "companyId",
      ],
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the ticket",
      options: [
        "Incident",
        "Service Request",
        "Change",
        "Problem",
        "Release",
      ],
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source of the ticket",
      options: [
        "Email",
        "Portal",
        "Phone",
        "Chat",
        "Feedback Widget",
        "Yammer",
        "AWS Cloudwatch",
        "Pagerduty",
        "Walkup",
        "Slack",
      ],
      optional: true,
    },
    urgency: {
      type: "string",
      label: "Urgency",
      description: "Urgency of the ticket",
      options: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      optional: true,
    },
    impact: {
      type: "string",
      label: "Impact",
      description: "Impact of the ticket",
      options: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      optional: true,
    },
    custom_fields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields as a JSON object",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      custom_fields,
      ...otherProps
    } = this;

    const data = removeNullEntries(otherProps);
    
    if (custom_fields) {
      data.custom_fields = this.freshservice.parseIfJSONString(custom_fields);
    }

    const response = await this.freshservice.createTicket({
      data,
      $,
    });

    $.export("$summary", `Successfully created ticket: ${response.ticket?.subject || response.ticket?.id}`);
    return response;
  },
};
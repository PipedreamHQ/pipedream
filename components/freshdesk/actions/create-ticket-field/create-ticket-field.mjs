import freshdesk from "../../freshdesk.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshdesk-create-ticket-field",
  name: "Create Ticket Field",
  description: "Create a ticket field in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#create_ticket_field)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshdesk,
    label: {
      type: "string",
      label: "Label",
      description: "Display the name of the Ticket Field",
    },
    labelForCustomers: {
      type: "string",
      label: "Label for Customers",
      description: "The label for the field as seen by customers",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the field. Can be custom_dropdown, custom_checkbox, custom_text, etc...",
      default: "custom_text",
    },
    customersCanEdit: {
      type: "boolean",
      label: "Customers Can Edit",
      description: "Whether customers can edit the field",
      optional: true,
    },
    displayedToCustomers: {
      type: "boolean",
      label: "Displayed to Customers",
      description: "Whether the field is displayed to customers",
      optional: true,
    },
    position: {
      type: "integer",
      label: "Position",
      description: "The position of the fieldPosition in which the ticket field is displayed in the form. If not given, it will be displayed on top",
      optional: true,
    },
    requiredForClosure: {
      type: "boolean",
      label: "Required for Closure",
      description: "Set to `true` if the field is mandatory for closing the ticket",
      optional: true,
    },
    requiredForAgents: {
      type: "boolean",
      label: "Required for Agents",
      description: "Set to `true` if the field is mandatory for agents",
      optional: true,
    },
    requiredForCustomers: {
      type: "boolean",
      label: "Required for Customers",
      description: "Set to `true` if the field is mandatory for customers",
      optional: true,
    },
    choices: {
      type: "string[]",
      label: "Choices",
      description: "Array of key, value pairs containing the value and position of dropdown choices. Example: `[{ \"value\": \"Refund\", \"position\": 1 }, { \"value\": \"FaultyProduct\", \"position\": 2 }]`",
      optional: true,
    },
    dependentFields: {
      type: "string[]",
      label: "Dependent Fields",
      description: "Applicable only for dependent fields, this contains details of nested fields Example: `[{ \"label\": \"District\", \"label_for_customers\": \"District\", \"level\": 2 }, { \"label\": \"Branch\", \"label_for_customers\": \"Branch\", \"level\": 3 }]`",
      optional: true,
    },
    sectionMappings: {
      type: "string[]",
      label: "Section Mappings",
      description: "Applicable only if the field is part of a section. This contains the details of a section (ID, position) for which it is been a part of. Example: `[{ \"position\": 3, \"section_id\": 1 }]`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.type === "custom_dropdown" && !this.choices) {
      throw new ConfigurationError("Choices are required for custom_dropdown fields");
    }

    const response = await this.freshdesk.createTicketField({
      $,
      data: {
        label: this.label,
        customers_can_edit: this.customersCanEdit,
        label_for_customers: this.labelForCustomers,
        displayed_to_customers: this.displayedToCustomers,
        position: this.position,
        type: this.type,
        required_for_closure: this.requiredForClosure,
        required_for_agents: this.requiredForAgents,
        required_for_customers: this.requiredForCustomers,
        choices: parseObject(this.choices),
        dependent_fields: parseObject(this.dependentFields),
        section_mappings: parseObject(this.sectionMappings),
      },
    });
    $.export("$summary", `Successfully created ticket field: ${response.label}`);
    return response;
  },
};

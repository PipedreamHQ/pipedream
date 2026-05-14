import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-ticket-fields",
  name: "List Ticket Fields",
  description: "Lists every field configured on a Zoho Desk module (defaults to Tickets), including each field's `apiName`, `displayLabel`, `type`, and for picklist fields - the `allowedValues` array. Useful for discovering valid picklist values (e.g. for `status`, `priority`, `channel`, `category`, `subCategory`, `classification`) before creating or routing tickets. [See the documentation](https://desk.zoho.com/DeskAPIDocument#OrganizationFields_Getorganizationfieldsinamodule)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    module: {
      type: "string",
      label: "Module",
      description: "The Zoho Desk module whose fields to list. Defaults to `tickets`.",
      optional: true,
      default: "tickets",
      options: [
        "tickets",
        "contacts",
        "accounts",
        "tasks",
        "calls",
        "events",
        "timeEntry",
        "products",
        "contracts",
        "agents",
      ],
    },
    apiNames: {
      type: "string[]",
      label: "API Names",
      description: "Select one or more field API names to filter the response (e.g. `category`, `subCategory`, `classification`, `priority`, `status`) (max 100 chars). Leave blank to return every field in the selected module.",
      optional: true,
      async options() {
        const {
          orgId, module: moduleProp,
        } = this;
        if (!orgId) {
          return [];
        }
        const { data: fields = [] } = await this.zohoDesk.getOrganizationFields({
          headers: {
            orgId,
          },
          params: {
            module: moduleProp || "tickets",
          },
        });
        return fields.map(({
          apiName: value, displayLabel: label,
        }) => ({
          value,
          label: label || value,
        }));
      },
    },
  },
  async run({ $ }) {
    const {
      orgId, module: moduleProp, apiNames,
    } = this;

    const { data: fields = [] } = await this.zohoDesk.getOrganizationFields({
      $,
      headers: {
        orgId,
      },
      params: {
        module: moduleProp || "tickets",
        apiNames: apiNames?.length
          ? apiNames.join(",")
          : undefined,
      },
    });

    $.export("$summary", `Retrieved ${fields.length} field${fields.length === 1
      ? ""
      : "s"} from the ${moduleProp || "tickets"} module.`);

    return fields;
  },
};

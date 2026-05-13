import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-departments",
  name: "List Departments",
  description: "Lists the departments configured in the organization, with optional filtering by enabled/disabled state. Use this to drive workflows by department name lookups instead of hardcoded department IDs. [See the documentation](https://desk.zoho.com/DeskAPIDocument#Departments)",
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
    isEnabled: {
      type: "boolean",
      label: "Is Enabled",
      description: "Set to `true` to return only enabled departments, `false` to return only disabled departments. Leave blank to return both.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        zohoDesk,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      orgId, isEnabled, maxResults,
    } = this;

    const departments = [];
    const stream = this.zohoDesk.streamResources({
      resourceFn: this.zohoDesk.getDepartments,
      headers: {
        orgId,
      },
      params: {
        from: 1,
        isEnabled,
      },
      max: maxResults,
    });

    for await (const department of stream) {
      departments.push(department);
    }

    $.export("$summary", `Retrieved ${departments.length} department${departments.length === 1
      ? ""
      : "s"}.`);

    return departments;
  },
};

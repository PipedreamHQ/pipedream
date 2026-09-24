import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-organizations-options",
  name: "List Organizations Options",
  description: "Returns all Asana workspaces for the authenticated account that are organizations (i.e. `is_organization: true`). Use this to obtain organization GIDs for org-scoped actions. Prefer **List Workspaces** when you need all workspaces including non-organization ones. Returns an array of `{label, value}` pairs where `value` is the organization GID. Example: returns `[{label: 'Acme Corp', value: '1200123456789012'}]`. [See the documentation](https://developers.asana.com/reference/getworkspaces)",
  version: "0.0.4",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    asana,
  },
  async run({ $ }) {
    const organizations = await this.asana.getOrganizations();
    const options = organizations.map((organization) => ({
      label: organization.name,
      value: organization.gid,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};

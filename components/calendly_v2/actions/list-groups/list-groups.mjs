import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-groups",
  name: "List Groups",
  description: "List the groups within a Calendly organization via `GET /groups` (requires organization admin/owner privilege). Use this to discover valid Group UUIDs for scoping **List Events** to a specific group. Run **List Organization Memberships** first to obtain an organization URI. Example: call with `organization` set to `https://api.calendly.com/organizations/AAAAAAAAAAAAAAAA` to get groups such as `{ name: \"Sales Team\", uri: \"https://api.calendly.com/groups/BBBBBBBBBBBBBBBB\" }`; pass the trailing `BBBBBBBBBBBBBBBB` segment as the Group UUID to **List Events**. [See the documentation](https://calendly.stoplight.io/docs/api-docs/6rb6dtdln74sy-list-groups)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    calendly,
    organization: {
      propDefinition: [
        calendly,
        "organization",
      ],
    },
    paginate: {
      propDefinition: [
        calendly,
        "paginate",
      ],
    },
    maxResults: {
      propDefinition: [
        calendly,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.calendly.listGroups({
      organization: this.organization,
      paginate: this.paginate,
      maxResults: this.maxResults,
    }, $);

    response.collection = response.collection.map((group) => ({
      ...group,
      uuid: group.uri.split("/").pop(),
    }));

    $.export("$summary", `Found ${response.pagination.count} group(s)`);
    return response;
  },
};

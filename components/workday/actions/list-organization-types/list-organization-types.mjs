import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-organization-types",
  name: "List Organization Types",
  description: "List organization types. [See the documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#common/v1/organizationTypes)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    maxResults: {
      propDefinition: [
        workday,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.workday.paginate({
      fn: this.workday.listOrganizationTypes,
      args: {
        $,
      },
      max: this.maxResults,
    });

    const data = [];
    for await (const result of results) {
      data.push(result);
    }

    $.export("$summary", `Successfully fetched ${data.length} organization types`);
    return data;
  },
};

import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-supervisory-organizations",
  name: "List Supervisory Organizations",
  description: "List supervisory organizations. [See the documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#common/v1/get-/supervisoryOrganizations)",
  version: "0.0.4",
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
      fn: this.workday.listSupervisoryOrganizations,
      args: {
        $,
      },
      max: this.maxResults,
    });

    const data = [];
    for await (const result of results) {
      data.push(result);
    }

    $.export("$summary", `Successfully fetched ${data.length} supervisory organizations`);
    return data;
  },
};

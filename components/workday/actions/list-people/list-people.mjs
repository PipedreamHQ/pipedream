import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-people",
  name: "List People",
  description: "List all people. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#person/v4/get-/people)",
  version: "0.0.1",
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
      fn: this.workday.listPeople,
      args: {
        $,
      },
      max: this.maxResults,
    });

    const data = [];
    for await (const result of results) {
      data.push(result);
    }

    $.export("$summary", `Successfully fetched ${data.length} people`);
    return data;
  },
};

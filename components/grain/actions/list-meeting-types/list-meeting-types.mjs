import grain from "../../grain.app.mjs";

export default {
  key: "grain-list-meeting-types",
  name: "List Meeting Types",
  description: "Lists the meeting types configured in your Grain workspace (id, name, scope), where scope is `internal` or `external`."
    + " Use this to understand how recordings are categorized, or to resolve a meeting type's ID for filtering."
    + " Example: returns `[{\"id\": \"e8b894a9-7ecf-4330-a282-527c085618fd\", \"name\": \"Sales\", \"scope\": \"external\"}, {\"id\": \"815747d1-9e25-40f6-a3b8-e1908e25151e\", \"name\": \"1:1s\", \"scope\": \"internal\"}]`."
    + " [See the documentation](https://developers.grain.com/#list-meeting-types)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    grain,
  },
  async run({ $ }) {
    const { meeting_types: meetingTypes } = await this.grain.listMeetingTypes({
      $,
    });

    $.export("$summary", `Found ${meetingTypes.length} meeting type${meetingTypes.length === 1
      ? ""
      : "s"}`);
    return meetingTypes;
  },
};

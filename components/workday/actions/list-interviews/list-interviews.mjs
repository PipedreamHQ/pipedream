import workday from "../../workday.app.mjs";
export default {
  key: "workday-list-interviews",
  name: "List Interviews",
  description: "List all interviews. [See documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#recruiting/v4/get-/interviews)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
  },
  async run({ $ }) {
    const response = await this.workday.listInterviews({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} interviews`);
    return response;
  },
};

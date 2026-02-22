import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-prospects",
  name: "List Prospects",
  description: "List all prospects. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#recruiting/v4/get-/prospects/-ID-)",
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
    const response = await this.workday.listProspects({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} prospects`);
    return response;
  },
};

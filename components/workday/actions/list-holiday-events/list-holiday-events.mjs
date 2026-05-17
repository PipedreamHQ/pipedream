import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-holiday-events",
  name: "List Holiday Events",
  description: "List all holiday events. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#holiday/v1/get-/holidayEvents)",
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
    const response = await this.workday.listHolidayEvents({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} holiday events`);
    return response;
  },
};

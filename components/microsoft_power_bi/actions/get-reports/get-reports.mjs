import microsoftPowerBi from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-get-reports",
  name: "Get Reports",
  description: "Get reports from a Power BI workspace. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/get-reports)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftPowerBi,
  },
  methods: {
    getReports(opts = {}) {
      return this.microsoftPowerBi._makeRequest({
        path: "/reports",
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const { value } = await this.getReports({
      $,
    });
    $.export("$summary", `Found ${value.length} report${value.length === 1
      ? ""
      : "s"}`);
    return value;
  },
};

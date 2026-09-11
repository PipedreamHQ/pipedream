import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-time-off-types",
  name: "List Time Off Types",
  description: "List active company time off types plus the default hours-per-day (GET /meta/time_off/types). Use the returned type IDs with **Add Time Off Request** and **List Time Off Requests**. [See the documentation](https://documentation.bamboohr.com/reference/list-time-off-types)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    mode: {
      type: "string",
      label: "Mode",
      description: "Set to `request` to return only types the caller can request. Only `request` is accepted.",
      options: [
        "request",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listTimeOffTypes({
      $,
      params: {
        mode: this.mode,
      },
    });
    const types = response?.timeOffTypes ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Retrieved ${types.length} time off type${types.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};

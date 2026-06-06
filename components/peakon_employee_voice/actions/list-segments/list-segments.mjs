import app from "../../peakon_employee_voice.app.mjs";

export default {
  key: "peakon_employee_voice-list-segments",
  name: "List Segments",
  description:
    "Lists all demographic and organizational segments configured in Peakon. "
    + "Each segment includes a `contextId` that can be passed to **Get Engagement Overview** "
    + "and **Get Driver Scores** to scope analytics to a specific population (e.g. a department, "
    + "region, or tenure band). Call this first whenever the user asks about a specific team, "
    + "department, or demographic group and needs analytics scoped to it. "
    + "[See the Peakon API documentation](https://developer.peakon.com/reference/get_segments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    filterAttributeId: {
      type: "integer",
      label: "Filter by Attribute ID",
      description: "The ID of the attribute that is the source of a segment.",
      optional: true,
    },
    filterDirect: {
      type: "boolean",
      label: "Filter Direct Reports Only",
      description: "When true, returns segments including only direct reports. When false, includes all reports.",
      optional: true,
    },
    filterManagerId: {
      type: "integer",
      label: "Filter by Manager ID",
      description: "The employee ID of a manager to filter segments by.",
      optional: true,
    },
    filterType: {
      type: "string",
      label: "Filter by Type",
      description: "The type of attribute that is the source of a segment.",
      options: [
        "employee",
        "option",
        "date",
        "number",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.filterAttributeId !== undefined) params["filter[attributeId]"] = this.filterAttributeId;
    if (this.filterDirect !== undefined) params["filter[direct]"] = this.filterDirect;
    if (this.filterManagerId !== undefined) params["filter[managerId]"] = this.filterManagerId;
    if (this.filterType) params["filter[type]"] = this.filterType;
    const response = await this.app.listSegments({
      $,
      params,
    });
    const segments = response.data ?? [];
    $.export("$summary", `Retrieved ${segments.length} segment(s)`);
    return response;
  },
};

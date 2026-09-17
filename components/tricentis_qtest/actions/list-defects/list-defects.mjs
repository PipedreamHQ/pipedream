import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-list-defects",
  name: "List Defects",
  description: "List defects in a qTest project updated after a given start time. Use this to find defect IDs to use when getting or updating a specific defect. If the response contains a full page of results, increment the Page parameter and call again for more. Defaults to defects updated in the last 30 days. Pass `fields` (e.g. `[\"Summary\"]`) to keep only those named properties per defect — projects with long-running defect logs can return large payloads, since some properties (like Description) may contain lengthy text; narrowing to `Summary` first, then using **Get Defect** for the full record, keeps responses small. Example: `projectId: 1, startTime: \"2026-09-01T00:00:00Z\"` → returns `[{id: 201, properties: [{field_id: 1, field_value: \"Login crash\"}]}, ...]`. [See the documentation](https://docs.tricentis.com/qtest-saas/content/apis/apis/defect_apis.htm#get-recently-updated-defects)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tricentisQtest,
    projectId: {
      propDefinition: [
        tricentisQtest,
        "projectId",
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "ISO 8601 timestamp. Only defects updated after this time are returned. Defaults to 30 days ago.",
      optional: true,
    },
    page: {
      propDefinition: [
        tricentisQtest,
        "page",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of property names to include per defect (e.g. `[\"Summary\"]`) — omit to return every property (today's default). Narrowing this keeps the response small when a project has many/long-running defects.",
      optional: true,
    },
  },
  async run({ $ }) {
    const startTime = this.startTime ?? (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date.toISOString();
    })();
    const response = await this.tricentisQtest.getDefects({
      projectId: this.projectId,
      params: {
        startTime,
        page: this.page,
      },
    });
    const result = this.fields?.length
      ? response?.map((defect) => ({
        ...defect,
        properties: defect.properties?.filter(({ field_name: fieldName }) =>
          this.fields.includes(fieldName)),
      }))
      : response;
    $.export("$summary", `Successfully fetched ${result?.length ?? 0} defect${
      (result?.length ?? 0) === 1
        ? ""
        : "s"
    }`);
    return result;
  },
};

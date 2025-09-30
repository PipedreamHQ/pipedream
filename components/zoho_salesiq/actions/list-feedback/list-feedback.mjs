import zohoSalesIQ from "../../zoho_salesiq.app.mjs";

export default {
  key: "zoho_salesiq-list-feedback",
  name: "List Feedback",
  description: "Retrieve a list of feedback from website visitors. [See the documentation](https://www.zoho.com/salesiq/help/developer-section/visitor-feedback-v2.html)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoSalesIQ,
    screenName: {
      propDefinition: [
        zohoSalesIQ,
        "screenName",
      ],
    },
    departmentIds: {
      propDefinition: [
        zohoSalesIQ,
        "departmentId",
        (c) => ({
          screenName: c.screenName,
        }),
      ],
      type: "string[]",
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Fetch feedback begining at this datetime (in ISO Format)",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "Fetch feedback ending at this datetime (in ISO Format)",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const feedback = await this.zohoSalesIQ.paginate({
      resourceFn: this.zohoSalesIQ.listFeedback,
      args: {
        screenName: this.screenName,
        params: {
          department_ids: this.departmentIds
            ? this.departmentIds?.join()
            : [],
          start_time: this.startTime
            ? Date.parse(this.startTime)
            : undefined,
          end_time: this.endTime
            ? Date.parse(this.endTime)
            : undefined,
        },
      },
      maxResults: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${feedback.length} feedback item${feedback.length === 1
      ? ""
      : "s"}.`);

    return feedback;
  },
};

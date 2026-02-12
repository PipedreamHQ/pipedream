import { GROUP_BY_OPTIONS } from "../../common/constants.mjs";
import app from "../../seven.app.mjs";

export default {
  key: "seven-get-analytics",
  name: "Get Analytics",
  description: "Retrieve account statistics (SMS, RCS, voice, HLR, usage). [See the documentation](https://docs.seven.io/en/rest-api/endpoints/account#statistics)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    start: {
      type: "string",
      label: "Start Date",
      description: "Start date of the statistics in the format YYYY-MM-DD. The date from 30 days ago is set by default",
      optional: true,
    },
    end: {
      type: "string",
      label: "End Date",
      description: "End date of the statistics. The current day by default",
      optional: true,
    },
    label: {
      type: "string",
      label: "Label",
      description: "Only shows data for a specific label. Accepts 'all' for all labels.",
      optional: true,
    },
    subaccounts: {
      propDefinition: [
        app,
        "subaccounts",
      ],
      optional: true,
    },
    groupBy: {
      type: "string",
      label: "Group By",
      description: "How to group the data.",
      options: GROUP_BY_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.start) params.start = this.start;
    if (this.end) params.end = this.end;
    if (this.label) params.label = this.label;
    if (this.groupBy) params.group_by = this.groupBy;

    const response = await this.app.getAnalytics({
      $,
      params,
    });

    $.export("$summary", `Successfully retrieved ${response.length} analytics`);
    return response;
  },
};

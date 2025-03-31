import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-find-email",
  name: "Find Email",
  description: "Search for an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages)",
  version: "0.0.2",
  type: "action",
  props: {
    microsoftOutlook,
    filter: {
      type: "string",
      label: "Filter",
      description: "Filters results. For example, `contains(subject, 'meet for lunch?')` will include messages whose subject contains ‘meet for lunch?’. [See documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter) for the full list of operations.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const { value } = await this.microsoftOutlook.listMessages({
      $,
      params: {
        "$filter": this.filter,
        "$top": this.maxResults,
      },
    });
    $.export("$summary", `Successfully retrieved ${value.length} message${value.length != 1
      ? "s"
      : ""}.`);
    return value;
  },
};

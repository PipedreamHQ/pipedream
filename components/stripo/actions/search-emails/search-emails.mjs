import stripo from "../../stripo.app.mjs";

export default {
  key: "stripo-search-emails",
  name: "Search Emails",
  description: "Searches existing emails by search query in Stripo. [See the documentation](https://api.stripo.email/reference/findemails)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    stripo,
    query: {
      propDefinition: [
        stripo,
        "query",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.stripo.paginate({
      fn: this.stripo.listEmails,
      params: {
        queryStr: this.query,
      },
      max: this.maxResults,
    });

    const emails = [];
    for await (const item of results) {
      emails.push(item);
    }

    $.export("$summary", `Successfully retrieved ${emails.length} email${emails.length === 1
      ? ""
      : "s"}`);
    return emails;
  },
};

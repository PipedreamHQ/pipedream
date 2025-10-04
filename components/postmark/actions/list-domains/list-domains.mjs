import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-list-domains",
  name: "List Domains",
  description: "Gets a list of domains containing an overview of the domain and authentication status. [See the documentation](https://postmarkapp.com/developer/api/domains-api#list-domains)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    postmark,
  },
  async run({ $ }) {
    const response = this.postmark.paginate({
      fn: this.postmark.listDomains,
      fieldList: "Domains",
    });

    const responseArray = [];

    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Successfully fetched ${responseArray.length} domains!`);
    return responseArray;
  },
};

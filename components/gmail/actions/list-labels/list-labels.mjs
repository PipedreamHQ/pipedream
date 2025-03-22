import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-list-labels",
  name: "List Labels",
  description: "List all the existing labels in the connected account. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.labels/list)",
  version: "0.0.2",
  type: "action",
  props: {
    gmail,
  },
  async run({ $ }) {
    const resp = await this.gmail.listLabels();
    $.export("$summary", `Successfully retrieved ${resp.labels.length} labels`);
    return resp;
  },
};

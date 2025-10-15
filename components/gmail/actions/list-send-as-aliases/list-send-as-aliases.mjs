import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-list-send-as-aliases",
  name: "List Send As Aliases",
  description: "List all send as aliases for the authenticated user. [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.sendAs/list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gmail,
  },
  async run({ $ }) {
    const response = await this.gmail.listSignatures({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.sendAs?.length} send as aliases`);

    return response;
  },
};

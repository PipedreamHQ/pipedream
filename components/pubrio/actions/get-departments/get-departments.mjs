import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-departments",
  name: "Get Departments",
  description: "Get available department title codes for filtering. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    destructiveHint: false,
  },
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.getDepartments({
      $,
    });
    $.export("$summary", "Successfully retrieved departments");
    return response;
  },
};

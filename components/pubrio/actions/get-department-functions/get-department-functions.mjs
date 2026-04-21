import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-department-functions",
  name: "Get Department Functions",
  description: "Get available department function codes for filtering. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/departments/function)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.getDepartmentFunctions({
      $,
    });
    $.export("$summary", "Successfully retrieved department functions");
    return response;
  },
};

import glide from "../../glide.app.mjs";

export default {
  key: "glide-list-tables",
  name: "List Big Tables",
  description: "List all Big Tables associated with your Glide team. [See the documentation](https://apidocs.glideapps.com/api-reference/v2/tables/get-tables)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    glide,
    alert: {
      type: "alert",
      alertType: "warning",
      content: "This endpoint only retrieves `Big Table` tables. No other table types will be included in the response, even though they are part of your Glide team.",
    },
  },
  async run({ $ }) {
    const response = await this.glide.listTables({
      $,
    });

    const count = response.data.length || 0;
    const plural = count === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully retrieved ${count} Big Table${plural}`);
    return response;
  },
};


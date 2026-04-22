import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-get-categories",
  name: "Get Categories",
  description: "Retrieves a list of existing categories with ID and category name. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moodle,
  },
  async run({ $ }) {
    const response = await this.moodle.getCategories({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.length} categor${response.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};

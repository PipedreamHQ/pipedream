import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-category",
  name: "Create Category",
  description: "Create a job category. [See the documentation](https://developer.servicem8.com/reference/createcategories)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    name: {
      type: "string",
      label: "Name",
      description:
        "Job category name (required by API). Used to classify and organize jobs.",
    },
    colour: {
      type: "string",
      label: "Colour",
      optional: true,
      description:
        "Hex colour (6 characters 0-9a-f) for the dispatch board and calendar.",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createCategory({
      $,
      data: {
        name: this.name,
        colour: this.colour,
      },
    });
    $.export("$summary", `Created Category${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};

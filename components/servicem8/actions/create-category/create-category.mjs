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
      description: "Job category name (required by API).",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createCategory({
      $,
      data: {
        name: this.name,
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

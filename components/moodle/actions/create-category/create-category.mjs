import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-create-category",
  name: "Create a Category",
  description: "Creates a new course category in Moodle. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new category",
    },
    parent: {
      propDefinition: [
        moodle,
        "categoryId",
      ],
      label: "Parent Category",
      description: "The ID of the parent category. Leave empty to create a top-level category",
      optional: true,
    },
    idnumber: {
      type: "string",
      label: "ID Number",
      description: "An optional external ID number for the category",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the category",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      "categories[0][name]": this.name,
    };
    if (this.parent !== undefined) params["categories[0][parent]"] = this.parent;
    if (this.idnumber !== undefined) params["categories[0][idnumber]"] = this.idnumber;
    if (this.description !== undefined) params["categories[0][description]"] = this.description;

    const response = await this.moodle.createCategories({
      $,
      params,
    });
    $.export("$summary", `Successfully created category "${this.name}"`);
    return response;
  },
};

import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-update-category",
  name: "Update a Category",
  description: "Updates an existing course category's name, ID number, or description. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moodle,
    categoryId: {
      propDefinition: [
        moodle,
        "categoryId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The updated name of the category",
      optional: true,
    },
    idnumber: {
      type: "string",
      label: "ID Number",
      description: "The updated external ID number for the category",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The updated description for the category",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.moodle.updateCategories({
      $,
      params: {
        "categories[0][id]": this.categoryId,
        "categories[0][name]": this.name,
        "categories[0][idnumber]": this.idnumber,
        "categories[0][description]": this.description,
      },
    });
    $.export("$summary", `Successfully updated category ${this.categoryId}`);
    return response;
  },
};

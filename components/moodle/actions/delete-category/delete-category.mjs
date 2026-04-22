import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-delete-category",
  name: "Delete a Category",
  description: "Deletes a course category in Moodle. Setting recursive to true will remove all courses and subcategories inside this category. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
    newparent: {
      propDefinition: [
        moodle,
        "categoryId",
      ],
      label: "New Parent Category",
      description: "The ID of the category to move the contents into when deleting. If not provided, contents are moved to the parent category",
      optional: true,
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "If `true`, deletes all subcategories and courses inside the category. **Warning: this is irreversible.**",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.moodle.deleteCategories({
      $,
      params: {
        "categories[0][id]": this.categoryId,
        "categories[0][newparent]": this.newparent,
        "categories[0][recursive]": this.recursive === undefined
          ? undefined
          : this.recursive
            ? 1
            : 0,
      },
    });
    $.export("$summary", `Successfully deleted category with ID ${this.categoryId}`);
    return response;
  },
};

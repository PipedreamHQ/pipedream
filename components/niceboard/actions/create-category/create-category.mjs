import niceboard from "../../niceboard.app.mjs";

export default {
  key: "niceboard-create-category",
  name: "Create Category",
  description: "Creates a new job category within the niceboard app. This action can help in organizing job postings more effectively.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    niceboard,
    name: {
      type: "string",
      label: "Category Name",
      description: "The name of the job category to be created",
    },
  },
  async run({ $ }) {
    const response = await this.niceboard.postCategory({
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully created category with name ${this.name}`);
    return response;
  },
};

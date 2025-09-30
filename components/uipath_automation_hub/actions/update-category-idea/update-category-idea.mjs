import app from "../../uipath_automation_hub.app.mjs";

export default {
  key: "uipath_automation_hub-update-category-idea",
  name: "Update Category Idea",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Change the category of a specific Idea. [See the documentation](https://automation-hub.uipath.com/api/v1/api-doc/#/Automation%20Ideas/AutomationCategoriesUpdate)",
  type: "action",
  props: {
    app,
    automationId: {
      propDefinition: [
        app,
        "automationId",
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      automationId,
      categoryId,
    } = this;

    const response = await app.updateCategoryIdea({
      $,
      automationId,
      data: {
        category_id: categoryId,
      },
    });

    $.export("$summary", `The category of the idea with Id: ${automationId} was successfully updated!`);
    return response;
  },
};

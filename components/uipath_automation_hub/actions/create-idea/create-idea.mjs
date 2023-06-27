import { RULES_OPTIONS } from "../../common/constants.mjs";
import app from "../../uipath_automation_hub.app.mjs";

export default {
  key: "uipath_automation_hub-create-idea",
  name: "Create Idea",
  version: "0.0.1",
  description: "Submit a new automation idea. [See the documentation](https://automation-hub.uipath.com/api/v1/api-doc/#/Automation%20Ideas/SubmitIdeaEmployeeDrivenwithSubmitter)",
  type: "action",
  props: {
    app,
    processName: {
      type: "string",
      label: "Process Name",
      description: "Name of the idea.",
    },
    processDescription: {
      type: "string",
      label: "Process Description",
      description: "Description of the idea.",
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    rules: {
      type: "integer",
      label: "Rules",
      description: "How rule-based is your task?",
      options: RULES_OPTIONS,
    },
  },
  async run({ $ }) {
    const {
      app,
      processName,
      processDescription,
      categoryId,
      ...data
    } = this;

    const response = await app.createIdea({
      $,
      data: {
        ...data,
        process_name: processName,
        process_description: processDescription,
        category_id: categoryId,
      },
    });

    $.export("$summary", `A new idea with Id: ${response?.data?.process_id} was successfully created!`);
    return response;
  },
};

import app from "../../uipath_automation_hub.app.mjs";

export default {
  key: "uipath_automation_hub-create-idea",
  name: "Create Idea",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Submit a new automation idea. [See the documentation](https://automation-hub.uipath.com/api/v1/api-doc/#/Automation%20Ideas/SubmitIdeaEmployeeDrivenwithSubmitter)",
  type: "action",
  props: {
    app,
    processName: {
      propDefinition: [
        app,
        "processName",
      ],
    },
    processDescription: {
      propDefinition: [
        app,
        "processDescription",
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    rules: {
      propDefinition: [
        app,
        "rules",
      ],
    },
    inputType: {
      propDefinition: [
        app,
        "inputType",
      ],
    },
    inputQuality: {
      propDefinition: [
        app,
        "inputQuality",
      ],
    },
    stability: {
      propDefinition: [
        app,
        "stability",
      ],
    },
    documentation: {
      propDefinition: [
        app,
        "documentation",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      processName,
      processDescription,
      categoryId,
      inputType,
      inputQuality,
      ...data
    } = this;

    const { data: { user } } = await app.authInfo();

    const response = await app.createIdea({
      $,
      data: {
        ...data,
        process_name: processName,
        process_description: processDescription,
        category_id: categoryId,
        input_type: inputType,
        input_quality: inputQuality,
        owner: user?.user_email,
      },
    });

    $.export("$summary", `A new idea with Id: ${response?.data?.process_id} was successfully created!`);
    return response;
  },
};

import videoask from "../../videoask.app.mjs";

export default {
  key: "videoask-create-question",
  name: "Create Question",
  description: "Creates a question within a specified form in VideoAsk. [See the documentation](https://documenter.getpostman.com/view/291373/swtedwrg)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    videoask,
    formId: {
      type: "string",
      label: "Form ID",
      description: "ID of the form where the question will be created",
    },
    questionContent: {
      type: "string",
      label: "Question Content",
      description: "Content of the question to be created",
    },
    questionConfig: {
      type: "object",
      label: "Question Configuration",
      description: "Optional configurations for the question including type, options for multiple choice, layout, etc",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.videoask.createQuestion({
      formId: this.formId,
      questionContent: this.questionContent,
      questionConfig: this.questionConfig,
    });
    $.export("$summary", `Successfully created question with ID: ${response.id}`);
    return response;
  },
};

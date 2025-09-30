import { getQuestionProps } from "../../common/utils.mjs";
import app from "../../tess_ai_by_pareto.app.mjs";

export default {
  key: "tess_ai_by_pareto-execute-agent",
  name: "Execute AI Agent",
  description:
    "Executes an AI Agent (template) with the given input. [See the documentation](https://tess.pareto.io/api/swagger#/default/f13b3be7386ce63d99fa4bdee0cf6c95)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
      reloadProps: true,
    },
  },
  methods: {
    getQuestionProps,
  },
  async additionalProps() {
    const { questions } = await this.app.getTemplate(this.templateId);
    return this.getQuestionProps(questions);

  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      app, templateId, getQuestionProps, ...data
    } = this;
    const response = await this.app.executeTemplate({
      $,
      templateId,
      data,
    });
    $.export(
      "$summary",
      `Executed AI agent ${response.id}`,
    );
    return response;
  },
};

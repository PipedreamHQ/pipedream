import qualaroo from "../../qualaroo.app.mjs";

export default {
  key: "qualaroo-activate-survey",
  name: "Activate Survey",
  description: "Activate a survey. [See docs here.]()",
  type: "action",
  version: "0.0.1",
  props: {
    qualaroo,
    survey: {
      propDefinition: [
        qualaroo,
        "survey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.activateSurvey({
      survey: this.survey,
    });
    $.export("$summary", `Survey ID: ${this.survey} activated`);
    return response;
  },
};

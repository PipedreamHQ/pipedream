import hansei from "../../hansei.app.mjs";

export default {
  key: "hansei-generate-answer",
  name: "Generate Answer",
  description: "Obtain an answer to a specified question",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    hansei,
    question: {
      propDefinition: [
        hansei,
        "question",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hansei.getAnswerToQuestion({
      question: this.question,
    });
    $.export("$summary", `Generated answer for question: ${this.question}`);
    return response;
  },
};

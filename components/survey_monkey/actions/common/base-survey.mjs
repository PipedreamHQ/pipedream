import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  props: {
    surveyMonkey,
    survey: {
      propDefinition: [
        surveyMonkey,
        "survey",
      ],
    },
  },
};

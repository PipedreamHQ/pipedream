export function getQuestionProps(questions) {
  function getQuestionPropType(type) {
    switch (type) {
    case "number":
      return "integer";
    default:
      return "string";
    }
  }

  return (questions ?? []).reduce((obj, question) => {
    obj[question.name] = {
      type: getQuestionPropType(question.type),
      label: `Field: "${question.name}"`,
      description: `Type: \`${question.type}\`. Description: "${question.description}"`,
      options: question.options,
      optional: !question.required,
    };
    return obj;
  }, {});
}

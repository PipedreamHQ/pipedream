import { ConfigurationError } from "@pipedream/platform";
import constants from "./constants.mjs";

export const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isRealDate = (date) => constants.FORM_DATE_PATTERN.test(date)
  && !Number.isNaN(Date.parse(`${date}T00:00:00Z`))
  && new Date(`${date}T00:00:00Z`).toISOString()
    .startsWith(date);

export const parseJson = (value, label) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new ConfigurationError(`${label} is not valid JSON: ${error.message}`);
  }
};

const normalizeChoices = (choices = []) => choices.map(({
  id, label, name, other, children,
}) => ({
  id,
  label: label ?? name,
  ...(other && {
    other,
  }),
  ...(children?.length && {
    children: normalizeChoices(children),
  }),
}));

const layoutQuestionIds = (node) => {
  if (!node || typeof node !== "object") {
    return [];
  }
  if (node.type === "extension" && node.attrs?.extensionKey === "question") {
    return [
      String(node.attrs.parameters?.id),
    ];
  }
  return (node.content ?? []).flatMap(layoutQuestionIds);
};

const describeConditions = (design, sectionId) =>
  design.sections?.[sectionId]?.conditions?.map((conditionId) => {
    const {
      i: input, o: output,
    } = design.conditions?.[conditionId] ?? {};
    return {
      effect: output?.t === "hide"
        ? "hide"
        : "show",
      whenAnyChoiceSelected: input?.co?.cIds,
      ...(input?.groups?.length && {
        operator: input.operator,
        fieldChecks: input.groups,
      }),
    };
  });

export const buildFormQuestions = ({
  design, externalFields = {},
}) => {
  // layout[0] is the form body; layout[n] holds the questions of the nth section.
  const sectionIds = Object.keys(design.sections ?? {});
  const sectionByQuestion = new Map();
  (design.layout ?? []).forEach((doc, index) => {
    for (const questionId of layoutQuestionIds(doc)) {
      sectionByQuestion.set(questionId, index
        ? sectionIds[index - 1]
        : null);
    }
  });
  const questionIds = [
    ...sectionByQuestion.keys(),
    ...Object.keys(design.questions ?? {}).filter((id) => !sectionByQuestion.has(id)),
  ].filter((id) => design.questions?.[id]);

  return questionIds.map((questionId) => {
    const {
      label, description, type, choices, jiraField, dcId, defaultAnswer, validation = {},
    } = design.questions[questionId];
    const {
      rq, ...rules
    } = validation;
    const external = externalFields[questionId];
    const allChoices = normalizeChoices(choices?.length
      ? choices
      : external?.choices);
    const conditions = describeConditions(design, sectionByQuestion.get(questionId));
    return {
      questionId,
      label,
      description,
      type,
      typeName: constants.FORM_QUESTION_TYPES[type]?.name,
      answerFormat: constants.FORM_QUESTION_TYPES[type]?.answer,
      required: Boolean(rq),
      ...(allChoices.length && {
        choices: allChoices,
      }),
      ...(Object.keys(rules).length && {
        validation: rules,
      }),
      ...((external?.jiraField?.id || jiraField) && {
        jiraField: external?.jiraField?.id || jiraField,
      }),
      ...(dcId && {
        dataConnectionId: dcId,
      }),
      ...(defaultAnswer && {
        defaultAnswer,
      }),
      ...(conditions?.length && {
        conditions,
      }),
    };
  });
};

const flattenChoices = (choices = [], parentId) => choices.flatMap((choice) => [
  {
    ...choice,
    parentId,
  },
  ...flattenChoices(choice.children, choice.id),
]);

// The Forms API stores unknown choice IDs, mismatched answer keys, and emails as users silently.
export const validateFormAnswers = ({
  questions, answers,
}) => {
  const questionsById = Object.fromEntries(questions.map((question) => [
    question.questionId,
    question,
  ]));
  const fail = (message) => {
    throw new ConfigurationError(`${message} Run **Get Request Type Form** to see each question's \`answerFormat\` and choices.`);
  };

  return Object.fromEntries(Object.entries(answers).map(([
    questionId,
    answer,
  ]) => {
    const question = questionsById[questionId];
    if (!question) {
      fail(`Form question \`${questionId}\` is not on this request type's form. Valid question IDs: ${Object.keys(questionsById).join(", ")}.`);
    }
    const type = constants.FORM_QUESTION_TYPES[question.type];
    if (!type?.keys) {
      return [
        questionId,
        answer,
      ];
    }
    const name = `Question \`${questionId}\` ("${question.label}", ${type.name})`;
    if (!isPlainObject(answer) || !Object.keys(answer).length) {
      fail(`${name} needs an answer object like ${type.answer}.`);
    }
    const invalidKeys = Object.keys(answer).filter((key) => !type.keys.includes(key));
    if (invalidKeys.length) {
      fail(`${name} takes ${type.answer}, not \`${invalidKeys.join("`, `")}\`.`);
    }
    for (const key of [
      "choices",
      "users",
      "files",
    ]) {
      if (answer[key] && !Array.isArray(answer[key])) {
        fail(`${name} needs \`${key}\` as a list, like ${type.answer}.`);
      }
    }
    if (answer.date && !isRealDate(answer.date)) {
      fail(`${name} needs \`date\` as a real YYYY-MM-DD date, not \`${answer.date}\`.`);
    }
    if (answer.time && !constants.FORM_TIME_PATTERN.test(answer.time)) {
      fail(`${name} needs \`time\` as 24-hour HH:mm, not \`${answer.time}\`.`);
    }
    if (type.numeric && answer.text && !constants.FORM_NUMBER_PATTERN.test(answer.text)) {
      fail(`${name} needs a number, not \`${answer.text}\`.`);
    }
    const selections = answer.choices ?? answer.users ?? [];
    if (type.maxSelections && selections.length > type.maxSelections) {
      fail(`${name} accepts only one selection.`);
    }
    if (answer.users?.some((user) => String(user).includes("@"))) {
      fail(`${name} needs Atlassian account IDs, not email addresses. Run **Find Users** to look up an \`accountId\`.`);
    }
    let selected = [];
    if (answer.choices && question.choices) {
      const choices = flattenChoices(question.choices);
      selected = answer.choices.map((choiceId) => {
        const choice = choices.find(({ id }) => id === String(choiceId));
        if (!choice) {
          fail(`${name} has no choice \`${choiceId}\`. Valid choices: ${choices.map(({
            id, label,
          }) => `${id} (${label})`).join(", ")}.`);
        }
        return choice;
      });
      if (type.cascading) {
        const parents = selected.filter(({ parentId }) => !parentId);
        const children = selected.filter(({ parentId }) => parentId);
        if (parents.length !== 1 || children.length > 1
          || children.some(({ parentId }) => parentId !== parents[0].id)) {
          fail(`${name} takes one top-level choice, optionally followed by one of its own child choices.`);
        }
      }
    }
    const otherSelected = question.choices
      ? selected.some(({ other }) => other)
      : Boolean(answer.choices?.length);
    if (answer.text && type.keys.includes("choices") && !otherSelected) {
      fail(`${name} accepts \`text\` only alongside its "other" choice.`);
    }
    return [
      questionId,
      {
        ...answer,
        ...(typeof answer.text === "number" && {
          text: String(answer.text),
        }),
        ...(answer.choices && {
          choices: answer.choices.map(String),
        }),
      },
    ];
  }));
};

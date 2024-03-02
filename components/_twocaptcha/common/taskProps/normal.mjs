export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the ArkoseLabs task.",
    options: [
      "ImageToTextTask",
    ],
    default: "ImageToTextTask",
    reloadProps: true,
  },
  body: {
    type: "string",
    label: "Body",
    description: "Image encoded into Base64 format. Data-URI format (containing data:content/type prefix) is also supported.",
  },
  phrase: {
    type: "boolean",
    label: "Phrase",
    description: "Whether the answer should contain at least two words separated by space.",
    optional: true,
  },
  case: {
    type: "boolean",
    label: "Case",
    description: "Whether the result is case-sensitive.",
    optional: true,
  },
  numeric: {
    type: "integer",
    label: "Numeric",
    description: "What the answer must contain.",
    options: [
      {
        label: "Answer should contain only numbers",
        value: 1,
      },
      {
        label: "Answer should contain only letters",
        value: 2,
      },
      {
        label: "Answer should contain only number OR only letters",
        value: 3,
      },
      {
        label: "Answer MUST contain both number AND letters",
        value: 4,
      },
    ],
    optional: true,
  },
  math: {
    type: "boolean",
    label: "Math",
    description: "Whether captcha requires calculation.",
    optional: true,
  },
  minLength: {
    type: "integer",
    label: "Min Length",
    description: "Defines minimal answer length.",
    optional: true,
  },
  maxLength: {
    type: "integer",
    label: "Max Length",
    description: "Defines maximal answer length.",
    optional: true,
  },
  comment: {
    type: "string",
    label: "Comment",
    description: "A comment will be shown to workers to help them to solve the captcha properly.",
    optional: true,
  },
  imgInstructions: {
    type: "string",
    label: "Img Instructions",
    description: "An optional image with instruction that will be shown to workers. Image should be encoded into Base64 format.",
    optional: true,
  },
};

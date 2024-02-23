export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the Draw Around task.",
    options: [
      "DrawAroundTask",
    ],
    default: "DrawAroundTask",
    reloadProps: true,
  },
  body: {
    type: "string",
    label: "Body",
    description: "Image encoded into Base64 format. Data-URI format **(containing data:content/type prefix)** is also supported.",
  },
  comment: {
    type: "string",
    label: "Comment",
    description: "A comment will be shown to workers to help them to solve the captcha properly.",
    optional: true,
  },
  imgInstructions: {
    type: "string",
    label: "img Instructions",
    description: "An optional image with instruction that will be shown to workers. Image should be encoded into Base64 format. Max file size: 100 kB.",
    optional: true,
  },
};

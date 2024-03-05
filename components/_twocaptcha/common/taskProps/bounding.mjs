export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the BoundingBox task.",
    options: [
      "BoundingBoxTask",
    ],
    default: "BoundingBoxTask",
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
    description: "A comment will be shown to workers to help them to solve the captcha properly. The **comment** property is required if the **imgInstructions** property is missing.",
    optional: true,
  },
  imgInstructions: {
    type: "string",
    label: "img Instructions",
    description: "An optional image with instruction that will be shown to workers. Image should be encoded into Base64 format. Max file size: 100 kB. The **imgInstructions** property is required if the **comment** property is missing.",
    optional: true,
  },
};

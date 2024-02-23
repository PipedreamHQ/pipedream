export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the Rotate task.",
    options: [
      "RotateTask",
    ],
    default: "RotateTask",
    reloadProps: true,
  },
  body: {
    type: "string",
    label: "Body",
    description: "Image encoded into Base64 format. Data-URI format **(containing data:content/type prefix)** is also supported.",
  },
  angle: {
    type: "string",
    label: "Angle",
    description: "One step rotation angle. You can count how many steps are required to rotate the image 360 degrees and then divide 360 by this count to get the angle value.",
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
    label: "img Instructions",
    description: "An optional image with instruction that will be shown to workers. Image should be encoded into Base64 format. Max file size: 100 kB.",
    optional: true,
  },
};

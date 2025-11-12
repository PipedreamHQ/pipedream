import asticaAi from "../../astica_ai.app.mjs";

export default {
  name: "Describe Image",
  description: "Analyze an image with Astica AI [See the documentation](https://astica.ai/vision/documentation/)",
  key: "astica_ai-describe-image",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    asticaAi,
    image: {
      type: "string",
      label: "Image",
      description: "The URL of the image to analyze",
    },
    describe: {
      type: "boolean",
      label: "Describe",
      description: "Returns a caption which describes the image.",
      optional: true,
      default: false,
    },
    gpt: {
      type: "boolean",
      label: "GPT",
      description: "Uses the result of asticaVision to create a GPT description. Using this parameter increases the processing time of your API request. Be Patient.",
      optional: true,
      default: false,
    },
    gpt_detailed: {
      type: "boolean",
      label: "GPT Detailed",
      description: "Uses the result of asticaVision to create a GPT-4 description. Using this parameter greatly increases the processing time of your API request. Please be patient.",
      optional: true,
      default: false,
    },
    faces: {
      type: "boolean",
      label: "Faces",
      description: "Returns the age and gender of all faces detected in the image.",
      optional: true,
      default: false,
    },
    moderate: {
      type: "boolean",
      label: "Moderate",
      description: "Returns a calculated value for different types of sensitive materials found in the image.",
      optional: true,
      default: false,
    },
    tags: {
      type: "boolean",
      label: "Tags",
      description: "Returns a list of descriptive terms which describe the image.",
      optional: true,
      default: false,
    },
    brands: {
      type: "boolean",
      label: "Brands",
      description: "Returns a list of brands that have been identified. For example, a logo on a cup, or a t-shirt.",
      optional: true,
      default: false,
    },
    celebrities: {
      type: "boolean",
      label: "Celebrities",
      description: "Returns a list of celebrities and other known persons that have been detected in the photo.",
      optional: true,
      default: false,
    },
    landmarks: {
      type: "boolean",
      label: "Landmarks",
      description: "Returns a list of known locations and landmarks found in the photo. For example, the Eiffel Tower.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      asticaAi,
      image,
      ...otherProps
    } = this;

    const visionParams = [];
    for (const [
      key,
      value,
    ] of Object.entries(otherProps)) {
      if (value) {
        visionParams.push(key);
      }
    }

    const response = await asticaAi.describeImage({
      data: {
        input: image,
        visionParams: visionParams.join(","),
        modelVersion: "2.1_full",
        gpt_prompt: "",
        gpt_length: "90",
      },
      $,
    });

    if (response?.status === "success") {
      $.export("$summary", "Successfully analyzed image.");
    }

    return response;
  },
};

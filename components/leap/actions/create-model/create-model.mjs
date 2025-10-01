import leap from "../../leap.app.mjs";

export default {
  key: "leap-create-model",
  name: "Create Model",
  description: "Creates a new custom model entity, which serves as a container that can be trained on custom images. [See the documentation](https://docs.tryleap.ai/reference/createmodel)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    leap,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the model",
    },
    subjectKeyword: {
      type: "string",
      label: "Subject Keyword",
      description: "The keyword you will use during inference to trigger the specific styles.",
    },
    subjectIdentifier: {
      type: "string",
      label: "Subject Identifier",
      description: "A random string that will replace the subject keyword at the time of inference. If not provided, a random string will be automatically generated.",
      optional: true,
    },
    subjectType: {
      propDefinition: [
        leap,
        "subjectType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.leap.createModel({
      data: {
        title: this.title,
        subjectKeyword: this.subjectKeyword,
        subjectIdentifier: this.subjectIdentifier,
        subjectType: this.subjectType,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created model with id ${response.id}`);
    }

    return response;
  },
};

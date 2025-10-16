import transform from "../../transform.app.mjs";

const docLink = "https://documentation.alphasoftware.com/TransFormDocumentation/pages/Ref/API/CreateNewFormInstance.xml";

export default {
  key: "transform-submit-form",
  name: "Submit Form",
  description: `Submit a form via JSON. [See the docs](${docLink}). For a better user experience use the [Alpha TransForm Mobile App](https://www.alphasoftware.com/transform-tutorial-part2).`,
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    transform,
    formId: {
      propDefinition: [
        transform,
        "formId",
      ],
    },
    formData: {
      type: "object",
      label: "Form Data",
      description: "Form Data in JSON format",
    },
  },
  async run({ $ }) {
    const {
      formId,
      formData,
    } = this;

    const formDataJSON = typeof (formData) === "string"
      ? JSON.parse(formData)
      : formData;

    const { result } = await this.transform.submitForm({
      $,
      data: {
        formId,
        formDataJSON,
      },
    });
    $.export("$summary", "Successfully submitted form");
    return result;
  },
};

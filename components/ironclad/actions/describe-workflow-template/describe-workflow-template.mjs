import app from "../../ironclad.app.mjs";

const FORMAT_EXAMPLES = {
  address: "{ \"lines\": [\"325 5th Street\", \"Suite 200\"], \"locality\": \"San Francisco\", \"region\": \"California\", \"postcode\": \"94107\", \"country\": \"USA\" }",
  monetaryAmount: "{ \"currency\": \"USD\", \"amount\": 25.37 }",
  date: "2021-05-11T17:16:53-07:00",
  duration: "{ \"years\": 1, \"months\": 2, \"weeks\": 3, \"days\": 4 }",
  email: "test@gmail.com",
  document: "{ \"url\": \"https://your.file.server.test/test-doc.docx\" }",
  user: "{ \"email\": \"user@example.com\" }",
};

export default {
  key: "ironclad-describe-workflow-template",
  name: "Describe Workflow Template",
  description: "Returns the fillable attribute schema for a specific Ironclad workflow template — attribute keys, types, display names, required flags, enum options, and format examples."
    + " **Use this before Launch Workflow** to learn what attributes the template expects and their expected shapes."
    + " Call **Describe Workspace** first to list available templates and get a `templateId`."
    + " Attribute shapes include: `string`, `boolean`, `date` (ISO 8601), `monetaryAmount` (`{currency, amount}`), `address` (`{lines, locality, region, postcode, country}`), `duration` (`{years, months, weeks, days}`), `email`, `document` (`{url}`), `user` (`{email}`), and `array` of any of these."
    + " [See the documentation](https://developer.ironcladapp.com/reference/retrieve-a-workflow-schema)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the workflow template to describe. Obtain from **Describe Workspace**.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getWorkflowSchema({
      $,
      templateId: this.templateId,
    });

    const schema = response?.schema ?? {};
    const attributes = Object.entries(schema).map(([
      key,
      value,
    ]) => {
      const entry = {
        key,
        type: value.type,
        displayName: value.displayName,
        readOnly: !!value.readOnly,
        required: !!value.required,
      };
      if (value.elementType) entry.elementType = value.elementType;
      if (value.options) entry.options = value.options;
      if (value.description) entry.description = value.description;
      if (FORMAT_EXAMPLES[value.type]) {
        entry.example = FORMAT_EXAMPLES[value.type];
      }
      if (value.type === "array" && value.elementType && FORMAT_EXAMPLES[value.elementType.type]) {
        entry.elementExample = FORMAT_EXAMPLES[value.elementType.type];
      }
      return entry;
    });

    $.export("$summary", `Template ${this.templateId} has ${attributes.length} attribute(s)`);

    return {
      templateId: this.templateId,
      name: response?.name,
      description: response?.description,
      attributes,
      raw: response,
    };
  },
};

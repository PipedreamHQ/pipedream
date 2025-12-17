import formstack from "../../formstack.app.mjs";
import utils from "../common/utils.mjs";

export default {
  type: "action",
  key: "formstack-create-form",
  name: "Create Form",
  description: "Create a new form in your account. [See docs here](https://formstack.readme.io/docs/form-post)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    formstack,
    name: {
      label: "Name",
      description: "The form name",
      type: "string",
    },
    fields: {
      label: "Fields",
      description: "Array of Field resources IDs. [See fields docs here](https://formstack.readme.io/docs/field-types). E.g. `[ { \"field_type\": \"name\", \"label\": \"Name\" } ]`",
      type: "string",
      optional: true,
    },
    language: {
      label: "Language",
      description: "The language for the form - [use ISO 639-1 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)",
      type: "string",
      optional: true,
    },
    submitButtonTitle: {
      label: "Submit Button Title",
      description: "The submit button title",
      type: "string",
      optional: true,
    },
    db: {
      label: "Save in database",
      description: "Flag to disable or enable submissions to be saved in our database",
      type: "boolean",
      optional: true,
    },
    password: {
      label: "Password",
      description: "Sets a password for the form",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      fields,
      language,
      submitButtonTitle,
      db,
      password,
    } = this;

    const response = await this.formstack.createForm({
      data: {
        name,
        fields: utils.parseStringToJSON(fields, []),
        language,
        db,
        password,
        submit_button_title: submitButtonTitle,
      },
      $,
    });

    $.export("$summary", `Successfully created form with ID ${response.id}`);

    return response;
  },
};

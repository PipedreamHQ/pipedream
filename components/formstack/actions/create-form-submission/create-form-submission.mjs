import formstack from "../../formstack.app.mjs";
import utils from "../common/utils.mjs";

export default {
  type: "action",
  key: "formstack-create-form-submission",
  name: "Create Form Submission",
  description: "Create a new submission for the specified form. [See docs here](https://formstack.readme.io/docs/form-id-submission-post)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    formstack,
    formId: {
      propDefinition: [
        formstack,
        "formId",
      ],
    },
    fields: {
      label: "Fields",
      description: "Value that should be stored for a specific field on the form. For this parameter, x must contain the id of the field whose value should be set. For fields with subfields (name, address, etc), use array notation with each item being the subfield and each key being the name of that subfield. E.g. { \"field_12345\": { \"first\": \"John\", \"last\": \"Smith\" } }",
      type: "string",
    },
    encryptionPassword: {
      label: "Encryption Password",
      description: "The password used to decrypt your submissions. Without this value, you will only receive the submission ID and the success message when submitting encrypted forms",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      formId,
      fields,
      encryptionPassword,
    } = this;

    const parsedFields = utils.emptyStrToUndefined(fields)
      ? JSON.parse(fields)
      : {};

    const response = await this.formstack.createSubmission({
      formId,
      data: {
        ...parsedFields,
        encryption_password: encryptionPassword,
      },
      $,
    });

    $.export("$summary", "Successfully created submission");

    return response;
  },
};

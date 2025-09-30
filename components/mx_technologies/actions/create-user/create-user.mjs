import mxTechnologies from "../../mx_technologies.app.mjs";

export default {
  key: "mx_technologies-create-user",
  name: "Create User",
  description: "Creates a new user in the MX Technologies platform. [See the documentation](https://docs.mx.com/api-reference/platform-api/reference/create-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mxTechnologies,
    email: {
      type: "string",
      label: "Email",
      description: "The end user's email address.",
    },
    id: {
      type: "string",
      label: "ID",
      description: "A unique, partner-defined, enforced identifier for the **user**. This value must be URL-safe. The **id** field must only contain letters, numbers, and the dash and underscore characters.",
      optional: true,
    },
    isDisabled: {
      type: "boolean",
      label: "Is Disabled",
      description: "This indicates whether the user has been disabled. Defaults to **false**.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        mxTechnologies,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mxTechnologies.createUser({
      $,
      data: {
        user: {
          email: this.email,
          id: this.id,
          is_disabled: this.isDisabled,
          metadata: this.metadata && JSON.stringify(this.metadata),
        },
      },
    });
    $.export("$summary", `Successfully created user with Id: ${response.user.guid}`);
    return response;
  },
};

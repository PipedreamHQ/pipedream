import softr from "../../softr.app.mjs";

export default {
  key: "softr-create-user",
  name: "Create User",
  description: "Creates a new user within your Softr app. [See the documentation](https://docs.softr.io/softr-api/tTFQ5vSAUozj5MsKixMH8C/api-setup-and-endpoints/j1PrTZxt7pv3iZCnZ5Fp19#create-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    softr,
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Full name of the new user",
    },
    email: {
      propDefinition: [
        softr,
        "email",
      ],
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for the new user. If you don't specify a password, it will be generated for the user automatically.",
      optional: true,
    },
    generateMagicLink: {
      type: "boolean",
      label: "Generate Magic Link",
      description: "Whether you want to generate a Magic Link for the user or not",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.softr.createUser({
      $,
      data: {
        full_name: this.fullName,
        email: this.email,
        password: this.password,
        generate_magic_link: this.generateMagicLink,
      },
    });
    $.export("$summary", `Successfully created user with email: ${this.email}`);
    return response;
  },
};

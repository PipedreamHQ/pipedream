import app from "../../api_ninjas.app.mjs";

export default {
  key: "api_ninjas-generate-password",
  name: "Generate Password",
  description: "Returns a random password string adhering to the specified parameters. [See the documentation](https://api-ninjas.com/api/passwordgenerator)",
  version: "0.0.2",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    length: {
      propDefinition: [
        app,
        "length",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.generatePassword({
      $,
      params: {
        length: this.length,
      },
    });
    $.export("$summary", "Successfully generated password");
    return response;
  },
};

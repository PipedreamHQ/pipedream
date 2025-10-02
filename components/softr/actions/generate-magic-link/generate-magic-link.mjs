import softr from "../../softr.app.mjs";

export default {
  key: "softr-generate-magic-link",
  name: "Generate Magic Link",
  description: "Generate a Magic Link for the specified user in your Softr app. [See the documentation](https://docs.softr.io/softr-api/tTFQ5vSAUozj5MsKixMH8C/api-setup-and-endpoints/j1PrTZxt7pv3iZCnZ5Fp19#generate-a-magic-link-for-the-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    softr,
    email: {
      propDefinition: [
        softr,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.softr.generateMagicLink({
      $,
      email: this.email,
    });
    $.export("$summary", `Successfully generated magic link: ${response}`);
    return response;
  },
};

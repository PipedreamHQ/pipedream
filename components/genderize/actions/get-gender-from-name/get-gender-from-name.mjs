import app from "../../genderize.app.mjs";

export default {
  key: "genderize-get-gender-from-name",
  name: "Get Gender From Name",
  description: "Check the statistical probability of a name being male or female. [See the documentation](https://genderize.io/documentation#basic-usage)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getGenderFromName({
      $,
      params: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully sent the request. Result: ${response.gender}`);
    return response;
  },
};

import app from "../../genderapi_io.app.mjs";

export default {
  key: "genderapi_io-name-to-gender",
  name: "Name to Gender",
  description: "Send a Name to Gender request to GenderAPI. [See the documentation](https://www.genderapi.io/api-documentation#single-name)",
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
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.nameToGender({
      $,
      params: {
        name: this.name,
        country: this.country,
      },
    });

    $.export("$summary", `Successfully sent the request. Result: '${response.gender}'`);

    return response;
  },
};

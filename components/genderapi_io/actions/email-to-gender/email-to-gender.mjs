import app from "../../genderapi_io.app.mjs";

export default {
  key: "genderapi_io-email-to-gender",
  name: "Email to Gender",
  description: "Send an Email to Gender request to GenderAPI. [See the documentation](https://www.genderapi.io/api-documentation#single-email)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
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
    const response = await this.app.emailToGender({
      $,
      params: {
        email: this.email,
        country: this.country,
      },
    });

    $.export("$summary", `Successfully sent the request. Result: '${response.gender}'`);

    return response;
  },
};

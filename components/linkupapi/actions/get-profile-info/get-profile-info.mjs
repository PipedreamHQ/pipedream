import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-get-profile-info",
  name: "Get Profile Info",
  description: "Extract information from a LinkedIn profile. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/Profile/profile-info)",
  version: "0.0.1",
  props: {
    app,
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
    },
    loginToken: {
      propDefinition: [
        app,
        "loginToken",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const {
      app,
      linkedinUrl,
      loginToken,
      country,
    } = this;

    const response = await app.getProfileInfo({
      $,
      data: {
        linkedin_url: linkedinUrl,
        login_token: loginToken,
        country,
      },
    });

    $.export("$summary", "Successfully retrieved profile information");

    return response;
  },
};

import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  key: "survey_monkey-get-my-info",
  name: "Get My Info",
  description:
    "Retrieve your account details. [See the docs here](https://api.surveymonkey.net/v3/docs?javascript#api-endpoints-get-users-me)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    surveyMonkey,
  },
  async run({ $ }) {
    const response = await this.surveyMonkey.getUserInfo({
      $,
    });

    $.export("$summary", "Successfully fetched user info");
    return response;
  },
};

import enrichlayer from "../../enrichlayer.app.mjs";

export default {
  key: "enrichlayer-get-person-profile-picture",
  name: "Get Person Profile Picture",
  description: "Get the profile picture of a person from cached profiles. Cost: 0 credits. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    personProfileUrl: {
      type: "string",
      label: "Person Profile URL",
      description: "The professional network URL of the person whose profile picture you want to retrieve (e.g., `https://www.linkedin.com/in/williamhgates/`).",
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/person/profile-picture",
      params: {
        person_profile_url: this.personProfileUrl,
      },
    });
    $.export("$summary", "Successfully retrieved person profile picture");
    return response;
  },
};

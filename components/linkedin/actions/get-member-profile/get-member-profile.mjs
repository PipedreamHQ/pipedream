import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-member-profile",
  name: "Get Member Profile",
  description: "Gets another member's profile, given its person id. [See the docs here](https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api#retrieve-other-members-profile)",
  version: "0.1.9",
  type: "action",
  props: {
    linkedin,
    personId: {
      type: "string",
      label: "Person Id",
      description: "Identifier of the person to retrieve",
    },
  },
  async run({ $ }) {
    const response = await this.linkedin.getMemberProfile(this.personId, {
      $,
    });

    $.export("$summary", "Successfully retrieved member profile");

    return response;
  },
};

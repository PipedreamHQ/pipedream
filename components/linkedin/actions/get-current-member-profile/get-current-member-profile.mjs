import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-get-current-member-profile",
  name: "Get Current Member Profile",
  description: "Gets the profile of the current authenticated member. [See the docs here](https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api#retrieve-current-members-profile)",
  version: "0.1.2",
  type: "action",
  props: {
    linkedin,
  },
  async run({ $ }) {
    const response = await this.linkedin.getCurrentMemberProfile({
      $,
    });

    $.export("$summary", "Successfully retrieved current member profile");

    return response;
  },
};

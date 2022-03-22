// legacy_hash_id: a_52idjW
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-get-current-member-profile",
  name: "Get Current Member Profile",
  description: "Gets the profile of the current authenticated member.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api#retrieve-current-members-profile

    return await axios($, {
      url: "https://api.linkedin.com/v2/me",
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
    });
  },
};

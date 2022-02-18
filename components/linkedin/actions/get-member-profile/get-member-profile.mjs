// legacy_hash_id: a_m8iKzp
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-get-member-profile",
  name: "Get Member Profile",
  description: "Gets another member's profile, given its person id.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    person_id: {
      type: "string",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api#retrieve-other-members-profile

    if (!this.person_id) {
      throw new Error("Must provide person_id parameter.");
    }

    return await axios($, {
      url: `https://api.linkedin.com/v2/people/(id:${this.person_id})`,
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
    });
  },
};

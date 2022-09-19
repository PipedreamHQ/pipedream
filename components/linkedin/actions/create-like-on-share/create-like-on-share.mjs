// legacy_hash_id: a_Vpi76d
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-create-like-on-share",
  name: "Create Like On Share",
  description: "Creates a like on a share.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    parent_urn: {
      type: "string",
      description: "The top-level share urn or user generated content where the like will be performed.",
    },
    actor: {
      type: "string",
      description: "Entity which performing the like. Must be a person or an organization URN.",
    },
    object: {
      type: "string",
      description: "Use the `object` field in the request body to specify the URN of the entity to which the like belongs. This object should be a sub-entity of the top-level share indicated in the request URL",
    },
  },
  async run({ $ }) {
  // See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#create-a-like-on-a-share

    if (!this.parent_urn || !this.actor || !this.object) {
      throw new Error("Must provide parent_urn, actor, and object parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://api.linkedin.com/v2/socialActions/${this.parent_urn}/likes`,
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
      data: {
        actor: this.actor,
        object: this.object,
      },
    });
  },
};

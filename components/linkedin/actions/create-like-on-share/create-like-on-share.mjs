import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-create-like-on-share",
  name: "Create Like On Share",
  description: "Creates a like on a share. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#create-a-like-on-a-share)",
  version: "0.1.9",
  type: "action",
  props: {
    linkedin,
    parentUrn: {
      type: "string",
      label: "Parent Urn",
      description: "The top-level share urn or user generated content where the like will be performed.",
    },
    actor: {
      type: "string",
      label: "Actor",
      description: "Entity performing the like. Must be a person or an organization URN.",
    },
    object: {
      type: "string",
      label: "Object",
      description: "Use the `object` field in the request body to specify the URN of the entity to which the like belongs. This object should be a sub-entity of the top-level share indicated in the request URL",
    },
  },
  async run({ $ }) {
    const data = {
      actor: this.actor,
      object: this.object,
    };

    const response = await this.linkedin.createLikeOnShare(encodeURIComponent(this.parentUrn), {
      $,
      data,
    });

    $.export("$summary", "Successfully created like on share");

    return response;
  },
};

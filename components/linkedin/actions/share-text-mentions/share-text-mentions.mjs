import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-share-text-mentions",
  name: "Share Text And Mentions",
  description: "Shares a posts with text and mentions only. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-text-and-mentions)",
  version: "0.3.2",
  type: "action",
  props: {
    linkedin,
    organizationId: {
      propDefinition: [
        linkedin,
        "organizationId",
      ],
      optional: true,
    },
    shareText: {
      type: "string",
      label: "Share Text",
      description: "Text of the share.",
    },
    annotations: {
      type: "any",
      label: "Annotations",
      description: "Annotations of the shared text, which are mentions or tags of other Linkedin entities such as organizations or members, see the full schema in [Share Text and Mentions](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/posts-api?view=li-lms-2022-11&tabs=http#mentions-and-hashtags-using-posts-commentary)",
      optional: true,
    },
    visibility: {
      propDefinition: [
        linkedin,
        "visibility",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      author: this.organizationId,
      commentary: `${this.shareText}${this.annotations}`,
      visibility: this.visibility,
    };

    const response = await this.linkedin.createPost({
      $,
      data,
    });

    $.export("$summary", "Successfully shared post");

    return response;
  },
};

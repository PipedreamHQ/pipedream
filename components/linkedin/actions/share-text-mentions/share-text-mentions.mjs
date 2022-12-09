import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-share-text-mentions",
  name: "Share Text And Mentions",
  description: "Shares a posts with text and mentions only. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-text-and-mentions)",
  version: "0.3.2",
  type: "action",
  props: {
    linkedin,
    shareOwner: {
      type: "string",
      label: "Share Owner",
      description: "Owner of the share, in URN format.",
    },
    shareText: {
      type: "string",
      label: "Share Text",
      description: "Text of the share.",
    },
    annotations: {
      type: "any",
      label: "Annotations",
      description: "Annotations of the shared text, which are mentions or tags of other Linkedin entities such as organizations or members, see the full schema in [Share Text and Mentions](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api#share-text-and-mentions)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      text: {
        text: this.shareText,
        annotations: this.annotations,
      },
      distribution: {
        "linkedInDistributionTarget": {},
      },
      owner: this.shareOwner,
    };

    const response = await this.linkedin.createShare({
      $,
      data,
    });

    $.export("$summary", "Successfully shared post");

    return response;
  },
};

import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-retrieve-comments-on-comments",
  name: "Retrieves Comments on Comments",
  description: "Retrieves comments on comments, given the parent comment urn. [See the documentation](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#retrieve-comments-on-comments)",
  version: "0.1.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    linkedin,
    commentUrn: {
      type: "string",
      label: "Comment Urn",
      description: "To resolve nested comments for a given parent comment, provide a parent `commentUrn` as the target in the request URL. A `commentUrn` is a composite URN constructed using a comment ID and `activityUrn`.",
    },
    max: {
      propDefinition: [
        linkedin,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const count = 50;
    const results = [];

    const params = {
      start: 0,
      count,
    };

    let done = false;
    do {
      const { elements } = await this.linkedin.getComments(encodeURIComponent(this.commentUrn), {
        $,
        params,
      });
      results.push(...elements);
      params.start += count;
      if (elements?.length < count) {
        done = true;
      }
    } while (results.length < this.max && !done);

    $.export("$summary", `Successfully retrieved ${results.length} comment(s)`);

    return results;
  },
};

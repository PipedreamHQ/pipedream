import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-retrieve-comments-on-comments",
  name: "Retrieves comments on comments",
  description: "Retrieves comments on comments, given the parent comment urn. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#retrieve-comments-on-comments)",
  version: "0.1.2",
  type: "action",
  props: {
    linkedin,
    commentUrn: {
      type: "string",
      label: "Comment Urn",
      description: "To resolve nested comments for a given parent comment, provide a parent `commentUrn` as the target in the request URL. A `commentUrn` is a composite URN constructed using a comment ID and `activityUrn`.",
    },
    start: {
      type: "integer",
      label: "Start",
      description: "The index of the first item you want results for.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "The number of items you want included on each page of results. Note that there may be less remaining items than the value you specify here.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      start: this.start,
      count: this.count,
    };

    const response = await this.linkedin.getComments(this.commentUrn, {
      $,
      params,
    });

    $.export("$summary", "Successfully retrieved comments");

    return response;
  },
};

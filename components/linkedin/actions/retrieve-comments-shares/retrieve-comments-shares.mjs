import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-retrieve-comments-shares",
  name: "Retrieve Comments On Shares",
  description: "Retrieve comments on shares given the share urn. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#retrieve-comments-on-shares)",
  version: "0.1.2",
  type: "action",
  props: {
    linkedin,
    entityUrn: {
      type: "string",
      label: "Entity Urn",
      description: "Urn of the entity to retreive likes on.",
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

    const response = await this.linkedin.getComments(this.entityUrn, {
      $,
      params,
    });

    $.export("$summary", "Successfully retrieved comments");

    return response;
  },
};

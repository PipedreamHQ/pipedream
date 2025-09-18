import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-retrieve-comments-shares",
  name: "Retrieve Comments On Shares",
  description: "Retrieve comments on shares given the share urn. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#retrieve-comments-on-shares)",
  version: "0.1.9",
  type: "action",
  props: {
    linkedin,
    entityUrn: {
      type: "string",
      label: "Entity Urn",
      description: "Urn of the entity to retreive comments on.",
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
      const { elements } = await this.linkedin.getComments(encodeURIComponent(this.entityUrn), {
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

import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-create-image-post-organization",
  name: "Create Image Post (Organization)",
  description: "Create an image post on LinkedIn. [See the docs here](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/images-api?view=li-lms-2023-09&tabs=http#uploading-an-image)",
  version: "0.0.1",
  type: "action",
  props: {
    linkedin,
    organizationId: {
      propDefinition: [
        linkedin,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const data = {};

    const response = await this.linkedin.createPost({
      $,
      data,
    });

    $.export("$summary", "Successfully posted image.");

    return response;
  },
};

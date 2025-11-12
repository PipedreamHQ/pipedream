import app from "../../clockwork_recruiting.app.mjs";

export default {
  key: "clockwork_recruiting-add-person-linkedin",
  name: "Add Linkedin URL",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a linkedin URL to a specific person. [See the documentation](https://app.swaggerhub.com/apis-docs/clockwork-recruiting/cw-public-api/3.0.0#/Person%20Linkedin/post_people__person_id__linkedin_urls)",
  type: "action",
  props: {
    app,
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
    },
    linkedinUrl: {
      type: "string",
      label: "Linkedin URL",
      description: "The url of the person's linkedin.",
    },
  },
  async run({ $ }) {
    const response = await this.app.createLinkedinUrl({
      $,
      personId: this.personId,
      data: {
        linkedin_url: {
          url: this.linkedinUrl,
        },
      },
    });

    $.export("$summary", `Successfully created new linkedin URL with ID ${response.personLinkedinUrl?.id}`);
    return response;
  },
};

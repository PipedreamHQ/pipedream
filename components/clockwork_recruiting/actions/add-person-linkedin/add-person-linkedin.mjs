import app from "../../clockwork_recruiting.app.mjs";

export default {
  key: "clockwork_recruiting-add-person-linkedin",
  name: "Add Linkedin URL",
  version: "0.0.1",
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
    const {
      app,
      personId,
      linkedinUrl,
    } = this;

    const response = await app.createLinkedinUrl({
      $,
      personId,
      data: {
        linkedin_url: {
          url: linkedinUrl,
        },
      },
    });

    $.export("$summary", `A new linkedin URL with Id: ${response.personLinkedinUrl?.id} was successfully created!`);
    return response;
  },
};

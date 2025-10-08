import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "prodpad-update-contact",
  name: "Update Contact",
  description: "Updates a contact. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/PutContact).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    name: {
      description: "The name of the contact",
      optional: true,
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      description: "The email of the contact",
      optional: true,
      propDefinition: [
        app,
        "email",
      ],
    },
    about: {
      type: "string",
      label: "About",
      description: "About the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
      optional: true,
    },
    twitterUrl: {
      type: "string",
      label: "Twitter URL",
      description: "The twitter URL of the contact",
      optional: true,
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "The tags to associate with the contact.",
      optional: true,
      propDefinition: [
        app,
        "tagId",
      ],
    },
    personaIds: {
      type: "string[]",
      label: "Persona IDs",
      description: "The persona IDs to associate with the contact.",
      optional: true,
      propDefinition: [
        app,
        "personaId",
      ],
    },
    company: {
      optional: true,
      propDefinition: [
        app,
        "companyId",
      ],
    },
    jobrole: {
      optional: true,
      propDefinition: [
        app,
        "jobroleId",
      ],
    },
  },
  methods: {
    updateContact({
      contactId, ...args
    } = {}) {
      return this.app.update({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      contactId,
      name,
      email,
      about,
      phone,
      twitterUrl,
      tagIds,
      personaIds,
      company,
      jobrole,
    } = this;

    const response = await this.updateContact({
      contactId,
      data: {
        name,
        email,
        about,
        phone,
        twitter_url: twitterUrl,
        tags: utils.mapOrParse(tagIds, (id) => ({
          id,
        })),
        personas: utils.mapOrParse(personaIds, (id) => ({
          id,
        })),
        company,
        job_role: jobrole,
      },
    });

    step.export("$summary", `Successfully updated contact with ID ${response.id}`);

    return response;
  },
};

import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "prodpad-find-contact",
  name: "Find Contact",
  description: "Finds a contact. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/PostContacts).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    name: {
      description: "Name of contact or partial name of contacts to filter the list by",
      optional: true,
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      description: "Filter the contacts by an email.",
      optional: true,
      propDefinition: [
        app,
        "email",
      ],
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "ID of one or more tags to filter the contacts by.",
      optional: true,
      propDefinition: [
        app,
        "tagId",
      ],
    },
    persona: {
      label: "Persona ID",
      description: "ID of a persona to filter contacts by.",
      optional: true,
      propDefinition: [
        app,
        "personaId",
      ],
    },
    company: {
      description: "UUID of a company to filter contacts by.",
      optional: true,
      propDefinition: [
        app,
        "companyId",
      ],
    },
    jobrole: {
      description: "UUID of a job role to filter contacts by.",
      optional: true,
      propDefinition: [
        app,
        "jobroleId",
      ],
    },
  },
  async run({ $: step }) {
    const {
      name,
      email,
      tagIds,
      persona,
      company,
      jobrole,
    } = this;

    const { contacts } = await this.app.listContacts({
      step,
      params: {
        name,
        email,
        tags: utils.mapOrParse(tagIds).join(","),
        persona,
        company,
        job_role: jobrole,
      },
    });

    step.export("$summary", `Successfully found ${utils.summaryEnd(contacts.length, "contact")}`);

    return contacts;
  },
};

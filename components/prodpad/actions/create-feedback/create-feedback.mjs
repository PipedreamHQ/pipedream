import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "prodpad-create-feedback",
  name: "Create Feedback",
  description: "Creates feedback. [See the documentation](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/PostFeedbacks).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    feedback: {
      propDefinition: [
        app,
        "feedback",
      ],
    },
    contactId: {
      description: "The ID of the contact providing the feedback. Either `Contact ID` or `Contact Name` is required.",
      optional: true,
      propDefinition: [
        app,
        "contactId",
      ],
    },
    contactName: {
      label: "Contact Name",
      description: "The name of the contact. Either `Contact ID` or `Contact Name` is required.",
      optional: true,
      propDefinition: [
        app,
        "name",
      ],
    },
    contactEmail: {
      description: "The email of the contact. It is also used to avoid duplication of contacts and can only be filled in with `Contact Name`.",
      optional: true,
      propDefinition: [
        app,
        "email",
      ],
    },
    company: {
      label: "Company",
      description: "The ID of the company to link the contact to. It can only be filled in with `Contact Name`.",
      optional: true,
      propDefinition: [
        app,
        "companyId",
      ],
    },
    tagIds: {
      type: "string[]",
      label: "Tag IDs",
      description: "Tag IDs to link to the feedback.",
      optional: true,
      propDefinition: [
        app,
        "tagId",
      ],
    },
    personaIds: {
      type: "string[]",
      label: "Persona IDs",
      description: "Persona IDs to link to the feedback.",
      optional: true,
      propDefinition: [
        app,
        "personaId",
      ],
    },
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "Product IDs to link to the feedback.",
      optional: true,
      propDefinition: [
        app,
        "productId",
      ],
    },
  },
  async run({ $: step }) {
    const {
      contactId,
      feedback,
      tagIds,
      personaIds,
      productIds,
      company,
      contactName,
      contactEmail,
    } = this;

    if ((!contactId && !contactName) || (contactId && contactName)) {
      throw new ConfigurationError("Either `Contact ID` or `Contact Name` is required.");
    }

    if (!contactName) {
      if (contactEmail) {
        throw new ConfigurationError("`Contact Email` can only be provided when using `Contact Name`.");
      }
      if (company) {
        throw new ConfigurationError("`Company` can only be provided when using `Contact Name`.");
      }
    }

    const response = await this.app.createFeedback({
      step,
      data: {
        contact_id: contactId,
        company_id: company,
        name: contactName,
        email: contactEmail,
        feedback,
        tags: utils.mapOrParse(tagIds, (id) => ({
          id,
        })),
        personas: utils.mapOrParse(personaIds, (id) => ({
          id,
        })),
        products: utils.mapOrParse(productIds, (id) => ({
          id,
        })),
      },
    });

    step.export("$summary", `Successfully created feedback with ID ${response.id}.`);
    return response;
  },
};

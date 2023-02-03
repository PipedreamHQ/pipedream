import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "prodpad-create-feedback",
  name: "Create Feedback",
  description: "Creates a feedback. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/PostFeedbacks).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    contactId: {
      description: "ID of the contact providing the feedback.",
      propDefinition: [
        app,
        "contactId",
      ],
    },
    feedback: {
      propDefinition: [
        app,
        "feedback",
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
    } = this;

    const response = await this.app.createFeedback({
      step,
      data: {
        contact_id: contactId,
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

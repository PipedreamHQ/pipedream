import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "prodpad-find-or-create-feedback",
  name: "Find or Create Feedback",
  description: "Finds or creates a feedback. See the docs for [find feedback](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/GetFeedbacks) and [create feedback](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/PostFeedbacks).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    customer: {
      label: "Customer",
      optional: true,
      description: "ID of the contact providing the feedback.",
      propDefinition: [
        app,
        "contactId",
      ],
    },
    company: {
      label: "Company",
      description: "Set to filter the feedback results based on whether the feedback was entered for a contact linked to the company.",
      optional: true,
      propDefinition: [
        app,
        "companyId",
      ],
    },
    product: {
      label: "Product",
      description: "Product IDs to link to the feedback.",
      optional: true,
      propDefinition: [
        app,
        "productId",
      ],
    },
    persona: {
      label: "Persona",
      optional: true,
      propDefinition: [
        app,
        "personaId",
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
    externalId: {
      description: "Filter feedback to return the feedback associated with a specific External ID. An example of an external ID is the ID of a record in a CRM or ID of a ticket in a customer support application.",
      propDefinition: [
        app,
        "externalId",
      ],
    },
    externalUrl: {
      description: "Filter feedback to return the feedback associated with a specific external url. An example of an external url is that of a record in a CRM or a ticket in a customer support application",
      propDefinition: [
        app,
        "externalUrl",
      ],
    },
    feedback: {
      type: "string",
      label: "Feedback",
      description: "In case the feedback is not found, this will be used to create a new feedback. This field accepts HTML and is stored as UTF-8.",
      optional: true,
    },
    name: {
      description: "In case the feedback is not found, this will be used to create a new feedback.",
      optional: true,
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  async run({ $: step }) {
    const {
      customer,
      company,
      product,
      persona,
      tagIds,
      externalId,
      externalUrl,
      feedback,
      name,
    } = this;

    const feedbacks = await this.app.listFeedbacks({
      step,
      params: {
        customer,
        company,
        product,
        persona,
        tags: utils.mapOrParse(tagIds).join(","),
        external_id: externalId,
        external_url: externalUrl,
      },
    });

    if (feedbacks.length) {
      step.export("$summary", `Successfully found ${utils.summaryEnd(feedbacks.length, "feedback")}`);
      return feedbacks;
    }

    const response = await this.app.createFeedback({
      step,
      data: {
        name,
        feedback,
        contact_id: customer,
        company_id: company,
        products: product && [
          {
            id: product,
          },
        ],
        personas: persona && [
          {
            id: persona,
          },
        ],
        tags: utils.mapOrParse(tagIds, (id) => ({
          id,
        })),
        external_links: (externalId || externalUrl) && [
          {
            external_id: externalId,
            url: externalUrl,
          },
        ],
      },
    });

    step.export("$summary", `Successfully created feedback with ID ${response.id}.`);
    return response;
  },
};

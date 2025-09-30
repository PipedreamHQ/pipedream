import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "prodpad-create-idea",
  name: "Create Idea",
  description: "Creates an idea. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Ideas/PostIdeas).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the idea. Either the title or description is required.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the idea. This field accepts HTML and is stored as UTF-8.",
      optional: true,
    },
    businessCaseProblem: {
      type: "string",
      label: "Business Case Problem",
      description: "The problem or hypothesis this idea is aiming to address. This field accepts HTML and is stored as UTF-8.",
      optional: true,
    },
    businessCaseValue: {
      type: "string",
      label: "Business Case Value",
      description: "The value of solving this problem or hypothesis to the user and the company. This field accepts HTML and is stored as UTF-8.",
      optional: true,
    },
    functional: {
      type: "string",
      label: "Functional Specs",
      description: "The functional specs of how this idea could be implemented. This field accepts HTML and is stored as UTF-8.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Free text field for notes on the idea. This field accepts HTML and is stored as UTF-8.",
      optional: true,
    },
    productIds: {
      type: "string[]",
      label: "Products",
      description: "The products to associate with the idea.",
      optional: true,
      propDefinition: [
        app,
        "productId",
      ],
    },
    personaIds: {
      type: "string[]",
      label: "Personas",
      description: "The persona IDs to associate with the persona.",
      optional: true,
      propDefinition: [
        app,
        "personaId",
      ],
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "The tags to associate with the persona.",
      optional: true,
      propDefinition: [
        app,
        "tagId",
      ],
    },
    statusId: {
      optional: true,
      propDefinition: [
        app,
        "statusId",
      ],
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the idea.",
      optional: true,
      options: [
        "active",
        "active_public",
        "archived",
        "unsorted",
      ],
    },
  },
  methods: {
    createIdea(args = {}) {
      return this.app.create({
        path: "/ideas",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      title,
      description,
      businessCaseProblem,
      businessCaseValue,
      functional,
      notes,
      productIds,
      personaIds,
      tagIds,
      statusId,
      state,
    } = this;

    const response = await this.createIdea({
      step,
      data: {
        title,
        description,
        business_case: {
          problem: businessCaseProblem,
          value: businessCaseValue,
        },
        functional,
        notes,
        tags: utils.mapOrParse(tagIds, (id) => ({
          id,
        })),
        personas: utils.mapOrParse(personaIds, (id) => ({
          id,
        })),
        products: utils.mapOrParse(productIds, (id) => ({
          id,
        })),
        status: {
          id: statusId,
        },
        state,
      },
    });

    step.export("$summary", `Successfully created idea with ID ${response.id}.`);

    return response;
  },
};

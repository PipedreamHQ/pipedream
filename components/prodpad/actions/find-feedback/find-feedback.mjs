import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "prodpad-find-feedback",
  name: "Find Feedback",
  description: "Finds a feedback. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/GetFeedbacks).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    state: {
      type: "string",
      label: "State",
      description: "The state of the feedback. Default is `active`.",
      optional: true,
      options: [
        "active",
        "unsorted",
        "archived",
        "all",
      ],
    },
    company: {
      description: "Set to filter the feedback results based on whether the feedback was entered for a contact linked to the company.",
      optional: true,
      propDefinition: [
        app,
        "companyId",
      ],
    },
    country: {
      label: "Company Country",
      description: "Set to filter the feedback results based on whether the feedback was entered for a contact linked to the company. Use ISO Alpha-2 country codes.",
      propDefinition: [
        app,
        "country",
      ],
    },
    companySize: {
      label: "Company Size",
      description: "Set to filter the feedback results based on the size of the company for the associated company.",
      propDefinition: [
        app,
        "companySize",
      ],
    },
    companyValue: {
      label: "Company Value",
      description: "Set to filter the feedback results based on the value of the company for the company assocaited to the feedback.",
      propDefinition: [
        app,
        "companyValue",
      ],
    },
    persona: {
      description: "Filter results by the persona associated to feedback. Can either be the persona UUID or persona ID.",
      optional: true,
      propDefinition: [
        app,
        "personaId",
      ],
    },
    jobrole: {
      description: "Filter results by the job role of the contact associated to the feedback. Use the JobRole UUID.",
      optional: true,
      propDefinition: [
        app,
        "jobroleId",
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
    product: {
      description: "Filter results by the product associated to feedback. Can either be the product UUID or product ID.",
      optional: true,
      propDefinition: [
        app,
        "productId",
      ],
    },
  },
  async run({ $: step }) {
    const {
      state,
      company,
      country,
      companySize,
      companyValue,
      persona,
      jobrole,
      tagIds,
      product,
    } = this;

    const feedbacks = await this.app.listFeedbacks({
      step,
      params: {
        state,
        company,
        company_country: country,
        company_size: companySize,
        company_value: companyValue,
        persona,
        job_role: jobrole,
        tags: utils.mapOrParse(tagIds).join(","),
        product,
      },
    });

    step.export("$summary", `Successfully found ${utils.summaryEnd(feedbacks.length, "feedback")}`);

    return feedbacks;
  },
};

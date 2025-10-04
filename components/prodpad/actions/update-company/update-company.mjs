import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "prodpad-update-company",
  name: "Update Company",
  description: "Updates a company. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/PutCompany).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    name: {
      optional: true,
      propDefinition: [
        app,
        "name",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    size: {
      label: "Company Size",
      propDefinition: [
        app,
        "companySize",
      ],
    },
    value: {
      label: "Company Value",
      propDefinition: [
        app,
        "companyValue",
      ],
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "The tags to associate with the company.",
      optional: true,
      propDefinition: [
        app,
        "tagId",
      ],
    },
  },
  methods: {
    updateCompany({
      companyId, ...args
    } = {}) {
      return this.app.update({
        path: `/companies/${companyId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      companyId,
      name,
      city,
      country,
      size,
      value,
      tagIds,
    } = this;

    const response = await this.updateCompany({
      companyId,
      data: {
        name,
        city,
        country,
        size,
        value,
        tags: utils.mapOrParse(tagIds, (id) => ({
          id,
        })),
      },
    });

    step.export("$summary", `Successfully updated company with ID ${response.id}`);

    return response;
  },
};

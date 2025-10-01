import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Create Company",
  key: "pipeline-create-company",
  description: "Creates a new company in your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/Companies/paths/~1companies/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipeline,
    ownerId: {
      propDefinition: [
        pipeline,
        "userId",
      ],
    },
    name: {
      propDefinition: [
        pipeline,
        "name",
      ],
      description: "The name of the company",
    },
    email: {
      propDefinition: [
        pipeline,
        "email",
      ],
      description: "The email address the company",
    },
    website: {
      propDefinition: [
        pipeline,
        "website",
      ],
    },
    address1: {
      propDefinition: [
        pipeline,
        "address1",
      ],
    },
    address2: {
      propDefinition: [
        pipeline,
        "address2",
      ],
    },
    city: {
      propDefinition: [
        pipeline,
        "city",
      ],
    },
    state: {
      propDefinition: [
        pipeline,
        "state",
      ],
    },
    postalCode: {
      propDefinition: [
        pipeline,
        "postalCode",
      ],
    },
    country: {
      propDefinition: [
        pipeline,
        "country",
      ],
    },
    phone: {
      propDefinition: [
        pipeline,
        "phone",
      ],
      description: "Primary business number",
    },
  },
  async run({ $ }) {
    const data = {
      company: {
        owner_id: this.ownerId,
        name: this.name,
        email: this.email,
        web: this.website,
        address_1: this.address1,
        address_2: this.address2,
        city: this.city,
        state: this.state,
        postal_code: this.postalCode,
        country: this.country,
        phone1: this.phone,
      },
    };

    const response = await this.pipeline.createCompany({
      data,
      $,
    });

    $.export("$summary", `Successfully created Company with ID ${response.id}.`);

    return response;
  },
};

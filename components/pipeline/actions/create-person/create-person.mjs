import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Create Person",
  key: "pipeline-create-person",
  description: "Creates a new person in your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/People/paths/~1people/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipeline,
    firstName: {
      propDefinition: [
        pipeline,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        pipeline,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        pipeline,
        "email",
      ],
      description: "Person's primary email address",
    },
    phone: {
      propDefinition: [
        pipeline,
        "phone",
      ],
      description: "Person's primary phone number",
    },
    userId: {
      propDefinition: [
        pipeline,
        "userId",
      ],
      description: "The ID of the user who owns this person record",
    },
    companyId: {
      propDefinition: [
        pipeline,
        "companyId",
      ],
    },
    dealId: {
      propDefinition: [
        pipeline,
        "dealId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      person: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phone,
        user_id: this.userId,
        company_id: this.companyId,
        deal_id: this.dealId,
      },
    };

    const response = await this.pipeline.createPerson({
      data,
      $,
    });

    $.export("$summary", `Successfully created Person with ID ${response.id}.`);

    return response;
  },
};

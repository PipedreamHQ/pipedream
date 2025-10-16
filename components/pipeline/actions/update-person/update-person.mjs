import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Update Person",
  key: "pipeline-update-person",
  description: "Updates a person in your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/People/paths/~1people~1{id}/put)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipeline,
    personId: {
      propDefinition: [
        pipeline,
        "personId",
      ],
      optional: false,
    },
    firstName: {
      propDefinition: [
        pipeline,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        pipeline,
        "lastName",
      ],
      optional: true,
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

    const response = await this.pipeline.updatePerson(this.personId, {
      data,
      $,
    });

    $.export("$summary", `Successfully updated Person with ID ${response.id}.`);

    return response;
  },
};

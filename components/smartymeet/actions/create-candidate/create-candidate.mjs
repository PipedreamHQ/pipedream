import smartymeet from "../../smartymeet.app.mjs";

export default {
  key: "smartymeet-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate profile in SmartyMeet. [See the documentation](https://docs.smartymeet.com/category/smartymeet-versioned-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    smartymeet,
    name: {
      type: "string",
      label: "Name",
      description: "The candidate's name.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The candidate's status.",
      options: [
        "active",
        "rejected",
        "archived",
        "closed",
      ],
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The candidate's phone.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The candidate's email.",
      optional: true,
    },
    /* talentId: {
      propDefinition: [
        smartymeet,
        "talentId",
      ],
    }, */
    jobId: {
      propDefinition: [
        smartymeet,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smartymeet.createCandidate({
      $,
      data: {
        type: "candidates",
        attributes: {
          name: this.name,
          status: this.status,
          phone: this.phone,
          email: this.email,
        },
        relationships: {
          /* talents: {
            type: "talents",
            id: this.talentId,
          }, */
          jobs: {
            type: "jobs",
            id: this.jobId,
          },
        },
      },
    });

    $.export("$summary", `Successfully created candidate with Id: ${response.data.id}`);
    return response;
  },
};

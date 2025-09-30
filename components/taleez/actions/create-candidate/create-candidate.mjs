import taleez from "../../taleez.app.mjs";

export default {
  key: "taleez-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate in Taleez. [See the documentation](https://api.taleez.com/swagger-ui/index.html#/candidates/create_1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    taleez,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the candidate",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the candidate",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Candidate email address. Must be unique in your company",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Candidate phone (formats : 0611223344, +33611223344, 00336112233). Ignored if not valid.",
      optional: true,
    },
    unitId: {
      propDefinition: [
        taleez,
        "unitId",
      ],
    },
    recruiterId: {
      propDefinition: [
        taleez,
        "recruiterId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.taleez.createCandidate({
      $,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        mail: this.email,
        phone: this.phone,
        unitId: this.unitId,
        recruiterId: this.recruiterId,
      },
    });
    $.export("$summary", `Created candidate ${this.firstName} ${this.lastName} successfully`);
    return response;
  },
};

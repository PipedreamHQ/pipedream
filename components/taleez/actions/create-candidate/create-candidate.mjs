import taleez from "../../taleez.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "taleez-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate in Taleez. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    taleez,
    candidateName: {
      propDefinition: [
        taleez,
        "candidateName",
      ],
    },
    email: {
      propDefinition: [
        taleez,
        "email",
      ],
    },
    jobListingId: {
      propDefinition: [
        taleez,
        "jobListingId",
      ],
    },
    resume: {
      propDefinition: [
        taleez,
        "resume",
      ],
      optional: true,
    },
    coverLetter: {
      propDefinition: [
        taleez,
        "coverLetter",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.taleez.createCandidate();
    $.export("$summary", `Created candidate ${this.candidateName} successfully`);
    return response;
  },
};

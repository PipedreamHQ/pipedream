import breezyHr from "../../breezy_hr.app.mjs";

export default {
  key: "breezy_hr-get-candidate",
  name: "Get Candidate",
  description:
    "Retrieve a candidate by ID for a given position. [See the documentation](https://developer.breezy.hr/reference/company-position-candidate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    breezyHr,
    companyId: {
      propDefinition: [
        breezyHr,
        "companyId",
      ],
    },
    positionId: {
      propDefinition: [
        breezyHr,
        "positionId",
        (c) => ({
          companyId: c.companyId,
        }),
      ],
    },
    candidateId: {
      propDefinition: [
        breezyHr,
        "candidateId",
        (c) => ({
          companyId: c.companyId,
          positionId: c.positionId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const data = await this.breezyHr.getCandidate({
      $,
      companyId: this.companyId,
      positionId: this.positionId,
      candidateId: this.candidateId,
    });
    $.export("$summary", "Candidate retrieved successfully");
    return data;
  },
};

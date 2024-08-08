import easyhire from "../../easyhire.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "easyhire-assess-candidate",
  name: "Assess Candidate",
  description: "Assess a specific candidate on EasyHire. The user needs to input the candidate's id and their evaluation score. An optional prop is comments about the candidate's performance.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    easyhire,
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The ID of the candidate to be assessed",
    },
    evaluationScore: {
      type: "integer",
      label: "Evaluation Score",
      description: "The score of the candidate's evaluation",
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Comments about the candidate's performance",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.easyhire.assessCandidate({
      candidateId: this.candidateId,
      evaluationScore: this.evaluationScore,
      comments: this.comments || "",
    });
    $.export("$summary", `Successfully assessed candidate ${this.candidateId}`);
    return response;
  },
};

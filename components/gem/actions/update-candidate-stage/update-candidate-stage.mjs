import gem from "../../gem.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gem-update-candidate-stage",
  name: "Update Candidate Stage",
  description: "Updates the hiring stage of an existing candidate. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gem,
    candidateId: {
      propDefinition: [
        "gem",
        "candidateId",
      ],
    },
    newStage: {
      propDefinition: [
        "gem",
        "newStage",
      ],
    },
    changeNote: {
      propDefinition: [
        "gem",
        "changeNote",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gem.updateCandidateStage({
      candidateId: this.candidateId,
      newStage: this.newStage,
      changeNote: this.changeNote,
    });
    $.export(
      "$summary",
      `Updated candidate stage for candidate ${this.candidateId} to new stage ${this.newStage}`,
    );
    return response;
  },
};

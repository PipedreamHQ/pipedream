import smartymeet from "../../smartymeet.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "smartymeet-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate profile in SmartyMeet. [See the documentation](https://docs.smartymeet.com/category/smartymeet-versioned-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    smartymeet,
    candidateName: {
      propDefinition: [
        smartymeet,
        "candidateName",
      ],
    },
    candidateContacts: {
      propDefinition: [
        smartymeet,
        "candidateContacts",
      ],
    },
    candidateLinks: {
      propDefinition: [
        smartymeet,
        "candidateLinks",
      ],
      optional: true,
    },
    candidateResume: {
      propDefinition: [
        smartymeet,
        "candidateResume",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.smartymeet.createNewCandidateProfile({
      candidateName: this.candidateName,
      candidateContacts: this.candidateContacts,
      candidateLinks: this.candidateLinks,
      candidateResume: this.candidateResume,
    });

    $.export("$summary", `Successfully created candidate profile for ${this.candidateName}`);
    return response;
  },
};

import greenhouse from "../../greenhouse.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "greenhouse-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate entry in Greenhouse. [See the documentation](https://developers.greenhouse.io/harvest.html#post-add-candidate)",
  version: "0.0.1",
  type: "action",
  props: {
    greenhouse,
    candidateName: greenhouse.propDefinitions.candidateName,
    email: greenhouse.propDefinitions.email,
    contact: greenhouse.propDefinitions.contact,
    candidateAddress: greenhouse.propDefinitions.candidateAddress,
    summary: greenhouse.propDefinitions.summary,
    skills: greenhouse.propDefinitions.skills,
  },
  async run({ $ }) {
    const response = await this.greenhouse.createCandidate({
      candidateName: this.candidateName,
      email: this.email,
      contact: this.contact,
      candidateAddress: this.candidateAddress,
      summary: this.summary,
      skills: this.skills
        ? this.skills.map((skill) => skill.trim())
        : [],
    });
    $.export("$summary", `Successfully created candidate with ID ${response.id}`);
    return response;
  },
};

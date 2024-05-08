import greenhouse from "../../greenhouse.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "greenhouse-create-prospect",
  name: "Create Prospect",
  description: "Creates a new prospect entry. Required props are prospect's name, email, and contact. Optional props are prospect's address, qualifications, skills, etc. [See the documentation](https://developers.greenhouse.io/harvest.html#post-add-prospect)",
  version: "0.0.1",
  type: "action",
  props: {
    greenhouse,
    candidateName: greenhouse.propDefinitions.candidateName,
    email: greenhouse.propDefinitions.email,
    contact: greenhouse.propDefinitions.contact,
    candidateAddress: greenhouse.propDefinitions.candidateAddress,
    qualifications: greenhouse.propDefinitions.qualifications,
    skills: {
      ...greenhouse.propDefinitions.skills,
      type: "string", // Adjusting to accept a comma-separated list and converting it to an array in the run method
    },
  },
  async run({ $ }) {
    const skillsArray = this.skills
      ? this.skills.split(",").map((skill) => skill.trim())
      : [];
    const response = await this.greenhouse.createProspect({
      candidateName: this.candidateName,
      email: this.email,
      contact: this.contact,
      candidateAddress: this.candidateAddress,
      qualifications: this.qualifications,
      skills: skillsArray,
    });

    $.export("$summary", `Successfully created prospect ${response.first_name} ${response.last_name}`);
    return response;
  },
};

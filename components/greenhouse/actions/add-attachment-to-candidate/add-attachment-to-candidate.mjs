import greenhouse from "../../greenhouse.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "greenhouse-add-attachment-to-candidate",
  name: "Add Attachment to Candidate",
  description: "Adds an attachment to a specific candidate or prospect. [See the documentation](https://developers.greenhouse.io/harvest.html#post-add-attachment)",
  version: "0.0.1",
  type: "action",
  props: {
    greenhouse,
    candidateId: greenhouse.propDefinitions.candidateId,
    attachmentFile: greenhouse.propDefinitions.attachmentFile,
    attachmentDescription: {
      ...greenhouse.propDefinitions.attachmentDescription,
      optional: true,
    },
    tags: {
      ...greenhouse.propDefinitions.tags,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.greenhouse.addAttachmentToCandidate({
      candidateId: this.candidateId,
      attachmentFile: this.attachmentFile,
      attachmentDescription: this.attachmentDescription,
      tags: this.tags,
    });

    $.export("$summary", `Successfully added attachment to candidate ${this.candidateId}`);
    return response;
  },
};

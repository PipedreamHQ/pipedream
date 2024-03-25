import leiga from "../../leiga.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "leiga-create-issue",
  name: "Create Issue",
  description: "Creates a new issue within Leiga. [See the documentation](https://apidog.com/apidoc/shared-5a741107-c211-410f-880c-048d1917c984/api-3741813)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    leiga,
    projectId: leiga.propDefinitions.projectId,
    issueTitle: leiga.propDefinitions.issueTitle,
    issueDescription: leiga.propDefinitions.issueDescription,
    assignedUserId: leiga.propDefinitions.assignedUserId,
    priorityLevel: leiga.propDefinitions.priorityLevel,
  },
  async run({ $ }) {
    const response = await this.leiga.createIssue({
      projectId: this.projectId,
      issueTitle: this.issueTitle,
      issueDescription: this.issueDescription,
      assignedUserId: this.assignedUserId,
      priorityLevel: this.priorityLevel,
    });
    $.export("$summary", `Successfully created issue ${this.issueTitle}`);
    return response;
  },
};

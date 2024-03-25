import leiga from "../../leiga.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "leiga-new-issue-instant",
  name: "New Issue Instant",
  description: "Emit a new event when there is a new issue in Leiga for the specified project. [See the documentation](https://apidog.com/apidoc/shared-5a741107-c211-410f-880c-048d1917c984/api-3741892)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    leiga: {
      type: "app",
      app: "leiga",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    projectId: {
      propDefinition: [
        leiga,
        "projectId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit the 50 most recent issues for the project as historical data
      const issues = await this.leiga._makeRequest({
        path: `/projects/${this.projectId}/issues`,
        params: {
          per_page: 50,
        },
      });
      issues.forEach((issue) => {
        this.$emit(issue, {
          id: issue.id,
          summary: `New issue: ${issue.title}`,
          ts: new Date(issue.created_at).getTime(),
        });
      });
    },
  },
  async run(event) {
    // Assuming the webhook body contains the issue information
    const body = event.body;
    if (body && body.project_id === this.projectId) {
      this.$emit(body, {
        id: body.id,
        summary: `New issue: ${body.title}`,
        ts: new Date(body.created_at).getTime(),
      });
    } else {
      this.http.respond({
        status: 200,
        body: "Project ID does not match or no issue information provided.",
      });
    }
  },
};

import parsehub from "../../parsehub.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "parsehub-new-run-instant",
  name: "New Run Instant",
  description: "Emit new event when a new run begins on a project. [See the documentation](https://www.parsehub.com/docs/ref/api/v2/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    parsehub,
    projectName: {
      propDefinition: [
        parsehub,
        "projectName",
      ],
    },
    projectId: {
      propDefinition: [
        parsehub,
        "projectId",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const { projectId } = this;
      const { run_token: runToken } = await this.parsehub.runProject({
        projectId,
      });
      const runDetails = await this.parsehub.getRunData({
        runToken,
      });
      this.$emit(runDetails, {
        id: runDetails.run_token,
        summary: `New run started for project: ${this.projectName}`,
        ts: Date.parse(runDetails.start_time),
      });
    },
  },
  async run(event) {
    const {
      projectId, projectName,
    } = this;

    const runResponse = await this.parsehub.runProject({
      projectId,
    });
    const { run_token: runToken } = runResponse;

    // Emit the new run event
    this.$emit(runResponse, {
      id: runToken,
      summary: `New run for project: ${projectName}`,
      ts: +new Date(),
    });
  },
};

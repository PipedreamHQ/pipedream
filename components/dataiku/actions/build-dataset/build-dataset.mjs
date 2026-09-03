// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import dataiku from "../../dataiku.app.mjs";
import { BUILD_TYPES } from "../../common/constants.mjs";

export default {
  key: "dataiku-build-dataset",
  name: "Build Dataset",
  description: "Start a job that builds one or more outputs (typically datasets) in a DSS project. Use this to rebuild specific outputs directly; use **Run Scenario** instead when the pipeline is already orchestrated as a scenario. Use **List Datasets** to find valid output names. A successful call only means the job was accepted — the response's `id` is the job ID, which you pass to **Get Job Status** to follow it to completion. Requires the `RUN_JOBS` privilege on the project. [See the documentation](https://doc.dataiku.com/dss/api/15/rest/#jobs-jobs-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dataiku,
    projectKey: {
      propDefinition: [
        dataiku,
        "projectKey",
      ],
    },
    outputIds: {
      type: "string[]",
      label: "Outputs To Build",
      description: "Names of the outputs to build, e.g. `[\"customers_prepared\"]`. Call **List Datasets** and pass the `name` field of each dataset you want built.",
    },
    buildType: {
      type: "string",
      label: "Build Type",
      description: "How far upstream the build should go. `RECURSIVE_BUILD` also builds upstream dependencies that are out of date, `RECURSIVE_MISSING_ONLY_BUILD` only builds upstream items that do not exist yet, `NON_RECURSIVE_FORCED_BUILD` rebuilds just the requested outputs, and `RECURSIVE_FORCED_BUILD` rebuilds the requested outputs and everything upstream regardless of whether they are up to date.",
      options: BUILD_TYPES,
      optional: true,
    },
    partition: {
      type: "string",
      label: "Partition",
      description: "The partition to build for each requested output, e.g. `2015-07-07`. Omit for non-partitioned datasets.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.outputIds?.length) {
      throw new ConfigurationError("Specify at least one output to build.");
    }

    const response = await this.dataiku.runJob({
      $,
      projectKey: this.projectKey,
      data: {
        outputs: this.outputIds.map((id) => ({
          projectKey: this.projectKey,
          id,
          partition: this.partition,
        })),
        type: this.buildType,
      },
    });
    $.export("$summary", `Started job ${response?.id} in project ${this.projectKey}`);
    return response;
  },
};

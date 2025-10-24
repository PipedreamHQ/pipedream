import { ConfigurationError } from "@pipedream/platform";
import hex from "../../hex.app.mjs";

export default {
  key: "hex-run-project",
  name: "Run Project",
  description: "Trigger a run of the latest published version of a project. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/RunProject)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hex,
    projectId: {
      propDefinition: [
        hex,
        "projectId",
      ],
    },
    inputParams: {
      type: "object",
      label: "Input Parameters",
      description: `Specify input parameters for this project run. These should be structured as a dictionary of key/value pairs, where the key name matches the name of the variable in the Hex project.
      \n\nOnly parameters that are added to the published app can be set via this request parameter. Any additional inputs will be ignored. It is invalid to pass in both a viewId and inputParams.
      \n\nIf no input parameters are provided, the project will be run with the default input values.`,
      optional: true,
    },
    dryRun: {
      type: "boolean",
      label: "Dry Run",
      description: "When true, this endpoint will perform a dry run that does not run the project. This can be useful for validating the structure of an API call, and inspecting a dummy response, without running a project.",
      optional: true,
    },
    notifications: {
      type: "string[]",
      label: "Notifications",
      description: "Specify a list of notification details that will be delivered once a project run completes. Notifications can be configured for delivery to Slack channels, Hex users, or Hex groups. **E.g. `[{\"type\": \"SUCCESS\", \"includeSuccessScreenshot\": \"general\"}]`**. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/RunProject) for more details.",
      optional: true,
    },
    updatePublishedResults: {
      type: "boolean",
      label: "Update Published Results",
      description: "When true, the cached state of the published app will be updated with the latest run results. You must have at least \"Can Edit\" permissions on the project to do so. Note: this cannot be set to true if custom input parameters are provided.",
      optional: true,
    },
    useCachedSqlResults: {
      type: "boolean",
      label: "Use Cached SQL Results",
      description: "When false, the project will run without using any cached SQL results, and will update those cached SQL results.",
      optional: true,
    },
    viewId: {
      type: "string",
      label: "View ID",
      description: "Specify a SavedView viewId to use for the project run. If specified, the saved view's inputs will be used for the project run. It is invalid to pass in both a viewId and inputParams. If not specified, the default inputs will be used.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.hex.runProject({
        $,
        projectId: this.projectId,
        data: {
          inputParams: this.inputParams,
          dryRun: this.dryRun,
          notifications: this.notifications,
          updatePublishedResults: this.updatePublishedResults,
          useCachedSqlResults: this.useCachedSqlResults,
          viewId: this.viewId,
        },
      });

      $.export("$summary", `Successfully triggered project run for project ID: ${this.projectId}`);

      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.reason);
    }
  },
};

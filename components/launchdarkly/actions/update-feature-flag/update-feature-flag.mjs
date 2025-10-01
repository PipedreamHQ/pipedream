import app from "../../launchdarkly.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "launchdarkly-update-feature-flag",
  name: "Update Feature Flag",
  description: "Updates an existing feature flag using a JSON object. [See the documentation](https://apidocs.launchdarkly.com/tag/Feature-flags#operation/patchFeatureFlag)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectKey: {
      propDefinition: [
        app,
        "project",
      ],
    },
    environmentKey: {
      propDefinition: [
        app,
        "environment",
        ({ projectKey }) => ({
          projectKey,
        }),
      ],
    },
    featureFlagKey: {
      propDefinition: [
        app,
        "flag",
        ({
          projectKey, environmentKey,
        }) => ({
          projectKey,
          environmentKey,
        }),
      ],
    },
    patch: {
      type: "string[]",
      label: "Patch",
      description: "An array of JSON patch operations to apply to the feature flag. [See the documentation](https://apidocs.launchdarkly.com/#section/Overview/Updates).",
      default: [
        JSON.stringify({
          op: "replace",
          path: "/description",
          value: "New description for this flag",
        }),
      ],
    },
    ignoreConflicts: {
      type: "boolean",
      label: "Ignore Conflicts",
      description: "If a flag configuration change made through this endpoint would cause a pending scheduled change or approval request to fail, this endpoint will return a 400. You can ignore this check by setting this parameter to `true`.",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A comment to associate with the flag update.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      projectKey,
      featureFlagKey,
      patch,
      ignoreConflicts,
      comment,
    } = this;

    const response = await app.updateFeatureFlag({
      $,
      projectKey,
      featureFlagKey,
      params: {
        ignoreConflicts,
      },
      data: {
        patch: utils.parseArray(patch),
        comment,
      },
    });

    $.export("$summary", "Successfully updated feature flag");
    return response;
  },
};

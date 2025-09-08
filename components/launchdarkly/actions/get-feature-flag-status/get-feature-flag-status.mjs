import app from "../../launchdarkly.app.mjs";

export default {
  key: "launchdarkly-get-feature-flag-status",
  name: "Get Feature Flag Status",
  description: "Get the status of a feature flag. [See the documentation](https://launchdarkly.com/docs/api/feature-flags/get-feature-flag-status).",
  version: "0.0.1",
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
      description: "The key of the feature flag to retrieve the status of",
    },
  },
  async run({ $ }) {
    const status = await this.app.getFeatureFlagStatus({
      $,
      projectKey: this.projectKey,
      environmentKey: this.environmentKey,
      featureFlagKey: this.featureFlagKey,
    });
    $.export("$summary", `Found feature flag status: ${status.name}`);
    return status;
  },
};

import app from "../../launchdarkly.app.mjs";

export default {
  key: "launchdarkly-get-feature-flag",
  name: "Get Feature Flag",
  description: "Get a feature flag by key. [See the documentation](https://launchdarkly.com/docs/api/feature-flags/get-feature-flag).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "The key of the feature flag to retrieve",
    },
  },
  async run({ $ }) {
    const flag = await this.app.getFeatureFlag({
      $,
      projectKey: this.projectKey,
      featureFlagKey: this.featureFlagKey,
    });
    $.export("$summary", `Found feature flag ${flag.key}`);
    return flag;
  },
};

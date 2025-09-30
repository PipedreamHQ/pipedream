import app from "../../launchdarkly.app.mjs";

export default {
  key: "launchdarkly-toggle-feature-flag",
  name: "Toggle Feature Flag",
  description: "Toggles the status of a feature flag, switching it from active to inactive, or vice versa. [See the documentation](https://apidocs.launchdarkly.com/tag/Feature-flags#operation/patchFeatureFlag)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
  },
  async run({ $ }) {
    const {
      app,
      projectKey,
      environmentKey,
      featureFlagKey,
    } = this;

    const { environments: { [environmentKey]: { on: isOn } } } =
      await app.getFeatureFlag({
        $,
        projectKey,
        featureFlagKey,
      });

    const response = await app.updateFeatureFlag({
      $,
      projectKey,
      featureFlagKey,
      headers: {
        "Content-Type": "application/json; domain-model=launchdarkly.semanticpatch",
      },
      data: {
        environmentKey,
        instructions: [
          {
            kind: isOn
              ? "turnFlagOff"
              : "turnFlagOn",
          },
        ],
      },
    });

    $.export("$summary", "Successfully toggled the feature flag.");

    return response;
  },
};

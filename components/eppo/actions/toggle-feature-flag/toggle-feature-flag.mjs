import app from "../../eppo.app.mjs";

export default {
  key: "eppo-toggle-feature-flag",
  name: "Toggle Feature Flag",
  description:
    "Enable or disable a feature flag in a specific environment in Eppo."
    + " Use this when the user wants to turn a flag on or off in Production, Test, or another environment."
    + " Use **List Feature Flags** or **Get Feature Flag** first to find the numeric `flagId` and to discover valid `environmentId` values from the flag's `environments` array."
    + " [See the documentation](https://eppo.cloud/api/docs#/FeatureFlags/updateEnvironmentStatus)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    flagId: {
      propDefinition: [
        app,
        "flagId",
      ],
    },
    environmentId: {
      type: "integer",
      label: "Environment ID",
      description: "The numeric ID of the environment to toggle the flag in (e.g. Production, Test). Use **Get Feature Flag** to find valid environment IDs from the flag's `environments` array.",
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Set to `true` to enable the flag in this environment, `false` to disable it.",
    },
  },
  async run({ $ }) {
    const response = await this.app.updateFlagEnvironmentStatus({
      $,
      flagId: this.flagId,
      environmentId: this.environmentId,
      data: {
        enabled: this.enabled,
      },
    });
    const status = this.enabled
      ? "enabled"
      : "disabled";
    $.export("$summary", `Flag ${this.flagId} ${status} in environment ${this.environmentId}`);
    return response;
  },
};

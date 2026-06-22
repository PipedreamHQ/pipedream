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
    const status = this.enabled
      ? "enabled"
      : "disabled";
    let response;
    try {
      response = await this.app.updateFlagEnvironmentStatus({
        $,
        flagId: this.flagId,
        environmentId: this.environmentId,
        data: {
          enabled: this.enabled,
        },
      });
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? "";
      const alreadyInState = err?.response?.status === 400 && /already (ON|OFF)/i.test(msg);
      if (alreadyInState) {
        $.export("$summary", `Flag ${this.flagId} is already ${status} in environment ${this.environmentId}`);
        return {
          enabled: this.enabled,
          already_in_state: true,
        };
      }
      throw err;
    }
    $.export("$summary", `Flag ${this.flagId} ${status} in environment ${this.environmentId}`);
    return response;
  },
};

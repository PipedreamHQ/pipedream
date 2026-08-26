import app from "../../google_health.app.mjs";

export default {
  key: "google_health-get-identity",
  name: "Get Identity",
  description: "Get the connected user's Google Health identifiers. Returns `healthUserId` (the Google Health ID) and `legacyUserId` (the user's original six-character Fitbit ID, e.g. `A1B2C3`). Use this to correlate records between a system that stored Fitbit IDs and one now using Google Health IDs — the main reason it exists is migrating away from the deprecated Fitbit Web API. It is also the cheapest way to confirm the account connection works, since it needs no data to be present. Example: call with no parameters → returns `{ healthUserId: \"NGL8Q2...\", legacyUserId: \"A1B2C3\" }`. Note that `legacyUserId` is empty for users who never had a Fitbit account. [See the documentation](https://developers.google.com/health/reference/rest/v4/users/getIdentity)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getIdentity({
      $,
    });

    const healthUserId = response?.healthUserId ?? null;
    const legacyUserId = response?.legacyUserId ?? null;

    $.export("$summary", legacyUserId
      ? `Google Health user ${healthUserId} (legacy Fitbit ID ${legacyUserId})`
      : `Google Health user ${healthUserId} (no legacy Fitbit ID)`);

    return {
      healthUserId,
      legacyUserId,
      hasLegacyFitbitAccount: Boolean(legacyUserId),
    };
  },
};

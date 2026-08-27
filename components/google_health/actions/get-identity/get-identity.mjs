// x-pd-ai: optimized
import app from "../../google_health.app.mjs";

export default {
  key: "google_health-get-identity",
  name: "Get Identity",
  description: "Get the connected user's Google Health identifiers: `healthUserId` and `legacyUserId`, the ID the same user had on the legacy Fitbit Web APIs. Use it to correlate records between a system that stored Fitbit IDs and one now on Google Health. Also the cheapest way to confirm the connection works, since it needs no synced data. Example: call with no parameters → returns `{ healthUserId: \"NGL8Q2...\", legacyUserId: \"2E4RVC\" }`. `legacyUserId` is 1-63 characters of letters, numbers and hyphens — treat it as an opaque string and do not assume a fixed length or format. It is empty for users who never had a Fitbit account. [See the documentation](https://developers.google.com/health/reference/rest/v4/users/getIdentity)",
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

import app from "../../whisper.app.mjs";

export default {
  key: "whisper-get-egress-ip",
  name: "Get Egress IP",
  description: "Echo the source IP this request is observed to come from (`GET /egress-ip`). This is keyless and anonymous - no API key or account is required. Fetch it **through** a Whisper egress proxy to prove the traffic really sources from the agent's routable IPv6 `/128`; fetched directly, it simply reports this workflow's own egress address. [See the documentation](https://whisper.online/platform)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getEgressIp({
      $,
    });
    $.export("$summary", `Observed egress IP: ${response.ip}`);
    return response;
  },
};

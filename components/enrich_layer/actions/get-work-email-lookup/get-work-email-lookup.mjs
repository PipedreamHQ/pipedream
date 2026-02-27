import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-work-email-lookup",
  name: "Get Work Email Lookup",
  description: "Look up the work email address of a person from their professional network profile URL. Emails are verified with 95%+ deliverability guarantee. Cost: 3 credits per successful request. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    profileUrl: {
      type: "string",
      label: "Profile URL",
      description: "The professional network profile URL of the person to extract work email from (e.g., `https://sg.linkedin.com/in/williamhgates`).",
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "Webhook URL to notify when the request has finished processing. This endpoint may not return results immediately.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer.getWorkEmailLookup({
      $,
      params: {
        profile_url: this.profileUrl,
        callback_url: this.callbackUrl,
      },
    });
    $.export("$summary", `Successfully looked up work email for ${this.profileUrl}`);
    return response;
  },
};

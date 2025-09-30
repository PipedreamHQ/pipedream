import app from "../../proxycurl.app.mjs";

export default {
  name: "Find Social Media Profiles from Email",
  description: "Find Social Media Profiles from Email. Cost: 3 credit/successful request [See the documentation](https://nubela.co/proxycurl/docs#contact-api).",
  key: "proxycurl-find-social-media-profiles-from-email",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    lookupDepth: {
      type: "boolean",
      label: "Lookup Depth",
      description: "This parameter describes the depth options for our API lookup function. This endpoint can execute either a superficial or a deep lookup. If `deep`, credits are used regardless of whether any results are returned.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email to lookup.",
    },
    enrichProfile: {
      type: "boolean",
      label: "Enrich Profile",
      description: "Enrich the result with a cached LinkedIn profile of the LinkedIn Profile URL result (if any). It costs 1 extra credit per request.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
      lookup_depth: this.lookupDepth
        ? "deep"
        : "superficial",
      enrich_profile: this.enrichProfile
        ? "enrich"
        : "skip",
    };
    const res = await this.app.findSocialMediaProfilesFromEmail(data);
    $.export("summary", `Profile successfully fetched from "${this.email}".`);
    return res;
  },
};

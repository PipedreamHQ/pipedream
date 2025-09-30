import app from "../../proxycurl.app.mjs";

export default {
  name: "Look Up Email from LinkedIn Profile",
  description: "Lookup work email address of a LinkedIn Person Profile. If you provided a webhook in your request parameter, our application will call your webhook with the result once. Cost: 3 credit/successful request [See the documentation](https://nubela.co/proxycurl/docs#contact-api-work-email-lookup-endpoint).",
  key: "proxycurl-lookup-email-from-linkedin-profile",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    linkedinProfileUrl: {
      type: "string",
      label: "LinkedIn Profile URL",
      description: "Linkedin Profile URL of the person you want to extract work email address from.",
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "Webhook to notify your application when the request has finished processing.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      linkedin_profile_url: this.linkedinProfileUrl,
      callback_url: this.callbackUrl,
    };
    const res = await this.app.lookupEmailFromLinkedinProfile(data);
    $.export("summary", `Profile successfully fetched from "${this.linkedinProfileUrl}".`);
    return res;
  },
};

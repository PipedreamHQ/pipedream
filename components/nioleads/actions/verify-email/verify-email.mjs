import nioleads from "../../nioleads.app.mjs";

export default {
  key: "nioleads-verify-email",
  name: "Verify Email",
  description: "Checks the deliverability of a specified email address. [See the documentation](https://apidoc.nioleads.com/?_gl=1*1288vdg*_ga*MTY1NzE1MjMzOC4xNzI1OTM5Njk1*_ga_ZVT2YHDDZG*MTcyNTk0Mzk5NC4yLjAuMTcyNTk0NDAyMy4wLjAuMA..#email-verifier)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nioleads,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to verify",
    },
  },
  async run({ $ }) {
    const response = await this.nioleads.verifyEmail({
      $,
      data: {
        email: this.email,
      },
    });
    if (response?.code) {
      throw new Error(`${response.msg}`);
    }
    $.export("$summary", `Verified email ${this.email}`);
    return response;
  },
};

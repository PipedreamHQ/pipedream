import nioleads from "../../nioleads.app.mjs";

export default {
  key: "nioleads-find-email",
  name: "Find Email",
  description: "Finds a business email address using a full name and a website domain. [See the documentation](https://apidoc.nioleads.com/?_gl=1*1288vdg*_ga*MTY1NzE1MjMzOC4xNzI1OTM5Njk1*_ga_ZVT2YHDDZG*MTcyNTk0Mzk5NC4yLjAuMTcyNTk0NDAyMy4wLjAuMA..#email-finder)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nioleads,
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the person",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The company domain name. (e.g. `example.com`)",
    },
  },
  async run({ $ }) {
    const response = await this.nioleads.findEmail({
      $,
      data: {
        name: this.name,
        domain: this.domain,
      },
    });
    if (response?.code) {
      throw new Error(`${response.msg}`);
    }
    $.export("$summary", `Found email: ${response.email}`);
    return response;
  },
};

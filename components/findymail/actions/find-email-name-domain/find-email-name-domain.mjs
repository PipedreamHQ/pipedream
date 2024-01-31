import findymail from "../../findymail.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "findymail-find-email-name-domain",
  name: "Find Email by Name and Company",
  description: "Locates an email using a full name and a company's website or name. [See the documentation](https://app.findymail.com/docs/)",
  version: "0.0.1",
  type: "action",
  props: {
    findymail,
    fullName: findymail.propDefinitions.fullName,
    companyWebsiteOrName: findymail.propDefinitions.companyWebsiteOrName,
  },
  async run({ $ }) {
    const response = await this.findymail.findEmailByNameAndCompany({
      fullName: this.fullName,
      companyWebsiteOrName: this.companyWebsiteOrName,
    });
    $.export("$summary", `Successfully found email for ${this.fullName}`);
    return response;
  },
};
import anymailFinder from "../../anymail_finder.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "anymail_finder-search-email",
  name: "Search Email",
  description: "Searches for emails based on company information and, optionally, a person's name.",
  version: "0.0.1",
  type: "action",
  props: {
    anymailFinder,
    company: {
      propDefinition: [
        anymailFinder,
        "company",
      ],
    },
    personName: {
      propDefinition: [
        anymailFinder,
        "personName",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const domain = this.company.includes(".")
      ? this.company
      : "";
    const companyName = domain
      ? ""
      : this.company;

    let response;
    if (this.personName) {
      // Split person's name to first and last name for a more refined search
      const [
        firstName,
        lastName,
      ] = this.personName.split(" ").length > 1
        ? this.personName.split(" ")
        : [
          this.personName,
          "",
        ];
      response = await this.anymailFinder.searchPersonEmail({
        fullName: this.personName,
        firstName,
        lastName,
        domain,
        companyName,
      });
    } else {
      response = await this.anymailFinder.searchPopularEmails({
        domain,
        companyName,
      });
    }

    $.export("$summary", `Successfully searched for emails related to ${this.company}${this.personName
      ? " for " + this.personName
      : ""}`);
    return response;
  },
};

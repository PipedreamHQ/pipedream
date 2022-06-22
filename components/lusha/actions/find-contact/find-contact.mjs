import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-find-contact",
  name: "Find Contact",
  description: "Search for a contact. [See docs here](https://www.lusha.com/docs/#person-api)",
  version: "0.0.1",
  type: "action",
  props: {
    lusha,
    firstName: {
      label: "First Name",
      description: "The first name of the person",
      type: "string",
    },
    lastName: {
      label: "Last Name",
      description: "The last name of the person",
      type: "string",
    },
    companyName: {
      label: "Company Name",
      description: "The name of the company",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = this.lusha.findContact({
      $,
      params: {
        firstName: this.firstName,
        lastName: this.lastName,
        company: this.companyName,
      },
    });

    $.export("$summary", "Successfully searched contact");

    return response;
  },
};

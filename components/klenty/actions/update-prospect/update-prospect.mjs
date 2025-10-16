import klenty from "../../klenty.app.mjs";

export default {
  key: "klenty-update-prospect",
  name: "Update Prospect",
  description: "Updates an existing prospect's information in Klenty. [See the documentation](https://www.klenty.com/developers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    klenty,
    list: {
      propDefinition: [
        klenty,
        "list",
      ],
      withLabel: true,
    },
    prospect: {
      propDefinition: [
        klenty,
        "prospect",
        ({ list }) => ({
          listName: list.label,
        }),
      ],
      withLabel: true,
    },
    email: {
      propDefinition: [
        klenty,
        "email",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        klenty,
        "firstName",
      ],
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The Prospect's company name.",
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The Prospect's full name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The Prospect's last name.",
      optional: true,
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "The Prospect's middle name.",
      optional: true,
    },
    account: {
      type: "string",
      label: "Account",
      description: "The Prospect's Account field.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "The Prospect's Department field.",
      optional: true,
    },
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "The Prospect's Company Domain field.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The Prospect's Title field.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The Prospect's Location field.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The Prospect's Phone field.",
      optional: true,
    },
    twitterId: {
      type: "string",
      label: "Twitter Id",
      description: "The Prospect's Twitter Id field.",
      optional: true,
    },
    companyPhone: {
      type: "string",
      label: "Company Phone",
      description: "The Prospect's Company Phone field.",
      optional: true,
    },
    companyEmail: {
      type: "string",
      label: "Company Email",
      description: "The Prospect's Company Email field.",
      optional: true,
    },
    linkedinURL: {
      type: "string",
      label: "Linkedin URL",
      description: "The Prospect's Linkedin URL field.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The Prospect's City field.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The Prospect's Country field.",
      optional: true,
    },
    newList: {
      propDefinition: [
        klenty,
        "list",
      ],
      label: "New List",
      description: "The list where the prospect is going.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.klenty.updateProspect({
      $,
      prospectEmail: this.prospect.label,
      data: {
        Email: this.email,
        FirstName: this.firstName,
        Company: this.company,
        FullName: this.fullName,
        LastName: this.lastName,
        MiddleName: this.middleName,
        Account: this.account,
        Department: this.department,
        CompanyDomain: this.companyDomain,
        Title: this.title,
        Location: this.location,
        Phone: this.phone,
        TwitterId: this.twitterId,
        CompanyPhone: this.companyPhone,
        CompanyEmail: this.companyEmail,
        LinkedinURL: this.linkedinURL,
        City: this.city,
        Country: this.country,
        List: this.newList || this.list,
        Tags: this.tags && this.tags.toString().replace(/,/g, "|"),
      },
    });

    $.export("$summary", "Updated prospect successfully!");
    return response;
  },
};

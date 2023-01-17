import roll from "../../roll.app.mjs";

export default {
  key: "roll-create-company",
  name: "Create Company",
  version: "0.0.1",
  description: "Create a new company [See the docs here](https://docs.rollhq.com/docs/roll-api#api-url)",
  type: "action",
  props: {
    roll,
    name: {
      type: "string",
      label: "Name",
      description: "The company's name.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The company's status.",
      optional: true,
    },
    invoiceFirstName: {
      type: "string",
      label: "Invoice First Name",
      description: "The fist name will be used on invoices.",
      optional: true,
    },
    invoiceLastName: {
      type: "string",
      label: "Invoice Last Name",
      description: "The last name will be used on invoices.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The company's phone number.",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The company's mobile phone number.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The company's contact email.",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The company's website.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The company's address.",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The company's additional address.",
      optional: true,
    },
    cityOrTown: {
      type: "string",
      label: "City Or Town",
      description: "The company's city.",
      optional: true,
    },
    stateOrRegion: {
      type: "string",
      label: "State Or Region",
      description: "The company's state.",
      optional: true,
    },
    zipOrPostcode: {
      type: "string",
      label: "Zip Or Postcode",
      description: "The company's zip.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The company's country.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      status,
      invoiceFirstName,
      invoiceLastName,
      phone,
      mobile,
      email,
      website,
      address,
      address2,
      cityOrTown,
      stateOrRegion,
      zipOrPostcode,
      country,
    } = this;

    const response = await this.roll.addSchema({
      $,
      mutation: `addCompany(
            CompanyName: "${name}",
            CompanyStatus: "${status}",
            CompanyInvoiceFirstName: "${invoiceFirstName}",
            CompanyInvoiceLastName: "${invoiceLastName}",
            CompanyPhone: "${phone}",
            CompanyMobile: "${mobile}",
            CompanyEmail: "${email}",
            CompanyWebsite: "${website}",
            CompanyAddress: "${address}",
            CompanyAddress2: "${address2}",
            CompanyCityOrTown: "${cityOrTown}",
            CompanyStateOrRegion: "${stateOrRegion}",
            CompanyZipOrPostcode: "${zipOrPostcode}",
            CompanyCountry: "${country}",
        ){
            CompanyId
        }`,
    });

    $.export("$summary", `Company successfully created with Id ${response.data.addCompany.CompanyId}!`);
    return response;
  },
};

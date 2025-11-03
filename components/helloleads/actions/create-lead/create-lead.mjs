import { ConfigurationError } from "@pipedream/platform";
import helloleads from "../../helloleads.app.mjs";
import {
  clearObj,
  parseObj,
} from "../../common/utils.mjs";

export default {
  key: "helloleads-create-lead",
  name: "Create Lead",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Adds a new lead into the HelloLeads system. [See the documentation](https://github.com/PipedreamHQ/pipedream/files/13168532/HelloLeads_CRM_API_Documentation_POST_Method.pdf)",
  type: "action",
  props: {
    helloleads,
    listKey: {
      propDefinition: [
        helloleads,
        "listKey",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the lead.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the lead.",
      optional: true,
    },
    designation: {
      type: "string",
      label: "Designation",
      description: "Designation of the lead.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Lead organization name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Primary email address of the lead.",
      optional: true,
    },
    phone: {
      type: "integer",
      label: "Phone",
      description: "Work phone number of the lead.",
      optional: true,
    },
    mobile: {
      type: "integer",
      label: "Mobile",
      description: "Mobile phone number of the lead.",
      optional: true,
    },
    fax: {
      type: "integer",
      label: "Fax",
      description: "Fax number of the lead.",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "Address line1 of the lead.",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "Address line2 of the lead.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City that the lead belongs to.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State that the lead belongs to.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Zip code of the region that the lead belongs to.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country that the lead belongs to.",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website reference of the lead.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Specify any other details about the lead.",
      optional: true,
    },
    interests: {
      type: "string[]",
      label: "Interests",
      description: "A list of Product/Interest which offered by you is interested to Lead. `(Don't use special characters)`.",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Customer group of a Lead. `(Don't use special characters)`.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Short tags (Tagging words) on lead. `(Do not use special characters)`.",
      optional: true,
    },
    mobileCode: {
      type: "string",
      label: "Mobile Code",
      description: "Mobile country code.",
      optional: true,
    },
    dealSize: {
      type: "string",
      label: "Deal Size",
      description: "Deal value of the business.",
      optional: true,
    },
    potential: {
      type: "string",
      label: "Potential",
      description: "How potential is the customer. By default, it will be Low.",
      options: [
        "High",
        "Medium",
        "Low",
        "Not Relevant",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      helloleads,
      listKey,
      firstName,
      lastName,
      email,
      mobile,
      addressLine1,
      addressLine2,
      postalCode,
      interests,
      tags,
      mobileCode,
      dealSize,
      ...data
    } = this;

    if (!email && !mobile) throw new ConfigurationError("You must fill in at least Email or Mobile");

    const response = await helloleads.createLead({
      $,
      data: clearObj({
        list_key: listKey,
        first_name: firstName,
        last_name: lastName,
        email: email,
        mobile: mobile,
        address_line1: addressLine1,
        address_line2: addressLine2,
        postal_code: postalCode,
        interests: interests && parseObj(interests).toString(),
        tags: tags && parseObj(tags).toString(),
        mobile_code: mobileCode,
        deal_size: dealSize,
        ...data,
      }),
    });

    $.export("$summary", `A new lead with Id: ${response.lead_id} created successfully!`);
    return response;
  },
};

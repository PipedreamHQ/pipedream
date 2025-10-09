import common from "../common/base.mjs";

export default {
  ...common,
  key: "qr_api-create-vcard-qrcode",
  name: "Create VCard QR Code",
  description: "Create a VCard QR Code. [See the documentation](https://qrapi.io/api-documentation/#/qrcode/create_vcard_qr_code)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    uname: {
      type: "string",
      label: "Uname",
      description: "Enter full name of contact you want encoded in the Vcard.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Enter title/designation of contact you want encoded in the Vcard.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Enter company name of contact you want encoded in the Vcard.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "Enter department name you want encoded in the Vcard.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Enter email address of contact you want encoded in the Vcard.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Enter phone number of contact you want encoded in the Vcard.",
      optional: true,
    },
    homePhone: {
      type: "string",
      label: "Home Phone",
      description: "Enter cell number of contact you want encoded in the Vcard.",
      optional: true,
    },
    fax: {
      type: "string",
      label: "Fax",
      description: "Enter fax number of contact you want encoded in the Vcard.",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Enter website URL of contact you want encoded in the Vcard.",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "Enter street address of contact you want encoded in the Vcard.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Enter city name of contact you want encoded in the Vcard.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Enter state name of contact you want encoded in the Vcard.",
      optional: true,
    },
    postal_code: {
      type: "string",
      label: "Postal Code",
      description: "Enter zip/postal code of contact you want encoded in the Vcard.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Enter country name of contact you want encoded in the Vcard.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "vcard";
    },
    getParams() {
      return {
        uname: this.uname,
        title: this.title,
        company: this.company,
        department: this.department,
        email: this.email,
        phone: this.phone,
        homePhone: this.homePhone,
        fax: this.fax,
        website: this.website,
        street: this.street,
        city: this.city,
        state: this.state,
        postal_code: this.postal_code,
        country: this.country,
      };
    },
  },
};

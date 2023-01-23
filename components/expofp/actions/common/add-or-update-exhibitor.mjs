import expofp from "../../expofp.app.mjs";

// Shared for 'add exhibitor' and 'update exhibitor'
export default {
  methods: {
    getCommonParams() {
      return {
        name: this.name,
        description: this.description,
        featured: this.featured,
        advertised: this.advertised,
        country: this.country,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        phone1: this.phone,
        publicEmail: this.publicEmail,
        privateEmail: this.state,
        website: this.website,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        adminNotes: this.adminNotes,
      };
    },
  },
  props: {
    expofp,
    eventId: {
      propDefinition: [
        expofp,
        "eventId",
      ],
    },
    name: {
      label: "Name",
      description: "Name of the exhibitor",
      type: "string",
      optional: true,
    },
    description: {
      label: "Description",
      description: "Description of the exhibitor",
      type: "string",
      optional: true,
    },
    featured: {
      label: "Featured",
      description: "Exhibitor is featured",
      type: "boolean",
      optional: true,
    },
    advertised: {
      label: "Advertised",
      description: "Exhibitor is advertised",
      type: "boolean",
      optional: true,
    },
    country: {
      label: "Country",
      description: "Country of the exhibitor",
      type: "string",
      optional: true,
    },
    address: {
      label: "Address",
      description: "Address of the exhibitor",
      type: "string",
      optional: true,
    },
    city: {
      label: "City",
      description: "City of the exhibitor",
      type: "string",
      optional: true,
    },
    state: {
      label: "State",
      description: "State of the exhibitor",
      type: "string",
      optional: true,
    },
    zip: {
      label: "ZIP",
      description: "ZIP code of the exhibitor",
      type: "string",
      optional: true,
    },
    phone: {
      label: "Phone",
      description: "Phone of the exhibitor",
      type: "string",
      optional: true,
    },
    publicEmail: {
      label: "Public email",
      description: "Public email of the exhibitor",
      type: "string",
      optional: true,
    },
    privateEmail: {
      label: "Private email",
      description: "Private email of the exhibitor",
      type: "string",
      optional: true,
    },
    website: {
      label: "Website",
      description: "Website of the exhibitor",
      type: "string",
      optional: true,
    },
    contactName: {
      label: "Contact name",
      description: "Contact name of the exhibitor",
      type: "string",
      optional: true,
    },
    contactPhone: {
      label: "Contact phone",
      description: "Contact phone of the exhibitor",
      type: "string",
      optional: true,
    },
    adminNotes: {
      label: "Admin Notes",
      description: "Admin notes for the exhibitor",
      type: "string",
      optional: true,
    },
  },
};

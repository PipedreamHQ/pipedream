import app from "../../jobnimbus.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the person this contact record is associated with.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the person this contact record is associated with.",
      optional: true,
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The company name that this contact record is associated with.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company Name",
      description: "Display name used mainly for QB syncing.",
      optional: true,
    },
    number: {
      type: "string",
      label: "Number",
      description: "The customer defined template generated number assigned to this record, based off of the record id.",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Whether this record is active(true) or deleted(false).",
      optional: true,
    },
    isArchived: {
      type: "boolean",
      label: "Is Archived",
      description: "Whether this record has been archived (true) or not (false).",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of string tags",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of this record.",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address Line 1",
      description: "The line 1 portion of the physical address.",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "The line 2 portion of the physical address.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city portion of the physical address.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state text portion of the physical address.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The postal code portion of the physical address.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country portion of the physical address.",
      optional: true,
    },
    geoLat: {
      type: "string",
      label: "Geo Latitude",
      description: "The latitude of geo coordinates of the address associated with this record.",
      optional: true,
    },
    geoLong: {
      type: "string",
      label: "Geo Longitude",
      description: "The longitude of geo coordinates of the address associated with this record.",
      optional: true,
    },
    estimatedTime: {
      type: "integer",
      label: "Estimated Time",
      description: "The number of minutes this record is estimated to take to complete.",
      optional: true,
    },
    isLead: {
      type: "boolean",
      label: "Is Lead",
      description: "Whether this record is a lead or not.",
      optional: true,
    },
    isClosed: {
      type: "boolean",
      label: "Is Closed",
      description: "Whether this record is closed or not.",
      optional: true,
    },
    isSubcontractor: {
      type: "boolean",
      label: "Is Subcontractor",
      description: "Whether this contact is a subcontractor or not for User.",
      optional: true,
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
      optional: true,
    },
    homePhone: {
      type: "string",
      label: "Home Phone",
      description: "The home phone number associated with this contact.",
      optional: true,
    },
    mobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "The mobile phone number associated with this contact.",
      optional: true,
    },
    workPhone: {
      type: "string",
      label: "Work Phone",
      description: "The work phone number associated with this contact.",
      optional: true,
    },
    faxNumber: {
      type: "string",
      label: "Fax Number",
      description: "The fax number associated with this contact.",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields that can be added according to API docs and custom fields.",
      optional: true,
    },
  },
  methods: {
    prepareData() {
      const pairs = {
        firstName: "first_name",
        lastName: "last_name",
        displayName: "display_name",
        isActive: "is_active",
        isArchived: "is_archived",
        address1: "address_line1",
        address2: "address_line2",
        state: "state_text",
        country: "country_name",
        estimatedTime: "estimated_time",
        isLead: "is_lead",
        isClosed: "is_closed",
        isSubcontractor: "is_sub_contractor",
        homePhone: "home_phone",
        mobilePhone: "mobile_phone",
        workPhone: "work_phone",
        faxNumber: "fax_number",
      };
      const data = {
        ...utils.extractProps(this, pairs),
        geo: {
          lat: parseFloat(this.geoLat),
          lon: parseFloat(this.geoLong),
        },
        ...this.additionalFields,
      };
      return data;
    },
  },
};

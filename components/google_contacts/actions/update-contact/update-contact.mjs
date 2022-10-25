import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-update-contact",
  name: "Update Contact",
  description: "Updates a contact. [See the docs here](https://developers.google.com/people/api/rest/v1/people/updateContact)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    resourceName: {
      propDefinition: [
        common.props.googleContacts,
        "resourceName",
      ],
    },
    updatePersonFields: {
      propDefinition: [
        common.props.googleContacts,
        "updatePersonFields",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.updatePersonFields.includes("names")) {
      props.firstName = {
        type: "string",
        label: "First Name",
        description: "Contact's first name",
      };
      props.middleName = {
        type: "string",
        label: "Middle Name",
        description: "Contact's middle name",
      };
      props.lastName = {
        type: "string",
        label: "Last Name",
        description: "Contact's last name",
      };
    }
    if (this.updatePersonFields.includes("emailAddresses")) {
      props.email = {
        type: "string",
        label: "Email Address",
        description: "Contact's email address",
      };
    }
    if (this.updatePersonFields.includes("phoneNumbers")) {
      props.phoneNumber = {
        type: "string",
        label: "Phone Number",
        description: "Contact's phone number",
      };
    }
    if (this.updatePersonFields.includes("addresses")) {
      props.streetAddress = {
        type: "string",
        label: "Street Address",
        description: "Contact's street address",
      };
      props.city = {
        type: "string",
        label: "City",
        description: "Contact's city",
      };
      props.state = {
        type: "string",
        label: "State",
        description: "Contact's state/region",
      };
      props.zipCode = {
        type: "string",
        label: "Zip Code",
        description: "Contact's zip code",
      };
      props.country = {
        type: "string",
        label: "Country",
        description: "Contact's country",
      };
    }
    return props;
  },
  methods: {
    async processResults(client) {
      const {
        resourceName,
        updatePersonFields,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        streetAddress,
        city,
        state: region,
        zipCode: postalCode,
        country,
      } = this;

      const { etag } = await this.googleContacts.getContact(client, {
        resourceName,
        personFields: "names",
      });

      const requestBody = {
        etag,
      };
      if (updatePersonFields.includes("addresses")) {
        requestBody.addresses = [
          {
            streetAddress,
            city,
            region,
            postalCode,
            country,
          },
        ];
      }
      if (updatePersonFields.includes("emailAddresses")) {
        requestBody.emailAddresses = [
          {
            value: email,
          },
        ];
      }
      if (updatePersonFields.includes("names")) {
        requestBody.names = [
          {
            familyName: lastName,
            middleName,
            givenName: firstName,
          },
        ];
      }
      if (updatePersonFields.includes("phoneNumbers")) {
        requestBody.phoneNumbers = [
          {
            value: phoneNumber,
          },
        ];
      }
      return this.googleContacts.updateContact(client, {
        resourceName,
        requestBody,
        updatePersonFields: updatePersonFields.join(),
      });
    },
    emitSummary($) {
      $.export("$summary", "Successfully updated contact");
    },
  },
};

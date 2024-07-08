import regal from "../../regal.app.mjs";

export default {
  key: "regal-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Create or update a contacts. [See the documentation](https://developer.regal.io/reference/api)",
  version: "0.0.1",
  type: "action",
  props: {
    regal,
    userId: {
      propDefinition: [
        regal,
        "userId",
      ],
    },
    phone: {
      propDefinition: [
        regal,
        "phone",
      ],
    },
    smsOptIn: {
      type: "boolean",
      label: "SMS Opt-In",
      description: "SMS subscription status. Defaults to `true`",
      default: true,
      optional: true,
    },
    voiceOptIn: {
      type: "boolean",
      label: "Voice Opt-In",
      description: "Voice subscription status. Defaults to `true`",
      default: true,
      optional: true,
    },
    email: {
      propDefinition: [
        regal,
        "email",
      ],
    },
    emailOptIn: {
      type: "boolean",
      label: "Email Opt-In",
      description: "Email subscription status. Defaults to `true`",
      default: true,
      optional: true,
    },
    firstName: {
      propDefinition: [
        regal,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        regal,
        "lastName",
      ],
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "Street address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the contact",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State/Region of the contact",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip code of the contact",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the contact. Example: `United States`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.regal.customEvent({
      $,
      data: {
        userId: this.userId,
        traits: {
          firstName: this.firstName,
          lastName: this.lastName,
          phones: this.phone
            ? {
              [this.phone]: {
                voiceOptIn: {
                  subscribed: this.voiceOptIn,
                },
                smsOptIn: {
                  subscribed: this.smsOptIn,
                },
              },
            }
            : undefined,
          emails: this.email
            ? {
              [this.email]: {
                emailOptIn: {
                  subscribed: this.emailOptIn,
                },
              },
            }
            : undefined,
          address: {
            street: this.streetAddress,
            city: this.city,
            state: this.state,
            zipcode: this.zip,
            country: this.country,
          },
        },
      },
    });
    if (response?.message === "ok") {
      $.export("$summary", "Successfully created or updated contact");
    }
    return response;
  },
};

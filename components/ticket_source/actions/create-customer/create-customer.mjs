import ticketSource from "../../ticket_source.app.mjs";

export default {
  key: "ticket_source-create-customer",
  name: "Create Customer",
  description: "Creates a new customer. [See the documentation](https://reference.ticketsource.io/#/operations/post-customer)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ticketSource,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the customer's address",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The second line of the customer's address",
      optional: true,
    },
    addressLine3: {
      type: "string",
      label: "Address Line 3",
      description: "The third line of the customer's address",
      optional: true,
    },
    addressLine4: {
      type: "string",
      label: "Address Line 4",
      description: "The fourth line of the customer's address",
      optional: true,
    },
    addressPostcode: {
      type: "string",
      label: "Address Postcode",
      description: "The postcode of the customer's address",
      optional: true,
    },
    telephone: {
      type: "string",
      label: "Telephone",
      description: "The telephone number of the customer",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer",
    },
    membershipIdentifier: {
      type: "string",
      label: "Membership Identifier",
      description: "The identifier of the customer's membership",
      optional: true,
    },
    membershipStartDate: {
      type: "string",
      label: "Membership Start Date",
      description: "The start date of the customer's membership. **Format: YYYY-MM-DD**",
      optional: true,
    },
    membershipEndDate: {
      type: "string",
      label: "Membership End Date",
      description: "The end date of the customer's membership. **Format: YYYY-MM-DD**",
      optional: true,
    },
    emailConsent: {
      type: "boolean",
      label: "Email Consent",
      description: "Whether the customer consents to receive email marketing",
      optional: true,
    },
    smsConsent: {
      type: "boolean",
      label: "SMS Consent",
      description: "Whether the customer consents to receive SMS marketing",
      optional: true,
    },
    postConsent: {
      type: "boolean",
      label: "Post Consent",
      description: "Whether the customer consents to receive postal marketing",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data: response } = await this.ticketSource.createCustomer({
      $,
      data: {
        data: {
          type: "customer",
          attributes: {
            first_name: this.firstName,
            last_name: this.lastName,
            address: {
              line_1: this.addressLine1,
              line_2: this.addressLine2,
              line_3: this.addressLine3,
              line_4: this.addressLine4,
              postcode: this.addressPostcode,
            },
            telephone: this.telephone,
            email: this.email,
            membership: {
              identifier: this.membershipIdentifier,
              start_date: this.membershipStartDate,
              end_date: this.membershipEndDate,
            },
            consent: {
              email: this.emailConsent,
              sms: this.smsConsent,
              post: this.postConsent,
            },
          },
        },
      },
    });
    $.export("$summary", `Successfully created customer: ${response.id}`);
    return response;
  },
};


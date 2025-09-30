import teamworkDesk from "../../teamwork_desk.app.mjs";

export default {
  key: "teamwork_desk-create-customer",
  name: "Create Customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new customer [See the documentation](https://apidocs.teamwork.com/docs/desk/fe69a0fb1007a-create-a-new-customer)",
  type: "action",
  props: {
    teamworkDesk,
    address: {
      propDefinition: [
        teamworkDesk,
        "address",
      ],
      optional: true,
    },
    avatarURL: {
      propDefinition: [
        teamworkDesk,
        "avatarURL",
      ],
      optional: true,
    },
    companyId: {
      propDefinition: [
        teamworkDesk,
        "companyId",
      ],
    },
    email: {
      propDefinition: [
        teamworkDesk,
        "email",
      ],
    },
    externalId: {
      propDefinition: [
        teamworkDesk,
        "externalId",
      ],
      optional: true,
    },
    extraData: {
      propDefinition: [
        teamworkDesk,
        "extraData",
      ],
      optional: true,
    },
    facebookURL: {
      propDefinition: [
        teamworkDesk,
        "facebookURL",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        teamworkDesk,
        "firstName",
      ],
      optional: true,
    },
    jobTitle: {
      propDefinition: [
        teamworkDesk,
        "jobTitle",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        teamworkDesk,
        "lastName",
      ],
      optional: true,
    },
    linkedinURL: {
      propDefinition: [
        teamworkDesk,
        "linkedinURL",
      ],
      optional: true,
    },
    mobile: {
      propDefinition: [
        teamworkDesk,
        "mobile",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        teamworkDesk,
        "notes",
      ],
      optional: true,
    },
    organization: {
      propDefinition: [
        teamworkDesk,
        "organization",
      ],
      optional: true,
    },
    permission: {
      propDefinition: [
        teamworkDesk,
        "permission",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        teamworkDesk,
        "phone",
      ],
      optional: true,
    },
    twitterHandle: {
      propDefinition: [
        teamworkDesk,
        "twitterHandle",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      teamworkDesk,
      companyId,
      email,
      ...data
    } = this;

    const response = await teamworkDesk.createCustomer({
      $,
      data: {
        customer: data,
        included: {
          companies: [
            {
              id: companyId,
              delete: false,
            },
          ],
          contacts: [
            {
              value: email,
              type: "email",
              isMain: true,
            },
          ],
        },
      },
    });

    $.export("$summary", `A new customer with Id: ${response.customer?.id} was successfully created!`);
    return response;
  },
};

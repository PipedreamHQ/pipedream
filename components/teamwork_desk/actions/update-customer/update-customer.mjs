import teamworkDesk from "../../teamwork_desk.app.mjs";

export default {
  key: "teamwork_desk-update-customer",
  name: "Update Customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a specific customer [See the documentation](https://apidocs.teamwork.com/docs/desk/3442f2a79b0d2-update-a-customer)",
  type: "action",
  props: {
    teamworkDesk,
    customerId: {
      propDefinition: [
        teamworkDesk,
        "customerId",
      ],
    },
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
      optional: true,
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
      customerId,
      companyId,
      email,
      ...data
    } = this;

    const included = {};
    if (companyId) included.companies = [
      {
        id: companyId,
        delete: false,
      },
    ];

    if (email) included.contacts = [
      {
        value: email,
        type: "email",
        isMain: true,
      },
    ];

    const response = await teamworkDesk.updateCustomer({
      $,
      customerId,
      data: {
        customer: data,
        included,
      },
    });

    $.export("$summary", `The customer with Id: ${response.customer?.id} was successfully updated!`);
    return response;
  },
};

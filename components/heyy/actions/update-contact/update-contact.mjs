import app from "../../heyy.app.mjs";

export default {
  key: "heyy-update-contact",
  name: "Update Contact",
  description: "Updates the details of a contact under your business.",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    phoneNumber: {
      optional: true,
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    firstName: {
      optional: true,
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    labels: {
      propDefinition: [
        app,
        "labels",
      ],
    },
    attributes: {
      propDefinition: [
        app,
        "attributes",
      ],
    },
  },
  methods: {
    updateContact({
      contactId, ...args
    } = {}) {
      return this.app.put({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateContact,
      contactId,
      phoneNumber,
      firstName,
      lastName,
      email,
      labels,
      attributes,
    } = this;

    const response = await updateContact({
      $,
      contactId,
      data: {
        phoneNumber,
        firstName,
        lastName,
        email,
        ...(labels?.length && {
          labels: labels.map((name) => ({
            name,
          })),
        }),
        attributes:
          attributes && Object.entries(attributes)
            .reduce((acc, [
              externalId,
              value,
            ]) => ([
              ...acc,
              {
                externalId,
                value,
              },
            ]), []),
      },
    });

    $.export("$summary", `Successfully updated contact with ID \`${response.data.id}\`.`);
    return response;
  },
};

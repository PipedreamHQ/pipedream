import app from "../../smoove.app.mjs";

export default {
  key: "smoove-find-or-create-subscriber",
  name: "Find Or Create Subscriber",
  description: "Checks if a contact exists in your account otherwise will create a contact. [See the docs](https://rest.smoove.io/#!/Contacts/Contacts_Exists).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    email: {
      label: "Email",
      description: "Email of the subscriber.",
      propDefinition: [
        app,
        "contactId",
        () => ({
          mapper: ({
            email, firstName, lastName,
          }) => ({
            label: `${firstName} ${lastName} (${email})`.trim(),
            value: email,
          }),
        }),
      ],
    },
    firstName: {
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
    cellPhone: {
      propDefinition: [
        app,
        "cellPhone",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
    },
    position: {
      propDefinition: [
        app,
        "position",
      ],
    },
    canReceiveEmails: {
      propDefinition: [
        app,
        "canReceiveEmails",
      ],
    },
    canReceiveSmsMessages: {
      propDefinition: [
        app,
        "canReceiveSmsMessages",
      ],
    },
  },
  methods: {
    existContact({
      contactId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/Contact/${contactId}/Exists`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      email,
      firstName,
      lastName,
      cellPhone,
      address,
      company,
      position,
      canReceiveEmails,
      canReceiveSmsMessages,
    } = this;

    const contactExists = await this.existContact({
      step,
      contactId: email,
      params: {
        by: "Email",
      },
    });

    if (!contactExists) {
      const response = await this.app.createUpdateContact({
        step,
        params: {
          updateIfExists: false,
        },
        data: {
          email,
          firstName,
          lastName,
          cellPhone,
          address,
          company,
          position,
          canReceiveEmails,
          canReceiveSmsMessages,
        },
      });

      step.export("$summary", `Succesfully added subscriber with ID ${response.id}`);

      return response;
    }

    const contact = await this.app.getContact({
      step,
      contactId: email,
      params: {
        by: "Email",
      },
    });

    step.export("$summary", `Succesfully found subscriber with ID ${contact.id}`);

    return contact;
  },
};

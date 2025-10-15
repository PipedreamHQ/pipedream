import app from "../../smoove.app.mjs";

export default {
  key: "smoove-add-or-update-subscriber",
  name: "Add Or Update Subscriber",
  description: "Adds a new contact to your account or update an existing contact. [See the docs](https://rest.smoove.io/#!/Contacts/Contacts_Post).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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

    const response = await this.app.createUpdateContact({
      step,
      params: {
        updateIfExists: true,
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

    step.export("$summary", `Succesfully added or updated subscriber with ID ${response.id}`);

    return response;
  },
};

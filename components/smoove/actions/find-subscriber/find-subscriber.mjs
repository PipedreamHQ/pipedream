import app from "../../smoove.app.mjs";

export default {
  key: "smoove-find-subscriber",
  name: "Find Subscriber",
  description: "Contacts information can be retrieved by sending the function a unique identifier (contact&#39;s ID, email, cell phone or external ID). [See the docs](https://rest.smoove.io/#!/Contacts/Contacts_GetById).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $: step }) {
    const response = await this.app.getContact({
      step,
      contactId: this.email,
      params: {
        by: "Email",
      },
    });

    step.export("$summary", `Succesfully found subscriber with ID ${response.id}`);

    return response;
  },
};

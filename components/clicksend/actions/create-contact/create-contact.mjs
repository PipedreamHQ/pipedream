import app from "../../clicksend.app.mjs";

export default {
  key: "clicksend-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in a specific list. [See the documentation](https://developers.clicksend.com/docs/rest/v3/#create-new-contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    faxNumber: {
      propDefinition: [
        app,
        "faxNumber",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
  },
  methods: {
    createContact({
      listId, ...args
    } = {}) {
      return this.app.post({
        path: `/lists/${listId}/contacts`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createContact,
      listId,
      name,
      phoneNumber,
      email,
      faxNumber,
      firstName,
    } = this;

    const response = await createContact({
      $,
      listId,
      data: {
        name,
        phone_number: phoneNumber,
        email,
        fax_number: faxNumber,
        first_name: firstName,
      },
    });

    $.export("$summary", `Successfully created new contact with ID \`${response.data.contact_id}\``);
    return response;
  },
};

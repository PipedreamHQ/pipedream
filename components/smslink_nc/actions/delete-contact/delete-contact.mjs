import app from "../../smslink_nc.app.mjs";

export default {
  key: "smslink_nc-delete-contact",
  name: "Delete Contact",
  description: "Deletes a contact. [See the documentation](https://api.smslink.nc/api/documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phoneNumber: {
      label: "Contact Phone Number",
      description: "The phone number of the contact to delete.",
      propDefinition: [
        app,
        "contactId",
        () => ({
          mapper: ({
            phone_number: value, first_name: firstName, last_name: lastName,
          }) => ({
            value,
            label: `${firstName || ""} ${lastName || ""} (${value})`.trim(),
          }),
        }),
      ],
    },
  },
  methods: {
    deleteContact(args = {}) {
      return this.app.delete({
        path: "/contact",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteContact,
      phoneNumber,
    } = this;

    const response = await deleteContact({
      $,
      data: {
        phone_numbers: [
          phoneNumber,
        ],
      },
    });
    $.export("$summary", "Successfully deleted contact.");
    return response;
  },
};

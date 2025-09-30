import app from "../../textline.app.mjs";

export default {
  key: "textline-create-update-contact",
  name: "Create Or Update Contact",
  description: "Create or update a contact in the Textline address book. [See the documentation](https://textline.docs.apiary.io/#reference/customers/customers/create-a-customer).",
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
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the contact.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the contact.",
      optional: true,
    },
  },
  methods: {
    updateCustomer({
      uuid, ...args
    } = {}) {
      return this.app.put({
        path: `/customer/${uuid}`,
        ...args,
      });
    },
    createCustomer(args = {}) {
      return this.app.post({
        path: "/customers",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      updateCustomer,
      createCustomer,
      phoneNumber,
      email,
      name,
      notes,
      tags,
    } = this;

    let response;
    let uuid;

    try {
      response = await createCustomer({
        $,
        data: {
          customer: {
            phone_number: phoneNumber,
            email,
            name,
            notes,
            tags,
          },
        },
      });
    } catch (error) {
      if (error.response.status === 400 && error.response.data?.errors?.phone_number[0] === "Already in use") {

        ({ customer: { uuid } } = await app.getCustomerByPhoneNumber({
          $,
          params: {
            phone_number: phoneNumber,
          },
        }));

      } else {
        throw error;
      }
    }

    if (!uuid) {
      $.export("$summary", `Successfully created the contact with uuid \`${response.customer.uuid}\`.`);
      return response;
    }

    response = await updateCustomer({
      $,
      uuid,
      data: {
        customer: {
          email,
          name,
          notes,
          tags,
        },
      },
    });

    $.export("$summary", `Successfully updated the contact with uuid \`${uuid}\`.`);
    return response;
  },
};

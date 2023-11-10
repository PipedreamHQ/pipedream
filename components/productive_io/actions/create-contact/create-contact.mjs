import app from "../../productive_io.app.mjs";

export default {
  key: "productiveio-create-contact",
  name: "Create Contact",
  description: "Creates a new contact entry in Productive.io. [See the documentation](https://developer.productive.io/contact_entries.html#contact-entries-contact-entries-post)",
  version: "0.0.17",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the contact.",
      options: [
        {
          label: "Address",
          value: "address",
        },
        {
          label: "Bill From",
          value: "bill_from",
        },
        {
          label: "Bill To",
          value: "bill_to",
        },
        {
          label: "Email",
          value: "email",
        },
        {
          label: "Phone",
          value: "phone",
        },
        {
          label: "Website",
          value: "website",
        },
      ],
    },
    contactableType: {
      type: "string",
      label: "Contactable Type",
      description: "The type of contactable.",
      options: [
        {
          label: "Person (used for contacts or users)",
          value: "person",
        },
        {
          label: "Client (used for companies)",
          value: "client",
        },
        {
          label: "Invoice (used for bill_from/bill_to on invoices)",
          value: "invoice",
        },
        {
          label: "Subsidiary",
          value: "subsidiary",
        },
        {
          label: "Purchase Order",
          value: "purchase_order",
        },
      ],
    },
  },
  methods: {
    createContact(args = {}) {
      return this.app.post({
        path: "/contact_entries",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createContact,
      // name,
      // type,
      // contactableType,
    } = this;

    const response = await createContact({
      $,
      data: {
        data: {
          type: "contact_entries",
          attributes: {
            contactable_type: "company",
            type: "email",
            name: "Home",
            email: "contact2@email.com",
          },
          relationships: {
            company: {
              data: {
                type: "companies",
                id: "615408",
              },
            },
          },
          // attributes: {
          //   name,
          //   type,
          //   contactable_type: contactableType,
          //   person: {
          //     data: {
          //       type: "people",
          //       attributes: {
          //         first_name: name,
          //       },
          //     },
          //   },
          // },
        },
      },
    });

    $.export("$summary", `Successfully created contact with name: ${response.data?.attributes?.name}`);
    return response;
  },
};

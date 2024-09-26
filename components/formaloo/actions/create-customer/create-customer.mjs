import formaloo from "../../formaloo.app.mjs";

export default {
  key: "formaloo-create-customer",
  name: "Create Customer",
  version: "0.0.1",
  description: "Create a new customer on the current business. [See the documentation](https://www.formaloo.com/en/developers/)",
  type: "action",
  props: {
    formaloo,
    fullName: {
      propDefinition: [
        formaloo,
        "fullName",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        formaloo,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        formaloo,
        "lastName",
      ],
      optional: true,
    },
    username: {
      propDefinition: [
        formaloo,
        "username",
      ],
    },
    email: {
      propDefinition: [
        formaloo,
        "email",
      ],
    },
    phoneNumber: {
      propDefinition: [
        formaloo,
        "phoneNumber",
      ],
    },
    numberOfTags: {
      propDefinition: [
        formaloo,
        "numberOfTags",
      ],
      optional: true,
      reloadProps: true,
    },
    score: {
      propDefinition: [
        formaloo,
        "score",
      ],
      optional: true,
    },
    countrySlug: {
      propDefinition: [
        formaloo,
        "countrySlug",
      ],
      optional: true,
    },
    stateSlug: {
      propDefinition: [
        formaloo,
        "stateSlug",
        ({ countrySlug }) => ({
          countrySlug,
        }),
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        formaloo,
        "city",
        ({ stateSlug }) => ({
          stateSlug,
        }),
      ],
      optional: true,
    },
    language: {
      propDefinition: [
        formaloo,
        "language",
      ],
      optional: true,
    },
    customerData: {
      propDefinition: [
        formaloo,
        "customerData",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    return Array.from({
      length: this.numberOfTags,
    }).reduce((acc, _, index) => {
      const pos = index + 1;

      return {
        ...acc,
        [`tagSlug-${pos}`]: {
          type: "string",
          label: `Tag ${pos}`,
          description: "The tag you want to add.",
          options: async ({ page }) => {
            const { data } = await this.formaloo.listTags({
              params: {
                page: page + 1,
              },
            });
            return data?.tags.map(({
              slug: value, title: label,
            }) => ({
              label,
              value,
            }));
          },
        },
      };
    }, {});
  },
  methods: {
    getTag(index) {
      const pos = index + 1;
      const { [`tagSlug-${pos}`]: slug } = this;
      return {
        slug,
      };
    },
    getTags() {
      return Array.from({
        length: this.numberOfTags,
      }).map((_, index) => this.getTag(index));
    },
  },
  async run({ $ }) {
    const {
      formaloo,
      fullName,
      firstName,
      lastName,
      phoneNumber,
      customerData,
      ...data
    } = this;

    const response = await formaloo.createCustomer({
      $,
      data: {
        ...data,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        customer_data: customerData,
        tags: this.getTags(),
      },
    });

    $.export("$summary", `A new customer with Id: ${response?.data?.customer?.slug} was successfully created!`);
    return response;
  },
};

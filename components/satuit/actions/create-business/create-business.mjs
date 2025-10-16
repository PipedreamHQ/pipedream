import app from "../../satuit.app.mjs";

export default {
  key: "satuit-create-business",
  name: "Create Business",
  description: "Creates a new business within the Satuit platform. [See the documentation](https://satuittechnologies.zendesk.com/hc/en-us/articles/360055725213-Satuit-REST-API-Postman-Documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    cBusiness: {
      type: "string",
      label: "Business Name",
      description: "The name of the business",
    },
    cCity: {
      type: "string",
      label: "City",
      description: "The city of the business",
    },
  },
  methods: {
    createBusiness(args = {}) {
      return this.app.post({
        path: "/business",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createBusiness,
      cBusiness,
      cCity,
    } = this;

    const response = await createBusiness({
      $,
      data: {
        cbusiness: cBusiness,
        address: {
          ccity: cCity,
        },
      },
    });

    $.export("$summary", `Successfully created a business with ID \`${response?.Result?.id}\``);

    return response;
  },
};

import elopage from "../../elopage.app.mjs";

export default {
  key: "elopage-create-order",
  name: "Create Order",
  description: "Create a new order. See the documentation by importing \"https://api.myablefy.com/api/swagger_doc/\" into the [Swagger editor](https://editor-next.swagger.io/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    elopage,
    productId: {
      propDefinition: [
        elopage,
        "productId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer who placed the order",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer who placed the order",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer who placed the order",
    },
  },
  async run({ $ }) {
    const response = await this.elopage.createOrder({
      $,
      data: {
        product_id: this.productId,
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
      },
    });
    $.export("$summary", `Successfully created order with ID \`${response.order?.id}\``);
    return response;
  },
};

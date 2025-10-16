import { PAYMENT_METHOD_OPTIONS } from "../../common/constants.mjs";
import ifthenpay from "../../ifthenpay.app.mjs";

export default {
  key: "ifthenpay-create-payment-reference",
  name: "Create Payment Reference",
  description: "Generates a Multibanco or MB WAY payment reference with a specified amount, entity code, and deadline. [See the documentation](https://ifthenpay.com/docs/en/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ifthenpay,
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "The payment method to use for Ifthenpay (e.g., MB WAY, Multibanco)",
      options: PAYMENT_METHOD_OPTIONS,
      reloadProps: true,
    },
    mbKey: {
      propDefinition: [
        ifthenpay,
        "mbKey",
      ],
      hidden: true,
    },
    mbWayKey: {
      propDefinition: [
        ifthenpay,
        "mbWayKey",
      ],
      hidden: true,
    },
    orderId: {
      type: "string",
      label: "Order Id",
      description: "Payment identifier defined by the client (e.g., invoice number, order number, etc.)",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount to be paid with decimal separator \".\"",
    },
    mobileNumber: {
      type: "string",
      label: "Mobile Number",
      description: "Place the country code before the mobile number without any spaces (use '#'' to separate the country code from the mobile number - p.e. 351#912345678)",
      hidden: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the payment, with a maximum length of 200 characters",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL address, with a maximum length of 200 characters",
      optional: true,
      hidden: true,
    },
    clientCode: {
      type: "string",
      label: "Client Code",
      description: "Client's code, with a maximum length of 200 characters",
      optional: true,
      hidden: true,
    },
    clientName: {
      type: "string",
      label: "Client Name",
      description: "Client's name, with a maximum length of 200 characters",
      optional: true,
      hidden: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The Client's name.",
      optional: true,
    },
    clientUsername: {
      type: "string",
      label: "Client Username",
      description: "Client's username, with a maximum length of 200 characters",
      optional: true,
      hidden: true,
    },
    clientPhone: {
      type: "string",
      label: "Client Phone",
      description: "Client's cell phone or phone number, with a maximum length of 200 characters",
      optional: true,
      hidden: true,
    },
    expiryDays: {
      type: "integer",
      label: "Expiry Days",
      description: "How many days the payment reference is valid for. [See the documentation](https://ifthenpay.com/docs/en/api/multibanco/#tag/multibanco/POST/init) for further details.",
      optional: true,
      hidden: true,
    },
  },
  async additionalProps(props) {
    const isMb = this.paymentMethod === "Multibanco";
    props.mbKey.hidden = !isMb;
    props.mbWayKey.hidden = isMb;
    props.mobileNumber.hidden = isMb;
    props.url.hidden = isMb;
    props.clientCode.hidden = isMb;
    props.clientName.hidden = isMb;
    props.email.label = "Client Email";
    props.email.description = "Client's email address, with a maximum length of 200 characters";
    props.clientUsername.hidden = isMb;
    props.clientPhone.hidden = isMb;
    props.expiryDays.hidden = isMb;
    return {};
  },
  async run({ $ }) {
    const response = await this.ifthenpay.generatePaymentReference({
      $,
      paymentMethod: this.paymentMethod,
      data: {
        mbKey: this.mbKey,
        mbWayKey: this.mbWayKey,
        orderId: this.orderId,
        amount: parseFloat(this.amount),
        mobileNumber: this.mobileNumber,
        email: this.email,
        description: this.description,
        url: this.url,
        clientCode: this.clientCode,
        clientName: this.clientName,
        clientUsername: this.clientUsername,
        clientPhone: this.clientPhone,
        expiryDays: this.expiryDays,
        expirationDate: this.expirationDate,
        clientEmail: this.email,
      },
    });

    $.export("$summary", `Successfully created payment reference with Order ID: ${response.OrderId}`);
    return response;
  },
};

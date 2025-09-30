import { PRODUCT_TYPE_OPTIONS } from "../../common/constants.mjs";
import learnworlds from "../../learnworlds.app.mjs";

export default {
  key: "learnworlds-enroll-user",
  name: "Enroll User",
  description: "Enroll user to product. [See the documentation](https://www.learnworlds.dev/docs/api/3d5e79f96b44a-enroll-user-to-product)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    learnworlds,
    userId: {
      propDefinition: [
        learnworlds,
        "userId",
      ],
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "Type of the product.",
      options: PRODUCT_TYPE_OPTIONS,
      reloadProps: true,
    },
    justification: {
      type: "string",
      label: "Justification",
      description: "Any justification/note for the enrollment.",
      optional: true,
    },
    sendEnrollmentEmail: {
      type: "boolean",
      label: "Send Enrollment Email",
      description: "Indication about whether the user should receive the enrollment email; true if she should receive the email, false if she should not.",
      optional: true,
    },
  },
  methods: {
    capitalize(s) {
      return String(s[0]).toUpperCase() + String(s).slice(1);
    },
  },
  async additionalProps() {
    const props = {};
    if (this.productType) {
      props.productId = {
        type: "string",
        label: "Product Id",
        description: "Unique Identifier of the product.",
        options: async({ page }) => {
          const { data } = await this.learnworlds[`list${this.capitalize(this.productType)}s`]({
            params: {
              page: page + 1,
            },
          });

          return data.map(({
            id: value, title: label,
          }) => ({
            label,
            value,
          }));
        },
      };
    }
    return props;
  },
  async run({ $ }) {
    const product = await this.learnworlds[`get${this.capitalize(this.productType)}`]({
      productId: this.productId,
    });

    const response = await this.learnworlds.enrollUser({
      $,
      userId: this.userId,
      data: {
        productId: this.productId,
        productType: this.productType,
        justification: this.justification,
        price: product.price || product.original_price,
        send_enrollment_email: this.sendEnrollmentEmail,
      },
    });

    $.export("$summary", "User successfully enrolled!");
    return response;
  },
};

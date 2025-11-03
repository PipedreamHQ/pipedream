import app from "../../more_trees_.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Plant Tree",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "more_trees_-plant-tree",
  description: "Plant a tree for self or for others. [See the documentation](https://moretrees.eco/user-guide/api/#KB32)",
  type: "action",
  props: {
    app,
    treeTypeSlug: {
      propDefinition: [
        app,
        "treeTypeSlug",
      ],
    },
    requestType: {
      type: "string",
      label: "Request Type",
      description: "The type of the request",
      options: constants.REQUEST_TYPES,
      reloadProps: true,
    },
  },
  async additionalProps() {
    let props = {
      quantity: {
        type: "integer",
        label: "Quantity",
        description: "The number of trees to plant",
      },
    };

    if (this.requestType === "2") {
      props = {
        ...props,
        firstName: {
          type: "string",
          label: "First name",
          description: "The first name of the receiver",
        },
        email: {
          type: "string",
          label: "Email",
          description: "The email of the receiver.",
        },
        senderName: {
          type: "string",
          label: "Sender name",
          description: "The name of the sender",
        },
      };
    }

    return props;
  },
  async run({ $ }) {
    let data = {
      type_slug: this.treeTypeSlug,
      request_type: this.requestType,
    };

    if (this.requestType === "2") {
      data = {
        ...data,
        users: [
          {
            first_name: this.firstName,
            email: this.email,
            quantity: this.quantity,
            sender_name: this.senderName,
          },
        ],
      };
    } else {
      data.quantity = this.quantity;
    }

    const response = await this.app.plantTree({
      $,
      data,
    });

    if (response) {
      $.export("$summary", `Successfully planted tree with certificate ID \`${response.data.certificates[0].certificateID}\``);
    }

    return response;
  },
};

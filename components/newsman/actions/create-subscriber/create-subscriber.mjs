import newsman from "../../newsman.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "newsman-create-subscriber",
  name: "Create Subscriber",
  description: "Create a new subscriber in Newsman. [See the documentation](https://kb.newsman.com/api/1.2/subscriber.saveSubscribe)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    newsman,
    listId: {
      propDefinition: [
        newsman,
        "listId",
      ],
    },
    email: {
      propDefinition: [
        newsman,
        "email",
      ],
    },
    ip: {
      type: "string",
      label: "IP",
      description: "The IP address of the subscriber",
    },
    firstName: {
      propDefinition: [
        newsman,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        newsman,
        "lastName",
      ],
    },
    props: {
      type: "object",
      label: "Props",
      description: "Hash array with props (can be later used to build segment criteria). Tags may be specified by adding the tag_ prefix to the key of a prop, eg: tag_city",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.newsman.createSubscriber({
      $,
      data: {
        list_id: this.listId,
        email: this.email,
        ip: this.ip,
        firstname: this.firstName || "",
        lastname: this.lastName || "",
        props: parseObject(this.props),
      },
    });
    if (Number.isInteger(response)) {
      $.export("$summary", `Subscriber created successfully with ID: ${response}`);
    }
    return response;
  },
};

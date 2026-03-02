import aircall from "../../aircall.app.mjs";
import { parseDate } from "../../common/utils.mjs";

export default {
  key: "aircall-list-contacts",
  name: "List Contacts",
  description: "List contacts. [See the documentation](https://developer.aircall.io/api-references/#list-all-contacts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aircall,
    from: {
      propDefinition: [
        aircall,
        "from",
      ],
    },
    to: {
      propDefinition: [
        aircall,
        "to",
      ],
    },
    order: {
      propDefinition: [
        aircall,
        "order",
      ],
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "The field to order the results by",
      options: [
        "created_at",
        "updated_at",
      ],
    },
    maxResults: {
      propDefinition: [
        aircall,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.aircall.paginate({
      fn: this.aircall.listContacts,
      args: {
        debug: true,
        $,
        params: {
          from: parseDate(this.from),
          to: parseDate(this.to),
          order: this.order,
          order_by: this.orderBy,
        },
      },
      resourceKey: "contacts",
      max: this.maxResults,
    });

    const contacts = [];
    for await (const contact of results) {
      contacts.push(contact);
    }

    if (contacts?.length) {
      $.export("$summary", `Successfully retrieved ${contacts.length} contact${contacts.length === 1
        ? ""
        : "s"}`);
    } else {
      $.export("$summary", "No contacts found");
    }
    return contacts;
  },
};

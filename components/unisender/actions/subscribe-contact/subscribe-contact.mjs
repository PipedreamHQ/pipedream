import common from "../common/base.mjs";

export default {
  ...common,
  key: "unisender-subscribe-contact",
  name: "Subscribe Contact",
  description: "This method adds contacts (email address and/or mobile phone numbers) of the contact to one or several lists, and also allows you to add/change values of additional fields and tags. [See the docs here](https://www.unisender.com/ru/support/api/contacts/subscribe/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    lists: {
      propDefinition: [
        common.props.unisender,
        "lists",
      ],
    },
    email: {
      propDefinition: [
        common.props.unisender,
        "email",
      ],
    },
    name: {
      propDefinition: [
        common.props.unisender,
        "name",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        common.props.unisender,
        "phone",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        common.props.unisender,
        "tags",
      ],
      optional: true,
    },
  },
  methods: {
    async processEvent($) {
      const {
        lists,
        email,
        name,
        phone,
        tags,
      } = this;
      return this.unisender.subscribeContact({
        $,
        params: {
          "list_ids": lists.join(","),
          "fields[email]": email,
          "fields[Name]": name,
          "fields[phone]": phone,
          "tags": tags?.join(","),
          "double_optin": 3,
          "overwrite": 0,
        },
      });
    },
    getSummary({ result }) {
      return `Contact with id ${result.person_id} Successfully subscribed!`;
    },
  },
};

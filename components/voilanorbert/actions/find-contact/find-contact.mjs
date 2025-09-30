import common from "../common/base.mjs";

export default {
  ...common,
  key: "voilanorbert-find-contact",
  name: "Find Contact",
  description: "This action returns a specific contact. The object email is either null when the email is not found, or contains an object with at least email (the email string) and the score. [See the docs here](https://api.voilanorbert.com/2018-01-08/#contacts-get-1)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    contactId: {
      propDefinition: [
        common.props.voilanorbert,
        "contactId",
      ],
    },
  },
  methods: {
    async processEvent() {
      const { contactId } = this;
      return this.voilanorbert.getContact({
        contactId,
      });
    },
    getSummary({
      name, email,
    }) {
      return `Contact '${name ?? email.email}' Successfully fetched!`;
    },
  },
};

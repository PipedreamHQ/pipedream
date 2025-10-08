import common from "../common/base.mjs";

export default {
  ...common,
  key: "mixmax-create-contact-group",
  name: "Create Contact Group",
  description: "Create a contact group. [See the docs here](https://developer.mixmax.com/reference/contactgroups-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new Contact Group.",
    },
    contacts: {
      propDefinition: [
        common.props.mixmax,
        "contactId",
      ],
      withLabel: true,
      type: "string[]",
      optional: true,
    },
  },
  methods: {
    async processEvent() {
      const {
        name,
        contacts,
      } = this;

      return this.mixmax.createContactGroup({
        data: {
          name,
          contacts: contacts?.map(({ label }) => ({
            email: label,
          })),
        },
      });
    },
    getSummary() {
      return "Contact group Successfully created!";
    },
  },
};

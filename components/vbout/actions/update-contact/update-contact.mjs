import common from "../common/base.mjs";

export default {
  ...common,
  key: "vbout-update-contact",
  name: "Update Contact",
  description: "This action updates a specific contact. [See the docs here](https://developers.vbout.com/docs#emailmarketing_editcontact)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    list: {
      propDefinition: [
        common.props.vbout,
        "list",
      ],
      reloadProps: true,
      description: "Select the list to load contacts",
    },
    contact: {
      propDefinition: [
        common.props.vbout,
        "contact",
        (c) => ({
          listId: c.list.value,
        }),
      ],
    },
    email: {
      propDefinition: [
        common.props.vbout,
        "emailSubject",
      ],
      optional: true,
      description: "The email of the contact.",
    },
    ipaddress: {
      propDefinition: [
        common.props.vbout,
        "ipaddress",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        common.props.vbout,
        "status",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.list) {
      const { list: { fields } } = await this.vbout.getList({
        id: this.list.value,
      });

      for (const [
        key,
        value,
      ] of Object.entries(fields)) {
        props[`fields-${key}`] = {
          type: "string",
          label: `${value} (${key})`,
          description: "custom field added to a specific list",
          optional: true,
        };
      }
    }

    return props;
  },
  methods: {
    async processEvent($) {
      const {
        // eslint-disable-next-line no-unused-vars
        vbout, list, contact, email, ipaddress, status, ...customFields
      } = this;

      const fields = {
        $,
        id: contact.value,
        email,
        ipaddress,
        status,
      };

      for (const key in customFields) {
        const item = customFields[key];
        const customFieldName = (key.split("fields-"))[1];
        fields[`fields[${customFieldName}]`] = item;
      }

      return this.vbout.updateContact(fields);
    },
    getSummary() {
      return `Contact ${this.contact.label} Successfully unsubscribed!`;
    },
  },
};

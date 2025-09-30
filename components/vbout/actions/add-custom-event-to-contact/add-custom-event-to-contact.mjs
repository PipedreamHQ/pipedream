import moment from "moment";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "vbout-add-custom-event-to-contact",
  name: "Add Custom Event To Contact",
  description: "This action add a custom activity to the contact. [See the docs here](https://developers.vbout.com/docs#emailmarketing_addactivity)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    list: {
      propDefinition: [
        common.props.vbout,
        "list",
      ],
    },
    contact: {
      propDefinition: [
        common.props.vbout,
        "contact",
        (c) => ({
          listId: c.list.value,
        }),
      ],
      description: "Select the contact you want to add the activity.",
    },
    description: {
      propDefinition: [
        common.props.vbout,
        "description",
      ],
    },
  },
  methods: {
    async processEvent($) {
      const {
        contact,
        description,
      } = this;
      return this.vbout.addActivity({
        $,
        params: {
          id: contact.value,
          description: description,
          datetime: moment().format("YYYY-MM-DD HH:mm"),
        },
      });
    },
    getSummary() {
      return `Contact ${this.contact.label} Successfully moved to list ${this.list.label}!`;
    },
  },
};

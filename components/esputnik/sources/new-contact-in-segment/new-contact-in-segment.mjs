import common from "../common/base.mjs";

export default {
  ...common,
  key: "esputnik-new-contact-in-segment",
  name: "New Contact in Segment",
  description: "Emit new event when a new contact is added in the specified segment",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    segment: {
      propDefinition: [
        common.props.esputnik,
        "segment",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(contact) {
      return this.generateContactMeta(contact);
    },
  },
  async run() {
    const contacts = await this.getPaginatedContacts(this.esputnik.listSegmentContacts.bind(this), {
      params: {
        orderByTs: true,
        asc: false,
      },
      segmentId: this.segment,
    });
    for await (const contact of contacts) {
      const meta = this.generateMeta(contact);
      this.$emit(contact, meta);
    }
  },
};

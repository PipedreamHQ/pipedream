import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ortto-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a contact is created in your Ortto account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.ortto.listPeople;
    },
    getFieldName() {
      return "contacts";
    },
    getFields() {
      return [
        "str::first",
        "str::last",
        "phn::phone",
        "str::email",
        "geo::city",
        "geo::country",
        "dtz::b",
        "geo::region",
        "str::postal",
        "tags",
        "u4s::t",
        "bol::gdpr",
        "str::ei",
        "bol::p",
        "str::u-ctx",
        "str::s-ctx",
        "bol::sp",
        "str::soi-ctx",
        "str::soo-ctx",
      ];
    },
    getSummary(item) {
      return `New Contact: ${item.fields["str::first"] || ""} ${item.fields["str::last"] || ""}  ${item.fields["str::email"] || ""} `;
    },
  },
  sampleEmit,
};

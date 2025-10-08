import bookingExperts from "../../booking_experts.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "booking_experts-search-contacts",
  name: "Search Contacts",
  description: "Search for contacts by email or phone. [See the documentation](https://developers.bookingexperts.com/reference/contact-search-first)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bookingExperts,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact to search for",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact to search for",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.email && !this.phone) {
      throw new ConfigurationError("Either email or phone must be provided");
    }

    try {
      const { data } = await this.bookingExperts.searchContacts({
        params: {
          email: this.email,
          phone: this.phone,
        },
      });
      if (data?.id) {
        $.export("$summary", "Found contact matching criteria");
      }
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        $.export("$summary", "No contact found matching criteria");
        return;
      }
      throw error;
    }
  },
};

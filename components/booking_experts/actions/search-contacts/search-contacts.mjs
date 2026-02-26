import { ConfigurationError } from "@pipedream/platform";
import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-search-contacts",
  name: "Search Contacts",
  description: "Search for contacts by email or phone. [See the documentation](https://developers.bookingexperts.com/reference/contact-search-first)",
  version: "1.0.0",
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
      const response = await this.bookingExperts.searchContacts({
        $,
        params: {
          email: this.email,
          phone: this.phone,
        },
      });
      if (response.data?.id) {
        $.export("$summary", "Found contact matching criteria");
      }
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        $.export("$summary", "No contact found matching criteria");
        return;
      }
      throw error;
    }
  },
};

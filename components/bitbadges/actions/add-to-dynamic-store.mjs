import app from "../bitbadges.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "complete-claim",
  name: "Complete Claim",
  description: "Completes a BitBadges claim on behalf of a user.",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    dynamicDataId: {
      type: "string",
      label: "Dynamic Data ID",
      description: "The dynamic data store ID to add to.",
      optional: false,
    },
    dataSecret: {
      type: "string",
      label: "Data Secret",
      description: "The data secret of the dynamic data store.",
      optional: false,
    },
    address: {
      type: "string",
      label: "Address",
      description:
                "The address to add to the dynamic data store. Only applicable if it is an address store.",
      optional: true,
    },
    id: {
      type: "string",
      label: "ID",
      description:
                "The ID to add to the dynamic data store. Only applicable if it is a socials store.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description:
                "The email to add to the dynamic data store. Only applicable if it is an email store.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description:
                "The username to add to the dynamic data store. Only applicable if it is a socials store.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      await axios($, {
        method: "POST",
        url: `https://api.bitbadges.io/api/v0/bin-actions/add/${this.dynamicDataId}/${this.dataSecret}`,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-api-key": this.bitbadges.$auth.api_key,
        },
        data: {
          address: this.address,
          id: this.id,
          email: this.email,
          username: this.username,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      $.export("error", error);
      throw error;
    }
  },
};

import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import upviral from "../../upviral.app.mjs";

export default {
  key: "upviral-add-contact",
  name: "Add Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a new contact in your particular campaign. [See the documentation](https://api.upviral.com/#add-contact)",
  type: "action",
  props: {
    upviral,
    campaignId: {
      propDefinition: [
        upviral,
        "campaignId",
      ],
      reloadProps: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The user's name.",
      optional: true,
    },
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "The user's IP Address.",
      optional: true,
    },
    referralCode: {
      type: "string",
      label: "Referral Code",
      description: "The unique referral code (Last part of unique Referral URL). For example - https://upvir.al/ref/XXXX, Referral Code will be XXXX.This will be the referral code of the person who referred this new contact. The original participant will get the credit for this new contact.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.campaignId) {
      let count = 0;
      let data = new FormData();
      data.append("campaign_id", this.campaignId);

      const { custom_fields: customFields } = await this.upviral.listCustomFields({
        data,
        headers: data.getHeaders(),
      });

      for (const field of customFields) {
        props[`customField-${field}`] = {
          type: "string",
          label: field,
          description: `Custom field ${++count}`,
          optional: true,
        };
      }
    }
    return props;
  },
  methods: {
    parseCustomFields() {
      const customFields = Object.entries(this).filter(([
        key,
      ]) => key.includes("customField-"))
        .map(([
          key,
          value,
        ]) => ([
          key.split("-")[1],
          value,
        ]));

      return JSON.stringify(Object.fromEntries(customFields)) || null;
    },
  },
  async run({ $ }) {
    var bodyFormData = new FormData();
    bodyFormData.append("campaign_id", this.campaignId);
    bodyFormData.append("email", this.email);
    if (this.name) bodyFormData.append("name", this.name);
    if (this.ipAddress) bodyFormData.append("ip_address", this.ipAddress);
    if (this.referralCode) bodyFormData.append("referral_code", this.referralCode);
    bodyFormData.append("custom_fields", this.parseCustomFields() );

    const response = await this.upviral.addContact({
      $,
      data: bodyFormData,
      headers: bodyFormData.getHeaders(),
    });

    if (response.result === "error") {
      throw new ConfigurationError(response.message);
    }

    $.export("$summary", `A new contact with UID: '${response.uid}' was successfully created!`);
    return response;
  },
};

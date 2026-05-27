import dreamdata from "../../dreamdata.app.mjs";
import { buildEvent } from "../../common/utils.mjs";

export default {
  key: "dreamdata-identify-company",
  name: "Identify Company (Group)",
  description: "Associate a user with a company/account and record traits about the company. Either a User ID or an Anonymous ID is required. [See the documentation](https://developer.dreamdata.io/server-side/nodejs-sdk/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dreamdata,
    groupId: {
      type: "string",
      label: "Group ID",
      description: "Unique identifier for the company/account in your database (e.g. domain or CRM ID).",
    },
    userId: {
      propDefinition: [
        dreamdata,
        "userId",
      ],
    },
    anonymousId: {
      propDefinition: [
        dreamdata,
        "anonymousId",
      ],
    },
    traits: {
      type: "object",
      label: "Traits",
      description: "Free-form dictionary of traits about the company, e.g. `{ \"name\": \"Acme Inc\", \"domain\": \"acme.com\", \"industry\": \"SaaS\", \"employees\": 250 }`.",
      optional: true,
    },
    messageId: {
      propDefinition: [
        dreamdata,
        "messageId",
      ],
    },
    timestamp: {
      propDefinition: [
        dreamdata,
        "timestamp",
      ],
    },
    context: {
      propDefinition: [
        dreamdata,
        "context",
      ],
    },
    integrations: {
      propDefinition: [
        dreamdata,
        "integrations",
      ],
    },
  },
  async run({ $ }) {
    if (!this.userId && !this.anonymousId) {
      throw new Error("Either User ID or Anonymous ID must be provided.");
    }
    const event = buildEvent({
      type: "group",
      groupId: this.groupId,
      userId: this.userId,
      anonymousId: this.anonymousId,
      traits: this.traits,
      messageId: this.messageId,
      timestamp: this.timestamp,
      context: this.context,
      integrations: this.integrations,
    });
    const response = await this.dreamdata.sendEvent({
      $,
      event,
    });
    $.export("$summary", `Identified company ${this.groupId}`);
    return response;
  },
};

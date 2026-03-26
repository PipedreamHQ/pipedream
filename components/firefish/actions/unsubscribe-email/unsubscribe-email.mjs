import firefish from "../../firefish.app.mjs";

export default {
  key: "firefish-unsubscribe-email",
  name: "Unsubscribe Email",
  description: "Removes a particular contact or candidate from all existing firefish email subscriptions. [See the documentation](https://developer.firefishsoftware.com/#002bb8c0-0b41-4016-b33c-026a46b499b2)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    firefish,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber you want to remove",
    },
  },
  async run({ $ }) {
    const contacts = await this.firefish.searchContacts({
      $,
      params: {
        "email-address": this.email,
      },
    });
    for (const contact of contacts) {
      contact.EmailMarketing = false;
      await this.firefish.updateContact({
        $,
        contactId: contact.Ref,
        data: contact,
      });
    }

    const candidates = await this.firefish.searchCandidates({
      $,
      params: {
        "email-address": this.email,
      },
    });
    for (const candidate of candidates) {
      candidate.EmailMarketing = false;
      await this.firefish.updateCandidate({
        $,
        candidateId: candidate.Ref,
        data: candidate,
      });
    }

    $.export("$summary", `Successfully removed ${this.email} from email marketing`);
    return {
      contacts,
      candidates,
    };
  },
};

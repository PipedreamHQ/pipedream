import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-actor",
  name: "Get Actor",
  description: "Resolves an actor ID (e.g. the value returned by a message's `senders[].actorId` field) to its name, email, and type. [See the documentation](https://developers.hubspot.com/docs/reference/api/conversations/inbox-and-messages#get-actors)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
    actorId: {
      propDefinition: [
        hubspot,
        "senderActorId",
      ],
      label: "Actor",
      description: "The HubSpot Conversations actor ID to resolve. Accepts a HubSpot owner ID or a fully-qualified actor ID with type prefix: `A-12345` (owner/agent), `I-67890` (integration), `B-11111` (bot), `S-...` (system), `V-...` (visitor), `E-...` (email), `L-...` (LLM). Owner IDs without a type prefix are auto-prefixed with `A-`. Actor IDs typically appear in a message's `senders[].actorId` field.",
    },
  },
  async run({ $ }) {
    const actorId = this.hubspot.normalizeActorId(this.actorId);
    const response = await this.hubspot.getActor({
      $,
      actorId,
    });
    const label = response?.name && response?.email
      ? `${response.name} (${response.email})`
      : response?.name || actorId;
    $.export("$summary", `Retrieved actor: ${label}`);
    return response;
  },
};

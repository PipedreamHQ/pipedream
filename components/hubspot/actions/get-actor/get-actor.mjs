import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-actor",
  name: "Get Actor",
  description: "Resolves an actor ID (e.g. the value returned by a message's `senders[].actorId` field) to its name, email, and type. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/actors/get-conversations-v3-conversations-actors-actorId)",
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
      description: "Pick a HubSpot owner from the dropdown, or enter a custom expression with a fully-qualified actor ID (e.g. `A-12345` for owner, `I-67890` for integration, `B-11111` for bot, `S-...` for system, `V-...` for visitor). Owner IDs without a type prefix are auto-prefixed with `A-`. These IDs typically appear in a message's `senders[].actorId` field.",
    },
  },
  async run({ $ }) {
    const actorId = /^[A-Z]-/.test(this.actorId)
      ? this.actorId
      : `A-${this.actorId}`;
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

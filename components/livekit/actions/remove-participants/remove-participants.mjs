import app from "../../livekit.app.mjs";

export default {
  key: "livekit-remove-participants",
  name: "Remove Participants",
  description: "Remove specific participants from a LiveKit room. [See the documentation](https://github.com/livekit/node-sdks/tree/main/packages/livekit-server-sdk).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    room: {
      propDefinition: [
        app,
        "room",
      ],
    },
    identities: {
      type: "string[]",
      label: "Participant Identities",
      description: "Identities of participants to remove from the room",
      propDefinition: [
        app,
        "identity",
        ({ room }) => ({
          room,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      room,
      identities,
    } = this;

    const results = await Promise.all(
      identities.map(async (identity) => {
        await app.removeParticipant(room, identity);
        return identity;
      }),
    );

    $.export("$summary", `Successfully removed \`${identities.length}\` participant(s) from room: \`${room}\``);

    return {
      room,
      removedParticipants: results,
    };
  },
};

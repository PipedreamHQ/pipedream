import common from "../common-polling.mjs";
import twitch from "../../twitch.app.mjs";

export default {
  ...common,
  name: "New Streams By Game",
  key: "twitch-streams-by-game",
  description: "Emit new event when a live stream starts from any stream matching the game and language specified.",
  version: "0.1.3",
  type: "source",
  props: {
    ...common.props,
    game: {
      propDefinition: [
        twitch,
        "game",
      ],
    },
    language: {
      propDefinition: [
        twitch,
        "language",
      ],
    },
    max: {
      propDefinition: [
        twitch,
        "max",
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta({
      id,
      title: summary,
      started_at: startedAt,
    }) {
      const ts = new Date(startedAt).getTime();
      return {
        id: `${id}${ts}`,
        summary,
        ts,
      };
    },
  },
  async run() {
    const { data: gameData } = await this.twitch.getGames([
      this.game,
    ]);
    if (gameData.length == 0) {
      console.log(`No game found with the name ${this.game}`);
      return;
    }

    // get and emit streams for the specified game & language
    const streams = await this.paginate(
      this.twitch.getStreams.bind(this),
      {
        game_id: gameData[0].id,
        language: this.language,
      },
      this.max,
    );
    for await (const stream of streams) {
      this.$emit(stream, this.getMeta(stream));
    }
  },
};

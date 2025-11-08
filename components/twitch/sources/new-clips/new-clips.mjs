import common from "../common-polling.mjs";
import twitch from "../../twitch.app.mjs";

export default {
  ...common,
  name: "New Clips",
  key: "twitch-new-clips",
  description: "Emit new event when there is a new clip for the specified game.",
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
      created_at: createdAt,
    }) {
      const ts = new Date(createdAt).getTime();
      return {
        id,
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

    // get and emit new clips of the specified game
    const lastEvent = this.getLastEvent();
    const params = {
      game_id: gameData[0].id,
      started_at: lastEvent
        ? new Date(lastEvent)
        : new Date(),
    };
    const clips = await this.paginate(
      this.twitch.getClips.bind(this),
      params,
      this.max,
    );
    for await (const clip of clips) {
      this.$emit(clip, this.getMeta(clip));
    }

    this.setLastEvent(Date.now());
  },
};

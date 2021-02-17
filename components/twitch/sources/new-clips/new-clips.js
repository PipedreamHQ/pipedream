const common = require("../common-polling.js");
const twitch = require("../../twitch.app.js");

module.exports = {
  ...common,
  name: "New Clips",
  key: "twitch-new-clips",
  description:
    "Emits an event when there is a new clip for the specified game.",
  version: "0.0.1",
  props: {
    ...common.props,
    game: { propDefinition: [twitch, "game"] },
    max: { propDefinition: [twitch, "max"] },
  },
  methods: {
    ...common.methods,
    getMeta({ id, title: summary, created_at: createdAt }) {
      const ts = new Date(createdAt).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const { data: gameData } = await this.twitch.getGames([this.game]);
    if (!gameData) {
      console.log(`No game found with the name ${this.game}`);
      return;
    }

    // get and emit new clips of the specified game
    const clips = await this.paginate(
      this.twitch.getClips.bind(this),
      {
        game_id: gameData[0].id,
        started_at: this.getLastEvent(this.db.get("lastEvent")),
      },
      "polling",
      this.max
    );

    this.db.set("lastEvent", Date.now());
  },
};
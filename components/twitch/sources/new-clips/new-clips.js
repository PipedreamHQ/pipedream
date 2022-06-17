const common = require("../common-polling.js");
const twitch = require("../../twitch.app.js");

module.exports = {
  ...common,
  name: "New Clips",
  key: "twitch-new-clips",
  description:
    "Emit new event when there is a new clip for the specified game and/or streamer.",
  version: "0.0.2",
  type: "source",
  props: {
    ...common.props,
    game: { propDefinition: [twitch, "game"], optional: true },
    broadcaster: {
      propDefinition: [twitch, "broadcaster"],
      type: "string",
      optional: true,
    },
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
    if (!this.game && !this.broadcaster) {
      console.log("Game or user have to be specified");
      return;
    }

    const params = {};

    if (this.game) {
      const { data: gameData } = await this.twitch.getGames([this.game]);
      if (gameData.length == 0) {
        console.log(`No game found with the name ${this.game}`);
        return;
      }

      params.game_id = gameData[0].id;
    }

    if (this.broadcaster) {
      const { data: broadcasterData } = await this.twitch.getUsers([this.broadcaster]);
      if (broadcasterData.length == 0) {
        console.log(`No user found with the name ${this.broadcaster}`);
        return;
      }

      params.broadcaster_id = broadcasterData[0].id;
    }

    // get and emit new clips of the specified game/streamer
    params.started_at = this.getLastEvent(this.db.get("lastEvent"));

    const clips = await this.paginate(
      this.twitch.getClips.bind(this),
      params,
      this.max
    );
    for await (const clip of clips) {
      this.$emit(clip, this.getMeta(clip));
    }

    this.db.set("lastEvent", Date.now());
  },
};
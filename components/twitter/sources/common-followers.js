const twitter = require("../twitter.app");

module.exports = {
  props: {
    db: "$.service.db",
    twitter,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  hooks: {
    async activate() {
      await this.updateFollowersCache();
    },
  },
  deactivate() {
    this.db.set("followers", null);
  },
  methods: {
    getScreenName() {
      // When screen name is not explicitly provided, the Twitter API defaults
      // it to the user making the API request
      return undefined;
    },
    getRelevantIds() {
      return [];
    },
    generateMeta(data) {
      const {
        timestamp,
        user,
      } = data;
      const {
        id_str: id,
        screen_name: summary,
      } = user;
      // Event timestamp is expressed in seconds, whereas Javascript timestamps
      // are expressed in milliseconds
      const ts = timestamp * 1000;
      return {
        id,
        summary,
        ts,
      };
    },
    async updateFollowersCache() {
      const screenName = this.getScreenName();
      const followerIdsGen = this.twitter.getAllFollowers(screenName);
      const result = [];
      for await (const id of followerIdsGen) {
        result.push(id);
      }

      this.db.set("followers", result);
      console.log(`
        Provisioned followers cache: found ${result.length} records
      `);

      return result;
    },
    async getNewFollowers() {
      const prevFollowers = this.db.get("followers");
      const currFollowers = await this.updateFollowersCache();
      const prevFollowersSet = new Set(prevFollowers);
      return currFollowers.filter(cf => !prevFollowersSet.has(cf));
    },
    async getUnfollowers() {
      const prevFollowers = this.db.get("followers");
      const currFollowers = await this.updateFollowersCache();
      const currFollowersSet = new Set(currFollowers);
      return prevFollowers.filter(pf => !currFollowersSet.has(pf));
    },
  },
  async run(event) {
    const { timestamp } = event;
    const relevantIds = await this.getRelevantIds();
    if (relevantIds.length <= 0) {
      console.log(`
        No changes in followers data for this event source to emit a new event
      `);
      return;
    }

    const users = await this.twitter.lookupUsers(relevantIds);
    users.forEach(user => {
      const data = {
        timestamp,
        user,
      };
      const meta = this.generateMeta(data);
      this.$emit(user, meta);
    });
  },
}

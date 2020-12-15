const twitter = require("../twitter.app");

module.exports = {
  dedupe: "unique",
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
      const followers = this.db.get("followers") || [];
      if (followers.length > 0) {
        console.log(`
          Followers cache already set. Skipping initial provisioning.
        `);
        return;
      }

      const screenName = this.getScreenName();
      const followerIds = this.twitter.getAllFollowers(screenName);
      for await (const id of followerIds) {
        followers.push(id);
      }
      this.db.set("followers", followers);
      console.log(`
        Provisioned followers cache: found ${followers.length} records
      `);
    },
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
    async pullFollowers() {
      const screenName = this.getScreenName();
      const followerIdsGen = this.twitter.getAllFollowers(screenName);
      const result = [];
      for await (const id of followerIdsGen) {
        result.push(id);
      }
      return result;
    },
    async getUnfollowers() {
      const prevFollowers = this.db.get("followers");
      const currFollowers = await this.pullFollowers();
      this.db.set("followers", currFollowers);

      const currFollowersSet = new Set(currFollowers);
      return prevFollowers.filter(pf => !currFollowersSet.has(pf));
    },
  },
  async run(event) {
    const { timestamp } = event;
    const relevantIds = await this.getRelevantIds();
    if (relevantIds.length <= 0) {
      console.log('Follower data remains unchanged');
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

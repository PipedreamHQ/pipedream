// FaunaDB app file
const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  type: "app",
  app: "faunadb",
  methods: {
    // Fetches events (changes) for all documents in a collection
    // made after a specific epoch timestamp
    getClient() {
      return new faunadb.Client({ secret: this.$auth.secret });
    },
    async getCollections() {
      const client = this.getClient();

      const collections = [];
      const collectionsPaginator = await client.paginate(q.Collections());

      await collectionsPaginator.each((page) => {
        for (const collection of page) {
          collections.push(collection.id);
        }
      });

      return collections;
    },
    async getEventsInCollectionAfterTs(collection, ts) {
      const client = this.getClient();

      // Fetch pages of all changes (events) for a particular collection
      // since the given ts cursor. See docs on Events / Pagination
      // https://docs.fauna.com/fauna/current/api/fql/functions/events
      // https://docs.fauna.com/fauna/current/api/fql/functions/paginate
      const paginationHelper = await client.paginate(
        q.Documents(q.Collection(collection)),
        { after: ts, events: true }
      );

      const events = [];
      await paginationHelper.each((page) => {
        for (const event of page) {
          this.events.push(event);
        }
      });

      return events;
    },
  },
};

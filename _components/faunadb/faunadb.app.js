// FaunaDB app file
const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  type: "app",
  app: "faunadb",
  propDefinitions: {
    collection: {
      type: "string",
      label: "Collection",
      description: "The collection you'd like to watch for changes",
      async options() {
        return await this.getCollections();
      },
    },
  },
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
          collections.push({
            label: collection.id,
            value: collection.id,
          });
        }
      });

      return collections;
    },
    async getEventsInCollectionAfterTs(collection, after) {
      const client = this.getClient();

      // Fetch pages of all changes (events) for a particular collection
      // since the given timestamp cursor. See docs on Events / Pagination
      // https://docs.fauna.com/fauna/current/api/fql/functions/events
      // https://docs.fauna.com/fauna/current/api/fql/functions/paginate
      const paginationHelper = await client.paginate(
        q.Documents(q.Collection(collection)),
        { after, events: true }
      );

      const events = [];
      await paginationHelper.each((page) => {
        for (const event of page) {
          events.push(event);
        }
      });

      return events;
    },
  },
};

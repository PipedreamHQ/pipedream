// legacy_hash_id: a_poizPB
import faunadb from "faunadb";

export default {
  key: "faunadb-read-from-collection",
  name: "Read From FaunaDB Collection",
  description: "Reads all documents from given FaunaDB collection",
  version: "0.4.1",
  type: "action",
  props: {
    faunadb: {
      type: "app",
      app: "faunadb",
    },
    collectionName: {
      type: "string",
    },
    documentField: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const q = faunadb.query;

    const client = new faunadb.Client({
      secret: this.faunadb.$auth.secret,
    });
    // Lists collections in the database tied to your secret key
    try {
      let { data } = await client.query(
        q.Map(q.Paginate(q.Documents(q.Collection(this.collectionName))), q.Lambda("i", q.Get(q.Var("i")))),
      );

      if ("documentField" in this) {
        data = data.map((x) => x.data[this.documentField]);
      }
      $.export("documents", data);
    } catch (error) {
      console.error(error.message);
    }
  },
};

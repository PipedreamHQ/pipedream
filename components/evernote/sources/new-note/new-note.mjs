import { LIMIT } from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "evernote-new-note",
  name: "New Note Created",
  description: "Emit new event when a note is created in Evernote.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New note created: ${item.title || item.guid}`;
    },
    async getData(lastData) {
      const responseArray = [];
      let hasMore = true;
      let page = 0;

      do {
        const { notes } = await this.evernote.listNotes({
          offset: LIMIT * page,
          maxNotes: LIMIT,
        });
        for (const note of notes) {
          if (note.created <= lastData) break;
          responseArray.push(note);
        }
        page++;
        hasMore = notes.length;
      } while (hasMore);

      return responseArray;
    },
    prepareResults(results, maxResults) {
      if (results.length) {
        if (maxResults && (results.length > maxResults)) {
          results.length = maxResults;
        }
      }
      return results.reverse();
    },
    lastData(results) {
      return results.map((item) => item.guid);
    },
  },
  sampleEmit,
};

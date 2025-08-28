import {
  DEFAULT_LIMIT, OBJECT_TYPES,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-note",
  name: "New Note Created",
  description: "Emit new event for each new note created. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/engagements/notes#get-%2Fcrm%2Fv3%2Fobjects%2Fnotes)",
  version: "1.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTs(note) {
      return Date.parse(note.createdAt);
    },
    generateMeta(note) {
      return {
        id: note.id,
        summary: `New Note: ${note.properties.hs_body_preview || note.id}`,
        ts: this.getTs(note),
      };
    },
    isRelevant(note, createdAfter) {
      return this.getTs(note) > createdAfter;
    },
    async getParams() {
      const { results: allProperties } = await this.hubspot.getProperties({
        objectType: "notes",
      });
      const properties = allProperties.map(({ name }) => name);

      const objectTypes = OBJECT_TYPES.map(({ value }) => value);
      const { results: custom } = await this.hubspot.listSchemas();
      const customObjects = custom?.map(({ fullyQualifiedName }) => fullyQualifiedName);
      const associations = [
        ...objectTypes,
        ...customObjects,
      ];

      return {
        params: {
          limit: DEFAULT_LIMIT,
          properties: properties.join(","),
          associations: associations.join(","),
        },
      };
    },
    async processResults(after, params) {
      const notes = await this.getPaginatedItems(this.hubspot.listNotes.bind(this), params);
      await this.processEvents(notes, after);
    },
  },
};

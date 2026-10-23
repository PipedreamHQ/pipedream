import base from "../common/base.mjs";

export default {
  ...base,
  key: "jsonify-new-rows-in-dataset",
  name: "New Rows in Dataset",
  description: "Emit new event for each row that appears in a Jsonify dataset. Rows are identified by `_row_id`. [See the documentation](https://www.jsonify.com/docs/datasets/query-and-export)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    columns: {
      propDefinition: [
        base.props.jsonify,
        "columns",
      ],
    },
    filters: {
      propDefinition: [
        base.props.jsonify,
        "filters",
      ],
    },
    emitExisting: {
      type: "boolean",
      label: "Emit Existing Rows on Deploy",
      description: "Emit up to 25 rows already in the dataset when the source is first deployed. Later runs only emit rows that were not present before.",
      default: true,
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const head = await this.getHead();
      this._setLastVersion(head.version);
      const ids = new Set();
      for await (const {
        row, page,
      } of this.jsonify.paginate({
        serveUrl: this.serveUrl,
        columns: this.columnsWithRowId(),
        filters: this.filters,
        version: head.version,
      })) {
        ids.add(row._row_id);
        if (this.emitExisting && ids.size <= 25) {
          this.$emit(row, this.generateMeta(row, page));
        }
      }
      this._setSeenIds(ids);
    },
  },
  methods: {
    ...base.methods,
    columnsWithRowId() {
      if (!this.columns?.length) {
        return undefined;
      }
      return this.columns.includes("_row_id")
        ? this.columns
        : [
          "_row_id",
          ...this.columns,
        ];
    },
    generateMeta(row, page) {
      return {
        id: row._row_id,
        summary: `${page.dataset_name}: ${row._row_id}`,
        ts: Math.round((page.updated_at || Date.now() / 1000) * 1000),
      };
    },
  },
  async run() {
    const head = await this.getHead();
    const last = this._getLastVersion();
    if (last !== undefined && last !== null && head.version <= last) {
      return;
    }
    const seen = new Set(this._getSeenIds());
    const ids = new Set();
    for await (const {
      row, page,
    } of this.jsonify.paginate({
      serveUrl: this.serveUrl,
      columns: this.columnsWithRowId(),
      filters: this.filters,
      version: head.version,
    })) {
      ids.add(row._row_id);
      if (!seen.has(row._row_id)) {
        this.$emit(row, this.generateMeta(row, page));
      }
    }
    this._setSeenIds(ids);
    this._setLastVersion(head.version);
  },
};

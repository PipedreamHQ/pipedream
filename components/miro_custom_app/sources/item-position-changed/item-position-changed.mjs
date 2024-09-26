import common from "../common/base.mjs";

export default {
  ...common,
  key: "miro_custom_app-item-position-changed",
  name: "Item Position Changed",
  description: "Emit new event when an item's position changes in a Miro Custom App.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    teamId: {
      propDefinition: [
        common.props.miro,
        "teamId",
      ],
    },
    boardId: {
      propDefinition: [
        common.props.miro,
        "boardId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    _getPositions() {
      return this.db.get("positions") || {};
    },
    _setPositions(positions) {
      this.db.set("positions", positions);
    },
    generateMeta(item) {
      const ts = Date.parse(item.modifiedAt);
      return {
        id: `${item.id}-${ts}`,
        summary: `Item ${item.id} position changed`,
        ts,
      };
    },
  },
  async run() {
    const positions = this._getPositions();
    const newPositions = {};
    const items = this.paginate({
      resourceFn: this.miro.listItems,
      args: {
        boardId: this.boardId,
      },
    });
    for await (const item of items) {
      const position = JSON.stringify(item.position);
      if (positions[item.id] && positions[item.id] !== position) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
      newPositions[item.id] = position;
    }

    this._setPositions(newPositions);
  },
};

import drata from "../../drata.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/AssetsPublicController_listAssetss/";

export default {
  key: "drata-new-asset-added",
  name: "New Asset Added",
  description: `Emit a new event for every new asset. [See the documentation](${docsLink}).`,
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    drata,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const response = await this.drata.listAssets({
        params: {
          limit: constants.DEPLOY_LIMIT,
          sort: constants.SORT_CRITERIA.CREATED,
          sortDir: "DESC",
        },
      });

      this._setLastId(response.data[0].id);
      for (const asset of response.data.reverse()) {
        this.$emit(asset, {
          id: asset.id,
          summary: `Historical asset: ${asset.name}`,
          ts: asset.createdAt,
        });
      }
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
  },
  async run() {
    const lastId = this._getLastId();
    const assets = [];
    let page = 1;

    while (true) {
      const response = await this.drata.listAssets({
        params: {
          limit: constants.PAGINATION_LIMIT,
          sort: constants.SORT_CRITERIA.CREATED,
          sortDir: "DESC",
          page: page++,
        },
      });

      for (const asset of response.data) {
        if (asset.id <= lastId) {
          if (assets.length) {
            this._setLastId(assets[assets.length - 1].id);
            for (const asset of assets) {
              this.$emit(asset, {
                id: asset.id,
                summary: `New asset added: ${asset.name}`,
                ts: asset.createdAt,
              });
            }
          }
          return;
        }

        assets.unshift(asset);
      }
    }
  },
};

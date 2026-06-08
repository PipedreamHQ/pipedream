import { ConfigurationError } from "@pipedream/platform";
import app from "../../youtube_analytics_api.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    dimensions: {
      propDefinition: [
        app,
        "dimensions",
      ],
    },
    sort: {
      propDefinition: [
        app,
        "sort",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    idType: {
      type: "string",
      label: "ID Type",
      description:
        "The type of ID to use for the query. This can be either `My Channel`, `Channel ID`, or `Content Owner`.",
      options: Object.values(constants.ID_TYPE),
      default: constants.ID_TYPE.CHANNEL.value,
    },
    ids: {
      type: "string",
      label: "Channel ID OR Content Owner Name",
      description:
        "Required when **ID Type** is `Channel ID` or `Content Owner`. Unused when **ID Type** is `My Channel`.",
      optional: true,
    },
  },
  methods: {
    validateIds() {
      const {
        idType, ids,
      } = this;
      const {
        CHANNEL_ID, CONTENT_OWNER,
      } = constants.ID_TYPE;

      if (idType === CHANNEL_ID.value && !ids) {
        throw new ConfigurationError(
          "**Channel ID** is required when **ID Type** is `Channel ID`.",
        );
      }
      if (idType === CONTENT_OWNER.value && !ids) {
        throw new ConfigurationError(
          "**Content Owner Name** is required when **ID Type** is `Content Owner`.",
        );
      }
    },
    getIdsParam() {
      const {
        idType, ids,
      } = this;
      if (idType === constants.ID_TYPE.CHANNEL.value) {
        return "channel==MINE";
      }
      if (idType === constants.ID_TYPE.CONTENT_OWNER.value) {
        return `contentOwner==${ids}`;
      }
      if (idType === constants.ID_TYPE.CHANNEL_ID.value) {
        return `channel==${ids}`;
      }
    },
    getFiltersParam() {
      const { filters } = this;
      const filtersObj = utils.parseJson(filters);

      if (!filtersObj) {
        return;
      }

      return utils.arrayToCommaSeparatedList(
        Object.entries(filtersObj).reduce(
          (acc, [
            key,
            val,
          ]) => [
            ...acc,
            `${key}==${val}`,
          ],
          [],
        ),
        ";",
      );
    },
  },
};

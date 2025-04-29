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
      reloadProps: true,
    },
    ids: {
      type: "string",
      label: "Channel ID OR Content Owner Name",
      description:
        "The use of this property depends on the value of the `idType` prop.  If `idType` is set to `MINE`, then this property is unused. If `idType` is set to `channelId`, then this property is used to specify the Channel ID for this action. If `idType` is set to `contentOwner`, then this property is used to specify the Content Owner Name for this action.",
      optional: true,
      hidden: true,
    },
  },
  methods: {
    getIdsProps() {
      const { idType } = this;

      if (idType === constants.ID_TYPE.CONTENT_OWNER.value) {
        return {
          ids: {
            type: "string",
            label: "Content Owner Name",
            description:
              "The content owner name for the user. Eg. `MyContentOwnerName`.",
            optional: false,
            hidden: false,
          },
        };
      }
      if (idType === constants.ID_TYPE.CHANNEL_ID.value) {
        return {
          ids: {
            type: "string",
            label: "Channel ID",
            description:
              "The channel ID for the user. Eg. `UC_x5XG1OV2P6uZZ5FSM9Ttw`. You can find the ID using the [YouTube Data API](https://developers.google.com/youtube/v3/docs/channels/list).",
            optional: false,
            hidden: false,
          },
        };
      }
      return {};
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

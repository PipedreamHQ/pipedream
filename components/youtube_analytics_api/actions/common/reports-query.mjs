import app from "../../youtube_analytics_api.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  props: {
    app,
    reloader: {
      type: "boolean",
      label: "Hidden Reloader",
      description: "This prop is used to reload the props when the step gets created.",
      hidden: true,
      reloadProps: true,
    },
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
  },
  methods: {
    getIdsProps() {
      const { idType } = this;

      if (idType === constants.ID_TYPE.CHANNEL.value) {
        return {
          idType: propsFragments.idType,
        };
      }

      if (idType === constants.ID_TYPE.CONTENT_OWNER.value) {
        return {
          idType: propsFragments.idType,
          ids: {
            type: "string",
            label: "Content Owner Name",
            description: "The content owner name for the user. Eg. `MyContentOwnerName`.",
          },
        };
      }

      if (idType === constants.ID_TYPE.CHANNEL_ID.value) {
        return {
          idType: propsFragments.idType,
          ids: {
            type: "string",
            label: "Channel ID",
            description: "The channel ID for the user. Eg. `UC_x5XG1OV2P6uZZ5FSM9Ttw`. You can find the ID using the [YouTube Data API](https://developers.google.com/youtube/v3/docs/channels/list).",
          },
        };
      }

      return {
        idType: propsFragments.idType,
      };
    },
    getIdsParam() {
      const {
        idType,
        ids,
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
        Object.entries(filtersObj)
          .reduce((acc, [
            key,
            val,
          ]) => [
            ...acc,
            `${key}==${val}`,
          ], []),
        ";",
      );
    },
  },
};

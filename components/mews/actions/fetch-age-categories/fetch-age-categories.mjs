import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Fetch Age Categories",
  description: "Retrieve all age categories filtered by service. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/agecategories#get-all-age-categories)",
  key: "mews-fetch-age-categories",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    enterpriseIds: {
      propDefinition: [
        app,
        "enterpriseIds",
      ],
    },
    ageCategoryIds: {
      type: "string[]",
      label: "Age Category IDs",
      description: "Unique identifiers of Age categories. Max 1000 items.",
      optional: true,
    },
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "Unique identifiers of Service associated with the age categories. If not provided, defaults to all bookable services. Max 1000 items.",
      propDefinition: [
        app,
        "serviceId",
      ],
      optional: true,
    },
    updatedStartUtc: {
      propDefinition: [
        app,
        "updatedStartUtc",
      ],
    },
    updatedEndUtc: {
      propDefinition: [
        app,
        "updatedEndUtc",
      ],
    },
    activityStates: {
      propDefinition: [
        app,
        "activityStates",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      enterpriseIds,
      ageCategoryIds,
      serviceIds,
      updatedStartUtc,
      updatedEndUtc,
      activityStates,
    } = this;

    const items = await app.paginate({
      requester: app.ageCategoriesGetAll,
      requesterArgs: {
        $,
        data: {
          EnterpriseIds: utils.parseArray(enterpriseIds),
          AgeCategoryIds: utils.parseArray(ageCategoryIds),
          ServiceIds: utils.parseArray(serviceIds),
          ...(updatedStartUtc && updatedEndUtc
            ? {
              UpdatedUtc: {
                StartUtc: updatedStartUtc,
                EndUtc: updatedEndUtc,
              },
            }
            : undefined
          ),
          ActivityStates: activityStates,
        },
      },
      resultKey: "AgeCategories",
    });

    $.export("summary", "Successfully fetched age categories");
    return items;
  },
};

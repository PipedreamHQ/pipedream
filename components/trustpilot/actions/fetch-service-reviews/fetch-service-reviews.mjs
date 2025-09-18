import trustpilot from "../../trustpilot.app.mjs";

export default {
  key: "trustpilot-fetch-service-reviews",
  name: "Fetch Service Reviews",
  description: "Get private reviews for a business unit. Response includes customer email and order ID. [See the documentation](https://developers.trustpilot.com/business-units-api#get-private-reviews-for-business-unit)",
  version: "0.1.0",
  type: "action",
  props: {
    trustpilot,
    businessUnitId: {
      propDefinition: [
        trustpilot,
        "businessUnitId",
      ],
    },
    language: {
      propDefinition: [
        trustpilot,
        "language",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page to retrieve. If the page number requested is higher than the available number of pages, an empty array will be returned.",
      min: 1,
      default: 1,
      optional: true,
    },
    stars: {
      type: "string",
      label: "Star Rating",
      description: "Filter by reviews with a specific star rating. 1-5, separated by commas.",
      optional: true,
    },
    internalLocationId: {
      type: "string",
      label: "Internal Location ID",
      description: "Filter by reviews with a specific location",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "The number of reviews to retrieve per page",
      min: 1,
      max: 100,
      default: 20,
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "The order in which the results should be sorted",
      options: [
        {
          label: "Created At (Ascending)",
          value: "createdat.asc",
        },
        {
          label: "Created At (Descending)",
          value: "createdat.desc",
        },
        {
          label: "Stars (Ascending)",
          value: "stars.asc",
        },
        {
          label: "Stars (Descending)",
          value: "stars.desc",
        },
      ],
      default: "createdat.desc",
      optional: true,
    },
    tagGroup: {
      type: "string",
      label: "Tag Group",
      description: "Filtering reviews on Tag group",
      optional: true,
    },
    tagValue: {
      type: "string",
      label: "Tag Value",
      description: "Filtering reviews on Tag value",
      optional: true,
    },
    ignoreTagValueCase: {
      type: "boolean",
      label: "Ignore Tag Value Case",
      description: "Ignore tag value case",
      default: false,
      optional: true,
    },
    responded: {
      type: "boolean",
      label: "Responded",
      description: "Filter reviews by responded state",
      optional: true,
    },
    referenceId: {
      type: "string",
      label: "Reference ID",
      description: "Filter reviews by reference Id",
      optional: true,
    },
    referralEmail: {
      type: "string",
      label: "Referral Email",
      description: "Filter reviews by referral email",
      optional: true,
    },
    reported: {
      type: "boolean",
      label: "Reported",
      description: "Filter reviews by reported state",
      optional: true,
    },
    startDateTime: {
      type: "string",
      label: "Start Date Time",
      description: "Filter reviews by datetime range. If no time is specified, then time is implicitly `00:00:00`. Format: `2013-09-07T13:37:00`",
      optional: true,
    },
    endDateTime: {
      type: "string",
      label: "End Date Time",
      description: "Filter reviews by datetime range. If no time is specified, then time is implicitly `00:00:00`. Format: `2013-09-07T13:37:00`",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Filter reviews by source",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Filter reviews by user name",
      optional: true,
    },
    findReviewer: {
      type: "string",
      label: "Find Reviewer",
      description: "Filter reviews by Find Reviewer requests (contacted or not contacted)",
      options: [
        "contacted",
        "notContacted",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      businessUnitId,
      stars,
      language,
      page = 1,
      internalLocationId,
      perPage = 20,
      orderBy = "createdat.desc",
      tagGroup,
      tagValue,
      ignoreTagValueCase = false,
      responded,
      referenceId,
      referralEmail,
      reported,
      startDateTime,
      endDateTime,
      source,
      username,
      findReviewer,
    } = this;

    try {
      // Use the shared method from the app
      const result = await this.trustpilot.fetchServiceReviews($, {
        businessUnitId,
        stars,
        language,
        page,
        internalLocationId,
        perPage,
        orderBy,
        tagGroup,
        tagValue,
        ignoreTagValueCase,
        responded,
        referenceId,
        referralEmail,
        reported,
        startDateTime,
        endDateTime,
        source,
        username,
        findReviewer,
      });

      $.export("$summary", `Successfully fetched ${result.reviews.length} service review(s) for business unit ${businessUnitId}`);

      return result;
    } catch (error) {
      throw new Error(`Failed to fetch service reviews: ${error.message}`);
    }
  },
};

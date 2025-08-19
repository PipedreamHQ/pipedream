import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Create Reservation",
  description: "Create a reservation in Mews. See reservation parameters in the docs. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/reservations#add-reservations)",
  key: "mews-create-reservation",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
    },
    startUtc: {
      optional: false,
      propDefinition: [
        app,
        "startUtc",
      ],
    },
    endUtc: {
      optional: false,
      propDefinition: [
        app,
        "endUtc",
      ],
    },
    personCounts: {
      type: "string[]",
      label: "Person Counts",
      description: `Number of people per age category the reservation was booked for. At least one category with valid count must be provided.

**Parameters:**
- **AgeCategoryId** (string, required): Unique identifier of the Age category
- **Count** (integer, required): Number of people of a given age category. Only positive value is accepted

**Example:**
\`\`\`json
[
  {
    "AgeCategoryId": "3ed9e2f3-4bba-4df6-8d41-ab1400b21942",
    "Count": 2
  },
  {
    "AgeCategoryId": "ab7e1cf3-5fda-4cd2-8f41-ab1400b21943",
    "Count": 1
  }
]
\`\`\``,
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    requestedCategoryId: {
      label: "Requested Category ID",
      description: "The category of the resource requested for the reservation.",
      optional: false,
      propDefinition: [
        app,
        "resourceCategoryId",
        ({ serviceId }) => ({
          data: {
            ServiceIds: [
              serviceId,
            ],
          },
        }),
      ],
    },
    rateId: {
      optional: false,
      propDefinition: [
        app,
        "rateId",
        ({ serviceId }) => ({
          data: {
            ServiceIds: [
              serviceId,
            ],
          },
        }),
      ],
    },
    state: {
      optional: true,
      propDefinition: [
        app,
        "state",
      ],
    },
    channelNumber: {
      type: "string",
      label: "Channel Number",
      description: "The number of the channel that made the reservation.",
      optional: true,
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
      optional: true,
    },
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
      optional: true,
    },
    travelAgencyId: {
      label: "Travel Agency ID",
      description: "Identifier of the Travel Agency. (Company with a TravelAgencyContract)",
      propDefinition: [
        app,
        "companyId",
        () => ({
          filter: (company) => {
            return company.NchClassifications?.OnlineTravelAgency === true;
          },
        }),
      ],
      optional: true,
    },
    businessSegmentId: {
      propDefinition: [
        app,
        "businessSegmentId",
      ],
      optional: true,
    },
    additionalFields: {
      propDefinition: [
        app,
        "additionalFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      serviceId,
      channelNumber,
      state,
      startUtc,
      endUtc,
      personCounts,
      customerId,
      requestedCategoryId,
      rateId,
      travelAgencyId,
      companyId,
      businessSegmentId,
      notes,
      additionalFields,
    } = this;

    const response = await app.reservationsCreate({
      $,
      data: {
        ServiceId: serviceId,
        Reservations: [
          {
            ChannelNumber: channelNumber,
            State: state,
            StartUtc: startUtc,
            EndUtc: endUtc,
            PersonCounts: utils.parseArray(personCounts),
            CustomerId: customerId,
            RequestedCategoryId: requestedCategoryId,
            RateId: rateId,
            TravelAgencyId: travelAgencyId,
            CompanyId: companyId,
            BusinessSegmentId: businessSegmentId,
            Notes: notes,
            ...(additionalFields && {
              ...utils.parseJson(additionalFields),
            }),
          },
        ],
      },
    });

    $.export("$summary", "Successfully created reservation");
    return response;
  },
};

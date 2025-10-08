import app from "../../mews.app.mjs";

export default {
  name: "Create Availability Block",
  description: "Create an availability block in Mews. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/availabilityblocks#add-availability-blocks)",
  key: "mews-create-availability-block",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      description: "Unique identifier of the Service to assign block to.",
    },
    rateId: {
      optional: false,
      propDefinition: [
        app,
        "rateId",
      ],
      description: "Unique identifier of the Rate to assign block to.",
    },
    firstTimeUnitStartUtc: {
      type: "string",
      label: "First Time Unit Start (UTC)",
      description: "Start of the time interval, expressed as the timestamp for the start of the first time unit, in UTC timezone ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
    },
    lastTimeUnitStartUtc: {
      type: "string",
      label: "Last Time Unit Start (UTC)",
      description: "End of the time interval, expressed as the timestamp for the start of the first time unit, in UTC timezone ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the availability block.",
      options: [
        "Confirmed",
        "Optional",
        "Inquired",
        "Canceled",
      ],
    },
    releasedUtc: {
      type: "string",
      label: "Released (UTC)",
      description: "The moment when the block and its availability is released, in UTC timezone ISO 8601 format. Takes precedence over RollingReleaseOffset. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the block.",
      optional: true,
    },
    bookerId: {
      type: "string",
      label: "Booker ID",
      description: "Unique identifier of the Booker as a creator of an availability block.",
      optional: true,
      propDefinition: [
        app,
        "customerId",
      ],
    },
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
      description: "Unique identifier of Company.",
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
    budgetCurrency: {
      propDefinition: [
        app,
        "currency",
      ],
      description: "Currency of the budget.",
    },
    budgetValue: {
      type: "string",
      label: "Budget Value",
      description: "The value of the budget.",
      optional: true,
    },
    reservationPurpose: {
      type: "string",
      label: "Reservation Purpose",
      description: "The purpose of the block.",
      optional: true,
      options: [
        "Business",
        "Leisure",
        "Student",
      ],
    },
    externalIdentifier: {
      type: "string",
      label: "External Identifier",
      description: "Identifier of the block from external system. Max length 255 characters.",
      optional: true,
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
      description: "Additional notes of the block.",
      optional: true,
    },
    quoteId: {
      type: "string",
      label: "Quote ID",
      description: "Unique identifier of the Mews Events quote associated with the availability block.",
      optional: true,
    },
    purchaseOrderNumber: {
      type: "string",
      label: "Purchase Order Number",
      description: "Unique number of the purchase order. This number is propagated to any newly picked up Reservation within the block.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      serviceId,
      rateId,
      firstTimeUnitStartUtc,
      lastTimeUnitStartUtc,
      state,
      releasedUtc,
      name,
      bookerId,
      companyId,
      travelAgencyId,
      budgetCurrency,
      budgetValue,
      reservationPurpose,
      externalIdentifier,
      notes,
      quoteId,
      purchaseOrderNumber,
    } = this;

    const response = await app.availabilityBlocksCreate({
      $,
      data: {
        AvailabilityBlocks: [
          {
            ServiceId: serviceId,
            RateId: rateId,
            FirstTimeUnitStartUtc: firstTimeUnitStartUtc,
            LastTimeUnitStartUtc: lastTimeUnitStartUtc,
            State: state,
            ReleasedUtc: releasedUtc,
            Name: name,
            BookerId: bookerId,
            CompanyId: companyId,
            TravelAgencyId: travelAgencyId,
            ReservationPurpose: reservationPurpose,
            ExternalIdentifier: externalIdentifier,
            Notes: notes,
            QuoteId: quoteId,
            PurchaseOrderNumber: purchaseOrderNumber,
            ...(budgetValue && {
              Budget: {
                Currency: budgetCurrency,
                Value: parseFloat(budgetValue),
              },
            }),
          },
        ],
      },
    });

    $.export("$summary", "Successfully created availability block");
    return response;
  },
};

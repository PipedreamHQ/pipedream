import { ConfigurationError } from "@pipedream/platform";
import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Update Reservation",
  description: "Update an existing reservation in Mews. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/reservations#update-reservations)",
  key: "mews-update-reservation",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    reason: {
      type: "string",
      label: "Reason",
      description: "Reason for updating the reservation. Required when updating the price of the reservation.",
      optional: true,
    },
    reprice: {
      type: "boolean",
      label: "Reprice",
      description: "Whether the price should be updated to latest value for date/rate/category combination set in Mews. If not specified, the reservation price is updated.",
      optional: true,
    },
    applyCancellationFee: {
      type: "boolean",
      label: "Apply Cancellation Fee",
      description: "Whether the cancellation fees should be applied according to rate cancellation policies. If not specified, the cancellation fees are applied.",
      optional: true,
    },
    reservationId: {
      propDefinition: [
        app,
        "reservationId",
      ],
      description: "Unique identifier of the reservation.",
    },
    channelNumber: {
      type: "string",
      label: "Channel Number",
      description: "Number of the reservation within the Channel (i.e. OTA, GDS, CRS, etc) in case the reservation group originates there (e.g. Booking.com confirmation number)",
      optional: true,
    },
    startUtc: {
      type: "string",
      label: "Start UTC",
      description: "Reservation start in UTC timezone in ISO 8601 format",
      optional: true,
    },
    endUtc: {
      type: "string",
      label: "End UTC",
      description: "Reservation end in UTC timezone in ISO 8601 format",
      optional: true,
    },
    releasedUtc: {
      type: "string",
      label: "Released UTC",
      description: "Date when the optional reservation is released in UTC timezone in ISO 8601 format",
      optional: true,
    },
    personCounts: {
      type: "string[]",
      label: "Person Counts",
      description: `Number of people per age category the reservation is for. If supplied, the person counts will be replaced. Each item should contain:
- \`AgeCategoryId\` (string, required): Unique identifier of the Age category
- \`Count\` (integer, required): Number of people of a given age category. Only positive value is accepted

Pass an array of person counts or null if the person counts should not be updated.

**Example:**
\`\`\`json
[
  {
    "AgeCategoryId": "12345678-1234-1234-1234-123456789012",
    "Count": 2
  },
  {
    "AgeCategoryId": "87654321-4321-4321-4321-210987654321",
    "Count": 1
  }
]
\`\`\``,
      optional: true,
    },
    assignedResourceId: {
      type: "string",
      label: "Assigned Resource ID",
      description: "Identifier of the assigned Resource. If the assigned resource is locked, see AssignedResourceLocked for updating the assigned resource.",
      optional: true,
    },
    requestedCategoryId: {
      type: "string",
      label: "Requested Category ID",
      description: "Identifier of the requested ResourceCategory",
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
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
      description: "Unique identifier of Company.",
      optional: true,
    },
    businessSegmentId: {
      propDefinition: [
        app,
        "businessSegmentId",
      ],
      description: "Unique identifier of BusinessSegment.",
      optional: true,
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "Purpose of the reservation",
      optional: true,
    },
    rateId: {
      propDefinition: [
        app,
        "rateId",
      ],
    },
    creditCardId: {
      propDefinition: [
        app,
        "creditCardId",
      ],
    },
    timeUnitPrices: {
      type: "string[]",
      label: "Time Unit Prices",
      description: `Prices for time units of the reservation. Each unit should contain:
- \`Index\` (integer, required): Index of the unit starting with 0 (e.g., first night has index 0)
- \`Amount\` (object, optional): Amount parameters including:
  - \`GrossValue\` (decimal, optional): Amount including tax (required for Gross Pricing environments)
  - \`NetValue\` (decimal, optional): Amount excluding tax (required for Net Pricing environments)
  - \`Currency\` (string, required): \`ISO-4217\` code of the currency
  - \`TaxCodes\` (array of strings, required): Codes of tax rates to be applied (note: only one tax when using \`GrossValue\`, multiple taxes with \`NetValue\`)

Pass an array of price units or null if the unit amounts should not be updated.

**Example:**
\`\`\`json
[
  {
    "Index": 0,
    "Amount": {
      "GrossValue": 100.00,
      "Currency": "EUR",
      "TaxCodes": ["VAT"]
    }
  },
  {
    "Index": 1,
    "Amount": {
      "NetValue": 85.00,
      "Currency": "EUR",
      "TaxCodes": ["VAT", "CityTax"]
    }
  }
]
\`\`\``,
      optional: true,
    },
    bookerId: {
      label: "Booker ID",
      description: "Identifier of the Customer on whose behalf the reservation was made.",
      propDefinition: [
        app,
        "customerId",
      ],
    },
    assignedResourceLocked: {
      type: "boolean",
      label: "Assigned Resource Locked",
      description: "Whether the reservation should be locked to the assigned Resource. To reassign the reservation to a new Resource, first set AssignedResourceLocked to false to unlock the resource. Then, assign the reservation to a new Resource by setting AssignedResourceId to the new resource ID.",
      optional: true,
    },
    availabilityBlockId: {
      propDefinition: [
        app,
        "availabilityBlockId",
      ],
    },
    optionsOwnerCheckedIn: {
      type: "boolean",
      label: "Options Owner Checked In",
      description: "Whether the owner of the reservation has checked in.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      reason,
      reprice,
      applyCancellationFee,
      reservationId,
      channelNumber,
      startUtc,
      endUtc,
      releasedUtc,
      personCounts,
      assignedResourceId,
      requestedCategoryId,
      travelAgencyId,
      companyId,
      businessSegmentId,
      purpose,
      rateId,
      creditCardId,
      timeUnitPrices,
      bookerId,
      assignedResourceLocked,
      availabilityBlockId,
      optionsOwnerCheckedIn,
    } = this;

    // Parse arrays
    const parsedPersonCounts = personCounts
      ? utils.parseArray(personCounts)
      : undefined;
    const parsedTimeUnitPrices = timeUnitPrices
      ? utils.parseArray(timeUnitPrices)
      : undefined;

    // Validate arrays
    if (parsedPersonCounts && !Array.isArray(parsedPersonCounts)) {
      throw new ConfigurationError("**Person Counts** must be an array when provided");
    }

    if (parsedTimeUnitPrices && !Array.isArray(parsedTimeUnitPrices)) {
      throw new ConfigurationError("**Time Unit Prices** must be an array when provided");
    }

    const response = await app.reservationsUpdate({
      $,
      data: {
        Reason: reason,
        Reprice: reprice,
        ApplyCancellationFee: applyCancellationFee,
        ReservationUpdates: [
          {
            ReservationId: reservationId,
            ...(channelNumber && {
              ChannelNumber: {
                Value: channelNumber,
              },
            }),
            ...(startUtc && {
              StartUtc: {
                Value: startUtc,
              },
            }),
            ...(endUtc && {
              EndUtc: {
                Value: endUtc,
              },
            }),
            ...(releasedUtc && {
              ReleasedUtc: {
                Value: releasedUtc,
              },
            }),
            ...(parsedPersonCounts && {
              PersonCounts: {
                Value: parsedPersonCounts,
              },
            }),
            ...(assignedResourceId && {
              AssignedResourceId: {
                Value: assignedResourceId,
              },
            }),
            ...(requestedCategoryId && {
              RequestedCategoryId: {
                Value: requestedCategoryId,
              },
            }),
            ...(travelAgencyId && {
              TravelAgencyId: {
                Value: travelAgencyId,
              },
            }),
            ...(companyId && {
              CompanyId: {
                Value: companyId,
              },
            }),
            ...(businessSegmentId && {
              BusinessSegmentId: {
                Value: businessSegmentId,
              },
            }),
            ...(purpose && {
              Purpose: {
                Value: purpose,
              },
            }),
            ...(rateId && {
              RateId: {
                Value: rateId,
              },
            }),
            ...(creditCardId && {
              CreditCardId: {
                Value: creditCardId,
              },
            }),
            ...(parsedTimeUnitPrices && {
              TimeUnitPrices: {
                Value: parsedTimeUnitPrices,
              },
            }),
            ...(bookerId && {
              BookerId: {
                Value: bookerId,
              },
            }),
            ...(assignedResourceLocked !== undefined && {
              AssignedResourceLocked: {
                Value: assignedResourceLocked,
              },
            }),
            ...(availabilityBlockId && {
              AvailabilityBlockId: {
                Value: availabilityBlockId,
              },
            }),
            ...(optionsOwnerCheckedIn !== undefined && {
              Options: {
                OwnerCheckedIn: {
                  Value: optionsOwnerCheckedIn,
                },
              },
            }),
          },
        ],
      },
    });

    $.export("$summary", `Successfully updated reservation ${reservationId}`);
    return response;
  },
};


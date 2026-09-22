import app from "../../microsoft_bookings.app.mjs";

export default {
  key: "microsoft_bookings-create-service",
  name: "Create Service",
  description: "Creates a new service in a Microsoft Bookings business. [See the documentation](https://learn.microsoft.com/en-us/graph/api/bookingbusiness-post-services?view=graph-rest-1.0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name of the service",
    },
    defaultDuration: {
      type: "string",
      label: "Default Duration",
      description: "The default length of the service in ISO 8601 format (e.g., `PT1H30M` for 1 hour 30 minutes). [See the format documentation](https://en.wikipedia.org/wiki/ISO_8601#Durations)",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A text description for the service",
      optional: true,
    },
    defaultPrice: {
      type: "string",
      label: "Default Price",
      description: "The default monetary price for the service",
      optional: true,
    },
    defaultPriceType: {
      type: "string",
      label: "Default Price Type",
      description: "The default way the service is charged",
      optional: true,
      options: [
        "undefined",
        "fixedPrice",
        "startingAt",
        "hourly",
        "free",
        "priceVaries",
        "callUs",
        "notSet",
      ],
    },
    isLocationOnline: {
      type: "boolean",
      label: "Is Location Online",
      description: "True indicates that the service will be held online",
      optional: true,
    },
    staffMemberIds: {
      type: "string[]",
      label: "Staff Member IDs",
      description: "An array of staff member IDs who can provide this service",
      optional: true,
      propDefinition: [
        app,
        "staffMemberId",
        ({ businessId }) => ({
          businessId,
        }),
      ],
    },
    isHiddenFromCustomers: {
      type: "boolean",
      label: "Hidden From Customers",
      description: "True means this service is not available to customers for booking",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional information about this service",
      optional: true,
    },
    smsNotificationsEnabled: {
      type: "boolean",
      label: "SMS Notifications Enabled",
      description: "True indicates SMS notifications can be sent to the customers for the appointment",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      businessId,
      displayName,
      defaultDuration,
      description,
      defaultPrice,
      defaultPriceType,
      isLocationOnline,
      staffMemberIds,
      isHiddenFromCustomers,
      notes,
      smsNotificationsEnabled,
    } = this;

    const content = {
      "@odata.type": "#microsoft.graph.bookingService",
      displayName,
    };

    if (defaultDuration) content.defaultDuration = defaultDuration;
    if (description) content.description = description;
    if (defaultPrice) content.defaultPrice = parseFloat(defaultPrice);
    if (defaultPriceType) content.defaultPriceType = defaultPriceType;
    if (isLocationOnline !== undefined) content.isLocationOnline = isLocationOnline;
    if (Array.isArray(staffMemberIds) && staffMemberIds?.length > 0) {
      content.staffMemberIds = staffMemberIds;
    }
    if (isHiddenFromCustomers !== undefined) {
      content.isHiddenFromCustomers = isHiddenFromCustomers;
    }
    if (notes) content.notes = notes;
    if (smsNotificationsEnabled !== undefined) {
      content.smsNotificationsEnabled = smsNotificationsEnabled;
    }

    const response = await app.createService({
      businessId,
      content,
    });

    $.export("$summary", `Successfully created service: ${displayName}`);

    return response;
  },
};

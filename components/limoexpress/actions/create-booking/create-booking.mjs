import { PRICE_TYPE_OPTIONS } from "../../common/constants.mjs";
import { throwError } from "../../common/utils.mjs";
import limoexpress from "../../limoexpress.app.mjs";

export default {
  key: "limoexpress-create-booking",
  name: "Create Limo Booking",
  description: "Creates a new limo booking with specified details. [See the documentation](https://api.limoexpress.me/api/docs/v1#/Bookings/createBooking)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    limoexpress,
    bookingTypeId: {
      propDefinition: [
        limoexpress,
        "bookingTypeId",
      ],
    },
    bookingStatusId: {
      propDefinition: [
        limoexpress,
        "bookingStatusId",
      ],
      optional: true,
    },
    fromLocationName: {
      type: "string",
      label: "From Location Name",
      description: "The pickup location name.",
    },
    fromLocationFullAddress: {
      type: "string",
      label: "From Location Full Address",
      description: "The pickup location full address.",
    },
    fromLocationLatitude: {
      type: "string",
      label: "From Location Latitude",
      description: "The pickup location latitude.",
      optional: true,
    },
    fromLocationLongitude: {
      type: "string",
      label: "From Location Longitude",
      description: "The pickup location longitude.",
      optional: true,
    },
    toLocationName: {
      type: "string",
      label: "To Location Name",
      description: "The dropoff location name.",
    },
    toLocationFullAddress: {
      type: "string",
      label: "To Location Full Address",
      description: "The dropoff location full address.",
    },
    toLocationLatitude: {
      type: "string",
      label: "To Location Latitude",
      description: "The dropoff location latitude.",
      optional: true,
    },
    toLocationLongitude: {
      type: "string",
      label: "To Location Longitude",
      description: "The dropoff location longitude.",
      optional: true,
    },
    pickupTime: {
      type: "string",
      label: "Pickup Time",
      description: "The time scheduled for pickup. **Format: YYYY-MM-DD HH:MM:SS**",
    },
    expectedDropOffTime: {
      type: "string",
      label: "Expected Drop Off Time",
      description: "The expected drop off time. **Format: YYYY-MM-DD HH:MM:SS**",
      optional: true,
    },
    expectedComebackTime: {
      type: "string",
      label: "Expected Comeback Time",
      description: "The expected comeback time. **Format: YYYY-MM-DD HH:MM:SS**",
      optional: true,
    },
    vehicleClassId: {
      propDefinition: [
        limoexpress,
        "vehicleClassId",
      ],
      withLabel: true,
      optional: true,
    },
    vehicleId: {
      propDefinition: [
        limoexpress,
        "vehicleId",
        ({ vehicleClassId }) => ({
          vehicleClassId: vehicleClassId.label,
        }),
      ],
      optional: true,
    },
    price: {
      type: "string",
      label: "Price",
      description: "The price of the booking.",
      optional: true,
    },
    priceType: {
      type: "string",
      label: "Price Type",
      description: "The type of price for the booking.",
      options: PRICE_TYPE_OPTIONS,
      optional: true,
    },
    commissionAmount: {
      type: "string",
      label: "Commission Amount",
      description: "The commission amount for the booking.",
      optional: true,
    },
    currencyId: {
      propDefinition: [
        limoexpress,
        "currencyId",
      ],
      optional: true,
    },
    vatPercentage: {
      type: "string",
      label: "VAT Percentage",
      description: "The VAT percentage for the booking.",
      optional: true,
    },
    paymentMethodId: {
      propDefinition: [
        limoexpress,
        "paymentMethodId",
      ],
      optional: true,
    },
    distance: {
      type: "integer",
      label: "Distance",
      description: "Number of kilometers/miles that booking will take.",
      optional: true,
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "Number of hours and minutes that booking will take. **Format: HH:MM**",
      optional: true,
    },
    paid: {
      type: "boolean",
      label: "Paid",
      description: "Flag that says is the booking paid or not.",
      optional: true,
    },
    confirmed: {
      type: "boolean",
      label: "Confirmed",
      description: "Flag that says is the booking confirmed or not.",
      optional: true,
    },
    roundTrip: {
      type: "boolean",
      label: "Round Trip",
      description: "Flag that says is the booking a round trip or not.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note for the dispatcher.",
      optional: true,
    },
    noteForDriver: {
      type: "string",
      label: "Note for Driver",
      description: "Note for the driver.",
      optional: true,
    },
    flightNumber: {
      type: "string",
      label: "Flight Number",
      description: "Flight number for the booking.",
      optional: true,
    },
    numOfWaitingHours: {
      type: "integer",
      label: "Number of Waiting Hours",
      description: "Number of waiting hours.",
      optional: true,
    },
    clientId: {
      propDefinition: [
        limoexpress,
        "clientId",
      ],
      optional: true,
    },
    waitingBoardText: {
      type: "string",
      label: "Waiting Board Text",
      description: "Text that will be places on the waiting board.",
      optional: true,
    },
    babySeatCount: {
      type: "integer",
      label: "Baby Seat Count",
      description: "Number of baby seats that will be used for the booking.",
      optional: true,
    },
    suitcaseCount: {
      type: "integer",
      label: "Suitcase Count",
      description: "Number of suitcases that will be used for the booking.",
      optional: true,
    },
    checkpoints: {
      type: "string[]",
      label: "Checkpoints",
      description: "List of objects of checkpoints location and time. **Format: [{\"location\": { \"name\": string, \"full_address\": string, \"coordinates\": { \"lat\": number, \"lng\": number } }, \"time\": \"01:14\"}]**",
      optional: true,
    },
    passengers: {
      type: "string[]",
      label: "Passengers",
      description: "List of objects of passengers. **Format: [{\"first_name\": string, \"last_name\": string, \"phone\": string, \"email\": string, \"nationality\": string, \"passport\": string, \"country_id\": UUID }]",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.limoexpress.createBooking({
        $,
        data: {
          booking_type_id: this.bookingTypeId,
          booking_status_id: this.bookingStatusId,
          from_location: {
            name: this.fromLocationName,
            full_address: this.fromLocationFullAddress,
            coordinates: {
              lat: this.fromLocationLatitude,
              lng: this.fromLocationLongitude,
            },
          },
          to_location: {
            name: this.toLocationName,
            full_address: this.toLocationFullAddress,
            coordinates: {
              lat: this.toLocationLatitude,
              lng: this.toLocationLongitude,
            },
          },
          pickup_time: this.pickupTime,
          expected_drop_off_time: this.expectedDropOffTime,
          expected_comeback_time: this.expectedComebackTime,
          vehicle_class_id: this.vehicleClassId.value,
          vehicle_id: this.vehicleId,
          price: this.price && parseFloat(this.price),
          price_type: this.priceType,
          commission_amount: this.commissionAmount && parseFloat(this.commissionAmount),
          currency_id: this.currencyId,
          vat_percentage: this.vatPercentage && parseFloat(this.vatPercentage),
          payment_method_id: this.paymentMethodId,
          distance: this.distance,
          duration: this.duration,
          paid: this.paid,
          confirmed: this.confirmed,
          round_trip: this.roundTrip,
          note: this.note,
          note_for_driver: this.noteForDriver,
          flight_number: this.flightNumber,
          num_of_waiting_hours: this.numOfWaitingHours,
          client_id: this.clientId,
          waiting_board_text: this.waitingBoardText,
          baby_seat_count: this.babySeatCount,
          suitcase_count: this.suitcaseCount,
          checkpoints: this.checkpoints,
          passengers: this.passengers,
        },
      });

      $.export("$summary", `Successfully created booking with ID ${response.data.id}`);
      return response;
    } catch ({ response }) {
      throwError(response);
    }
  },
};

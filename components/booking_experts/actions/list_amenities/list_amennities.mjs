import bookingExperts from "../booking_experts.app.mjs";

export default {
    key: "booking_experts-list-amenities",
    name: "List Amenities",
    description: "List amenities from BookingExperts API",
    version: "0.0.1",
    type: "action",
    props: {
        bookingExperts,
        page: { type: "integer", optional: true }
    }
}
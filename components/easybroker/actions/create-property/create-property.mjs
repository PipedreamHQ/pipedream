import { axios } from "@pipedream/platform";

export default defineComponent({
  name: "Create Property in EasyBroker",
  description: "Creates a new property listing in EasyBroker with full details including title, price, location, bedrooms, bathrooms, parking, size, description, amenities, photos, and status.",
  key: "easybroker-create-property",
  version: "0.0.1",
  type: "action",
  props: {
    easybroker: {
      type: "app",
      app: "easybroker",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title or name of the property listing.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Full description of the property.",
      optional: true,
    },
    property_type: {
      type: "string",
      label: "Property Type",
      description: "Type of property (e.g. house, apartment, land, commercial).",
      options: [
        "house",
        "apartment",
        "land",
        "commercial",
        "office",
        "warehouse",
        "other",
      ],
    },
    operation_type: {
      type: "string",
      label: "Operation Type",
      description: "Whether the property is for sale or rent.",
      options: ["sale", "rental"],
    },
    price: {
      type: "integer",
      label: "Price",
      description: "Listing price of the property.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency code for the price (e.g. USD, MXN).",
      optional: true,
      default: "USD",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Publication status of the property.",
      options: ["published", "draft"],
      default: "published",
    },
    location_name: {
      type: "string",
      label: "Location / Address",
      description: "Full address or location name of the property.",
      optional: true,
    },
    bedrooms: {
      type: "integer",
      label: "Bedrooms",
      description: "Number of bedrooms.",
      optional: true,
    },
    bathrooms: {
      type: "integer",
      label: "Bathrooms",
      description: "Number of bathrooms.",
      optional: true,
    },
    parking_spaces: {
      type: "integer",
      label: "Parking Spaces",
      description: "Number of parking spaces.",
      optional: true,
    },
    construction_size: {
      type: "string",
      label: "Construction Size (m2)",
      description: "Built / construction area in square meters.",
      optional: true,
    },
    lot_size: {
      type: "string",
      label: "Lot Size (m2)",
      description: "Total lot area in square meters.",
      optional: true,
    },
    amenities: {
      type: "string[]",
      label: "Amenities",
      description: "List of amenities (e.g. Pool, Gym, Security, Garden).",
      optional: true,
    },
    image_urls: {
      type: "string[]",
      label: "Photo URLs",
      description: "List of public image URLs for the property photos.",
      optional: true,
    },
    agent_id: {
      type: "string",
      label: "Agent ID",
      description: "ID of the agent to assign this listing to (optional).",
      optional: true,
    },
  },
  async run({ steps, $ }) {
    const body = {
      title: this.title,
      property_type: this.property_type,
      operation_type: this.operation_type,
      status: this.status,
    };

    if (this.description) body.description = this.description;
    if (this.price) body.price = this.price;
    if (this.currency) body.currency = this.currency;
    if (this.location_name) body.location = { name: this.location_name };
    if (this.bedrooms !== undefined) body.bedrooms = this.bedrooms;
    if (this.bathrooms !== undefined) body.bathrooms = this.bathrooms;
    if (this.parking_spaces !== undefined) body.parking_spaces = this.parking_spaces;
    if (this.construction_size) body.construction_size = parseFloat(this.construction_size);
    if (this.lot_size) body.lot_size = parseFloat(this.lot_size);
    if (this.amenities && this.amenities.length > 0) body.amenities = this.amenities;
    if (this.agent_id) body.agent_id = this.agent_id;

    if (this.image_urls && this.image_urls.length > 0) {
      body.property_images = this.image_urls.map((url, index) => ({
        url,
        position: index + 1,
      }));
    }

    const response = await axios($, {
      method: "POST",
      url: "https://api.easybroker.com/v1/properties",
      headers: {
        "X-Authorization": this.easybroker.$auth.api_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      data: body,
    });

    $.export("$summary", "Property created: " + this.title);
    return response;
  },
});

import fomo from "../../fomo.app.mjs";

export default {
  name: "Create Event",
  version: "0.0.1",
  key: "fomo-create-event",
  description: "Creates a event. [See docs here](https://docs.fomo.com/reference/create)",
  type: "action",
  props: {
    fomo,
    eventTypeId: {
      label: "Event Type ID",
      description: "Event type unique ID",
      type: "string",
    },
    firstName: {
      label: "First Name",
      description: "First name of the person on the event.",
      type: "string",
      optional: true,
    },
    email: {
      label: "Email",
      description: "Person's email address, used to create dynamic customer avatars. Never shown publicly.",
      type: "string",
      optional: true,
    },
    city: {
      label: "City",
      description: "City where the event happend. Size range: 0..255",
      type: "string",
      optional: true,
    },
    province: {
      label: "Province",
      description: "Province (state) where the event happened.",
      type: "string",
      optional: true,
    },
    country: {
      label: "Country",
      description: "Country where the event happend ISO-2 standard. Size range: 0..255",
      type: "string",
      optional: true,
    },
    title: {
      label: "Title",
      description: "Title of the event, such as a product name.",
      type: "string",
      optional: true,
    },
    url: {
      label: "Url",
      description: "Url to redirect on the event click. Size range: 0..255",
      type: "string",
      optional: true,
    },
    imageURL: {
      label: "Image URL",
      description: "URL of the image to be displayed.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fomo.createEvent({
      $,
      data: {
        event_type_id: this.eventTypeId,
        first_name: this.firstName,
        city: this.city,
        province: this.province,
        country: this.country,
        title: this.title,
        url: this.url,
        image_url: this.image_url,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created event with id ${response.id}`);
    }

    return response;
  },
};

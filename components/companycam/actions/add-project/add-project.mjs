import app from "../../companycam.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "companycam-add-project",
  name: "Add Project",
  description: "Add a new project. [See the docs](https://docs.companycam.com/reference/createproject).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    projectName: {
      propDefinition: [
        app,
        "projectName",
      ],
    },
    streetAddress1: {
      type: "string",
      label: "Street Address 1",
      description: "The first line of the street address.",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the project.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the project.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the project.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the project.",
      optional: true,
    },
    coordinateLat: {
      propDefinition: [
        app,
        "coordinateLat",
      ],
    },
    coordinateLon: {
      propDefinition: [
        app,
        "coordinateLon",
      ],
    },
    geofenceLat: {
      type: "string",
      label: "Geofence Latitude",
      description: "The latitude of the geofence.",
      optional: true,
    },
    geofenceLon: {
      type: "string",
      label: "Geofence Longitude",
      description: "The longitude of the geofence.",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The name of the contact.",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact.",
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      projectName,
      streetAddress1,
      city,
      state,
      postalCode,
      country,
      coordinateLat,
      coordinateLon,
      geofenceLat,
      geofenceLon,
      contactName,
      contactEmail,
      phoneNumber,
    } = this;

    const data = utils.reduceProperties({
      additionalProps: {
        coordinates: [
          {
            lat: utils.strToFloat(coordinateLat),
            lon: utils.strToFloat(coordinateLon),
          },
          coordinateLat && coordinateLon,
        ],
        geofence: [
          [
            {
              lat: utils.strToFloat(geofenceLat),
              lon: utils.strToFloat(geofenceLon),
            },
          ],
          geofenceLat && geofenceLon,
        ],
        primary_contact: [
          {
            name: contactName,
            email: contactEmail,
            phone_number: phoneNumber,
          },
          contactName,
        ],
      },
    });

    const response = await this.app.createProject({
      step,
      data: {
        name: projectName,
        address: {
          street_address_1: streetAddress1,
          city,
          state,
          postal_code: postalCode,
          country,
        },
        ...data,
      },
    });

    step.export("$summary", `Successfully created project with id ${response.id}`);

    return response;
  },
};

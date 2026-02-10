import { parseObjectEntries } from "../../common/utils.mjs";
import common from "../../common/base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the business, e.g. `Microsoft`",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the business, e.g. `+18832327657`",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the business, e.g. `info@microsoft.com`",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the business, e.g. `www.microsoft.com`",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Street address of the business",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the business",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the business",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of the business",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the business, e.g. `us`",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the business",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Additional parameters to send in the request. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/businesses/create-business) for available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getData(useLocation = true) {
      const {
        app, additionalOptions, locationId, ...data
      } = this;
      return {
        app,
        ...(useLocation && {
          locationId: locationId ?? app.getLocationId(),
        }),
        ...data,
        ...(additionalOptions && parseObjectEntries(additionalOptions)),
      };
    },
  },
};

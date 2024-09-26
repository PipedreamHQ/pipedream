import { ConfigurationError } from "@pipedream/platform";
import { parseObjectEntries } from "../../common/utils.mjs";
import app from "../../highlevel_oauth.app.mjs";

export default {
  props: {
    app: {
      ...app,
      reloadProps: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the contact, e.g. `Rosan Deo`",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact, e.g. `rosan@deos.com`",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact, e.g. `+1 888-888-8888`",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Additional parameters to send in the request. [See the documentation](https://highlevel.stoplight.io/docs/integrations/4c8362223c17b-create-contact) for available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  async additionalProps() {
    const locationId = this.app.getLocationId();
    if (!locationId) {
      throw new ConfigurationError("This component requires you to authenticate as a **location**, not as an agency/company. *(`locationId` field is missing from `$auth`)*");
    }

    return {};
  },
  methods: {
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

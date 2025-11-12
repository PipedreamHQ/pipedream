import app from "../../cisco_meraki.app.mjs";

export default {
  key: "cisco_meraki-update-network",
  name: "Update Network",
  description: "Updates a network. [See the docs](https://developer.cisco.com/meraki/api/#!update-network).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    orgId: {
      propDefinition: [
        app,
        "orgId",
      ],
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    enrollmentString: {
      type: "string",
      label: "Enrollment String",
      description: "A unique identifier which can be used for device enrollment or easy access through the Meraki SM Registration page or the Self Service Portal. Please note that changing this field may cause existing bookmarks to break.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the network",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The timezone of the network. For a list of allowed timezones, please see the `TZ` column in the table in [this article](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The list of tags for the network",
      optional: true,
    },
    disableMyMerakiCom: {
      type: "boolean",
      label: "Disable My Meraki.com",
      description: "Disables the local device status pages. [my.meraki.com](http://my.meraki.com/), [ap.meraki.com](http://ap.meraki.com/), [http://switch.meraki.com/](switch.meraki.com), [wired.meraki.com](http://wired.meraki.com/).",
      optional: true,
    },
  },
  methods: {
    updateNetwork({
      networkId, ...args
    } = {}) {
      return this.app.update({
        path: `/networks/${networkId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      networkId,
      enrollmentString,
      name,
      timeZone,
      tags,
      disableMyMerakiCom,
    } = this;

    const response = await this.updateNetwork({
      step,
      networkId,
      data: {
        enrollmentString,
        name,
        timeZone,
        tags,
        disableMyMerakiCom,
      },
    });

    step.export("$summary", `Successfully updated network with ID \`${response.id}\``);

    return response;
  },
};

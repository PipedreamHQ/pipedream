import dealmachine from "../../dealmachine.app.mjs";

export default {
  key: "dealmachine-add-lead",
  name: "Add Lead",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a lead to your team's account. [See the documentation](https://docs.dealmachine.com/#1f003772-6a7b-43f6-8839-1f30bed55b19)",
  type: "action",
  props: {
    dealmachine,
    addressType: {
      type: "integer",
      label: "Address Type",
      description: "The type of the address you want to add.",
      reloadProps: true,
      options: [
        {
          label: "Full Address",
          value: 1,
        },
        {
          label: "Lat and Lng",
          value: 2,
        },
        {
          label: "Object Address",
          value: 3,
        },
      ],
    },
  },
  async additionalProps() {
    switch (this.addressType) {
    case 1:
      return {
        fullAddress: {
          type: "string",
          label: "Full Address",
          description: "A full address in one string (This will be the least accurate).",
        },
      };
    case 2:
      return {
        latitude: {
          type: "string",
          label: "Latitude",
          description: "The latitude of the address.",
        },
        longitude: {
          type: "string",
          label: "Longitude",
          description: "The longitude of the address.",
        },
      };
    case 3:
      return {
        address: {
          type: "string",
          label: "Address",
          description: "The address of the lead.",
        },
        address2: {
          type: "string",
          label: "Address 2",
          description: "The second line of the address.",
          optional: true,
        },
        city: {
          type: "string",
          label: "City",
          description: "The city of the address.",
        },
        state: {
          type: "string",
          label: "State",
          description: "The state of the address.",
        },
        zip: {
          type: "string",
          label: "Zip",
          description: "The zipcode of the address.",
        },
      };
    }
  },
  async run({ $ }) {
    const {
      dealmachine,
      fullAddress,
      ...data
    } = this;

    const {
      error, data: response,
    } = await dealmachine.addLead({
      $,
      data: {
        full_address: fullAddress,
        ...data,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    $.export("$summary", `A new lead with Id: ${response.id} was successfully created!`);
    return response;
  },
};

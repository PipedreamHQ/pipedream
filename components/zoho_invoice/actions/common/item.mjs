import app from "../../zoho_invoice.app.mjs";

export default {
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    numberOfItems: {
      propDefinition: [
        app,
        "numberOfItems",
      ],
    },
  },
  methods: {
    listItems(args = {}) {
      return this.app.makeRequest({
        path: "/items",
        ...args,
      });
    },
    getLineItems() {
      return Array.from({
        length: this.numberOfItems,
      }).reduce((reduction, _, index) => {
        const itemKey = `item${index + 1}`;
        const {
          [`${itemKey}_itemId`]: itemId,
          [`${itemKey}_name`]: name,
          [`${itemKey}_rate`]: rate,
          [`${itemKey}_quantity`]: quantity,
        } = this;
        return [
          ...reduction,
          {
            item_id: itemId,
            name,
            rate,
            quantity,
          },
        ];
      }, []);
    },
  },
  async additionalProps() {
    const { numberOfItems } = this;

    if (!numberOfItems) {
      return {};
    }

    const { items = [] } = await this.listItems({
      params: {
        filter_by: "Status.Active",
      },
    });

    const itemOptions = items.map(({
      item_id: value, name: label,
    }) => ({
      label,
      value,
    }));

    return Array.from({
      length: numberOfItems,
    }).reduce((reduction, _, index) => {
      const itemIndex = index + 1;
      const itemKey = `item${itemIndex}`;
      return {
        ...reduction,
        [`${itemKey}_itemId`]: {
          type: "string",
          label: `Item ${itemIndex} - Item ID`,
          description: `The ID of the item for item ${itemIndex}`,
          options: itemOptions,
        },
        [`${itemKey}_name`]: {
          type: "string",
          label: `Item ${itemIndex} - Name`,
          description: `The name of the item ${itemIndex}`,
        },
        [`${itemKey}_rate`]: {
          type: "string",
          label: `Item ${itemIndex} - Rate`,
          description: `The rate of the item ${itemIndex}`,
        },
        [`${itemKey}_quantity`]: {
          type: "string",
          label: `Item ${itemIndex} - Quantity`,
          description: `The quantity of the item ${itemIndex}`,
        },
      };
    }, {});
  },
};

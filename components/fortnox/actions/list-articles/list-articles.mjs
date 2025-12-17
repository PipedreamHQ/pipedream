import app from "../../fortnox.app.mjs";

export default {
  key: "fortnox-list-articles",
  name: "List Articles",
  description: "List all articles in Fortnox. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Articles/operation/list_4)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter the articles by Active or Inactive",
      options: [
        "active",
        "inactive",
      ],
      optional: true,
    },
    articlenumber: {
      type: "string",
      label: "Article Number",
      description: "Filter by article number",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Filter by description",
      optional: true,
    },
    ean: {
      type: "string",
      label: "EAN",
      description: "Filter by EAN",
      optional: true,
    },
    suppliernumber: {
      type: "string",
      label: "Supplier Number",
      description: "Filter by supplier number",
      optional: true,
    },
    manufacturer: {
      type: "string",
      label: "Manufacturer",
      description: "Filter by manufacturer",
      optional: true,
    },
    manufacturerarticlenumber: {
      type: "string",
      label: "Manufacturer Article Number",
      description: "Filter by manufacturer article number",
      optional: true,
    },
    webshop: {
      type: "string",
      label: "Webshop",
      description: "Filter by web shop",
      optional: true,
    },
    lastmodified: {
      type: "string",
      label: "Last Modified",
      description: "Filter by last modified date",
      optional: true,
    },
    sortby: {
      type: "string",
      label: "Sort By",
      description: "Sort the articles by the specified field",
      optional: true,
      options: [
        "articlenumber",
        "quantityinstock",
        "reservedquantity",
        "stockvalue",
      ],
    },
  },
  async run({ $ }) {
    const { Articles } = await this.app.listArticles({
      $,
      params: {
        filter: this.filter,
        articlenumber: this.articlenumber,
        description: this.description,
        ean: this.ean,
        suppliernumber: this.suppliernumber,
        manufacturer: this.manufacturer,
        manufacturerarticlenumber: this.manufacturerarticlenumber,
        webshop: this.webshop,
        lastmodified: this.lastmodified,
        sortby: this.sortby,
      },
    });

    $.export("$summary", `Successfully retrieved ${Articles.length} article${Articles.length === 1
      ? ""
      : "s"}`);
    return Articles;
  },
};

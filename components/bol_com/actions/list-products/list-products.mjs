import bolCom from "../../bol_com.app.mjs";
import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "bol_com-list-products",
  name: "List Products",
  description: "List products. [See the documentation](https://api.bol.com/retailer/public/redoc/v10/retailer.html#tag/Products/operation/get-product-list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bolCom,
    page: {
      propDefinition: [
        bolCom,
        "page",
      ],
      optional: false,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country for which the products will be retrieved",
      options: constants.COUNTRY_CODE_OPTIONS,
      optional: true,
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "The search term to get the associated products for",
      optional: true,
    },
    categoryId: {
      propDefinition: [
        bolCom,
        "categoryId",
      ],
      optional: true,
    },
    filterRanges: {
      type: "string[]",
      label: "Filter Ranges",
      description: `The filter ranges to apply to the products

**Example:**
\`\`\`json
[
  {
    "rangeId": "PRICE",
    "min": 0,
    "max": 0
  }
]
\`\`\``,
      optional: true,
    },
    filterValues: {
      type: "string[]",
      label: "Filter Values",
      description: `The list of filter values in this filter
      
**Example:**
\`\`\`json
[
  {
    "filterValueId": "30639"
  }
]
\`\`\``,
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The sort order of the products",
      options: constants.PRODUCT_SORT_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bolCom.listProducts({
      $,
      data: {
        page: this.page,
        countryCode: this.countryCode,
        searchTerm: this.searchTerm,
        categoryId: this.categoryId,
        filterRanges: parseObject(this.filterRanges),
        filterValues: parseObject(this.filterValues),
        sort: this.sort,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.products.length} product${response.products.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};

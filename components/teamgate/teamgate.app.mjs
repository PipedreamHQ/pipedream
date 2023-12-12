import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teamgate",
  propDefinitions: {
    activityId: {
      type: "integer",
      label: "Activity Id",
      description: "The Activity`s Id",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listEvents({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id, value,
        }) => ({
          label: value,
          value: id,
        }));
      },
    },
    actualClosureDate: {
      type: "string",
      label: "Actual Closure Date",
      description: "Example: `2017-03-10T11:45:59+02:00`",
    },
    address: {
      type: "string[]",
      label: "Address",
      description: "A list of address objects. Example for string value: `{\"value\":{\"city\":\"Chicago\",\"countryIso\":\"USA\"}}` [Object format](https://developers.teamgate.com/#f1511aad-d3dc-4118-98d6-bed247321ea3)",
    },
    cartDiscountType: {
      type: "string",
      label: "Cart Discount Type",
      description: "The type of the discount.",
      options: [
        "fixed",
        "perc",
      ],
    },
    cartDiscountValue: {
      type: "string",
      label: "Cart Discount Value",
      description: "The discount on all cart.",
    },
    cartItems: {
      type: "string[]",
      label: "Cart Items",
      description: "The object items. Example: `{\"id\":20,\"price\":{\"currency\": \"EUR\",\"value\": \"10000.0000\"},\"discount\":{\"type\":\"percentage\",\"value\": \"20.0000\"},\"quantity\": 2}`",
    },
    companies: {
      type: "integer[]",
      label: "Companies",
      description: "List of company Ids",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listCompanies({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Required only if a lead is an company and `name` is empty. The field will be set only if `companyId` is empty.",
    },
    costCurrency: {
      type: "string",
      label: "Cost Currency",
      description: "The product currency.",
    },
    costValue: {
      type: "string",
      label: "Cost Value",
      description: "The product cost.",
    },
    createdDate: {
      type: "string",
      label: "Created Date",
      description: "Example: `2017-03-10T11:45:59+02:00`",
    },
    customerStatusId: {
      type: "string",
      label: "Customer Status Id",
      description: "The company`s customer status",
      options: [
        {
          label: "Non Customer",
          value: "0",
        },
        {
          label: "Past Customer",
          value: "1",
        },
        {
          label: "Customer",
          value: "2",
        },
      ],
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "A list of custom fields. Each row must be an object which the key is the `custom field id`. Example for string value: `{\"1\":\"Test value for field with Id 1\"}`",
    },
    deals: {
      type: "integer[]",
      label: "Deals",
      description: "List of deal Ids",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listDeals({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "A list of the company's emails. Example for string value: `{\"value\":\"john@example.net\",\"type\":\"work\"}` [Object format](https://developers.teamgate.com/#c3d764d8-af9b-46e6-be97-cc8d0264a376)",
    },
    estimatedClosureDate: {
      type: "string",
      label: "Estimated Closure Date",
      description: "Example: `2017-03-10T11:45:59+02:00`",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The fields to be returned.",
    },
    filters: {
      type: "object",
      label: "Filters",
      description: "Filtering supports any field of groups of fields. Supported string comparison operators: `=` or `like`. Supported numerical operators: `=` or `gt` or `lt` or `gte` or `lte`. The key must be a field name followed by operator between square brackets and the value must be the comparision string`{asc|desc}`",
    },
    globalOperator: {
      type: "string",
      label: "Global Operator",
      description: "The operator paramater to help for whole request",
      optional: true,
      options: [
        "and",
        "or",
      ],
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "If the industry does not exist it will be created.",
    },
    industryDescription: {
      type: "string",
      label: "Industry Description",
      description: "Will be set only if will be created new industry.",
    },
    industryId: {
      type: "integer",
      label: "Industry Id",
      description: "The industry`s id",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listIndustries({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The field will be set only if `personId` is not empty.",
    },
    leads: {
      type: "integer[]",
      label: "Leads",
      description: "List of lead Ids",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listLeads({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    leadStatus: {
      type: "string",
      label: "Status",
      description: "If the stauts does not exist it will be created.",
    },
    leadStatusDescription: {
      type: "string",
      label: "Status Description",
      description: "Will be set only if will be created new status.",
    },
    leadStatusId: {
      type: "integer",
      label: "Lead Status Id",
      description: "The lead Status Id",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listLeadStatuses({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The company`s name.",
    },
    order: {
      type: "object",
      label: "Order",
      description: "Sorts the entities. The key must be a `field name` and the value must be the direction `{asc|desc}`",
    },
    ownerId: {
      type: "integer",
      label: "Owner Id",
      description: "The User`s id",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listUsers({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ownerRandom: {
      type: "string",
      label: "Owner Random",
      description: "A list of users/user groups to select the random owner. Example 1: \"ownerRandom\": [\"5\", \"6\"], Example 2: \"ownerRandom\": {\"groups\":[\"1\"]}, Example 3: \"ownerRandom\": {\"0\":\"5\",\"1\":\"6\",\"groups\":[\"1\"]}",
    },
    ownerUsername: {
      type: "string",
      label: "Owner Username",
      description: "The username to which the company belongs.",
    },
    personId: {
      type: "integer",
      label: "PersonId",
      description: "The person`s id",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listPeople({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "A list of the company's phones. Example for string value: `{\"value\":\"+44 123 456 7890\",\"type\":\"mobile\"}` [Object format](https://developers.teamgate.com/#6a9c4d1a-c72a-4409-8041-afe30c64314c)",
    },
    pipeline: {
      type: "string",
      label: "Pipeline",
      description: "The pipeline`s id",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listPipelines({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    priceCurrency: {
      type: "string",
      label: "Price Currency",
      description: "The deal`s currency",
    },
    prices: {
      type: "string[]",
      label: "Prices",
      description: "The product prices. Example for string value: `{\"value\":\"1600\", \"currency\":\"USD\"}` [Object format](https://developers.teamgate.com/#ec82024b-42a3-48eb-a048-f36f477724f6)",
    },
    priceValue: {
      type: "string",
      label: "Price Value",
      description: "The deal`s price",
    },
    productCategory: {
      type: "string",
      label: "Category",
      description: "The product`s category",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listProductCategories({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map((product) => (product.name));
      },
    },
    productDescription: {
      type: "string",
      label: "Description",
      description: "The description of the product.",
    },
    productId: {
      type: "integer",
      label: "Product Id",
      description: "The product which will be updated",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listProducts({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Set product availability.",
    },
    products: {
      type: "integer[]",
      label: "Products",
      description: "List of product Ids",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listProducts({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    prospectStatusId: {
      type: "string",
      label: "Prospect Status Id",
      description: "The company`s prospect status.",
      options: [
        {
          label: "Non Prospect",
          value: "0",
        },
        {
          label: "Lost Prospect",
          value: "1",
        },
        {
          label: "Prospect",
          value: "2",
        },
      ],
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "Unique identification code.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "If the source does not exist it will be created.",
    },
    sourceId: {
      type: "integer",
      label: "Source Id",
      description: "The source`s id",
      async options({ page }) {
        const limit = 20;
        const { data } = await this.listSources({
          params: {
            limit: limit,
            offset: page * limit,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sourceDescription: {
      type: "string",
      label: "Source Description",
      description: "Will be set only if will be created new source.",
    },
    stage: {
      type: "integer",
      label: "Stage",
      description: "The stage`s Id.",
      async options({ pipeline }) {
        const { data: { stages } } = await this.getPipeline({
          pipeline,
        });

        return stages.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Deal`s status",
      options: [
        "active",
        "won",
        "lost",
        "postponed",
      ],
    },
    starred: {
      type: "boolean",
      label: "Starred",
      description: "Indicator the company is starred or not.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the activity you want to create",
      options: [
        "task",
        "call",
        "note",
      ],
    },
    urls: {
      type: "string[]",
      label: "URLS",
      description: "A list of the company's urls. Example for string value: `{\"value\":\"https://facebook.com/example\",\"type\":\"facebook\"}` [Object format](https://developers.teamgate.com/#c4d7bd78-8b18-4b2e-9505-82f66f786455)",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.teamgate.com/v4";
    },
    _getHeaders() {
      return {
        "X-App-Key": this.$auth.app_key,
        "X-Auth-Token": this.$auth.auth_token,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createEvent({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "events",
        method: "POST",
        data,
      });
    },
    createCompany({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "companies?embed=customFields",
        method: "POST",
        data,
      });
    },
    createDeal({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "deals?embed=customFields",
        method: "POST",
        data,
      });
    },
    createLead({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "leads?embed=customFields",
        method: "POST",
        data,
      });
    },
    createPerson({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "people",
        method: "POST",
        data,
      });
    },
    createProduct({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "products?embed=customFields",
        method: "POST",
        data,
      });
    },
    getDeal(dealId) {
      return this._makeRequest({
        path: `deals/${dealId}`,
      });
    },
    getPipeline({ pipeline }) {
      return this._makeRequest({
        path: `pipelines/${pipeline}`,
      });
    },
    getEvent(eventId) {
      return this._makeRequest({
        path: `events/${eventId}`,
      });
    },
    listEvents({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "events",
        params,
      });
    },
    listCompanies({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "companies",
        params,
      });
    },
    listDeals({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "deals",
        params,
      });
    },
    listIndustries({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "industries",
        params,
      });
    },
    listLeads({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "leads",
        params,
      });
    },
    listLeadStatuses({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "leadsStatuses",
        params,
      });
    },
    listPeople({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "people",
        params,
      });
    },
    listPipelines({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "pipelines",
        params,
      });
    },
    listProductCategories({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "productsCategories",
        params,
      });
    },
    listProducts({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "products",
        params,
      });
    },
    listSources({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "sources",
        params,
      });
    },
    listUsers({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "users",
        params,
      });
    },
    updateCart({
      $, dealId, data,
    }) {
      return this._makeRequest({
        $,
        path: `carts/${dealId}/products`,
        method: "PUT",
        data,
      });
    },
    updateDeal({
      $, dealId, data,
    }) {
      return this._makeRequest({
        $,
        path: `deals/${dealId}`,
        method: "PUT",
        data,
      });
    },
    updateLead({
      $, leadId, data,
    }) {
      return this._makeRequest({
        $,
        path: `leads/${leadId}`,
        method: "PUT",
        data,
      });
    },
    updateProduct({
      $, productId, data,
    }) {
      return this._makeRequest({
        $,
        path: `products/${productId}`,
        method: "PUT",
        data,
      });
    },
    async *paginate({
      fn, params = {},
    }) {
      let haveNextPage = false;
      let offset = 0;

      do {
        params.offset = offset;
        const {
          data,
          nextPage,
        } = await fn({
          params,
        });
        for (const d of data) {
          yield d;
        }
        offset += data.length;

        haveNextPage = nextPage;

      } while (haveNextPage);
    },
  },
};

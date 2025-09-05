import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mews",
  propDefinitions: {
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Raw payload fields to include in the request (e.g. filters).",
      optional: true,
    },
    reservationId: {
      type: "string",
      label: "Reservation ID",
      description: "The ID of the reservation to fetch.",
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Reservations: reservations,
          Cursor: nextCursor,
        } = await this.reservationsGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: reservations.map(({
            Id: value,
            Number: label,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    serviceId: {
      type: "string",
      label: "Service ID",
      description: "Identifier of the Service (bookable service). [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/services#get-services)",
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Services: services,
          Cursor: nextCursor,
        } = await this.servicesGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: services.map(({
            Name: label,
            Id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Identifier of the Customer who owns the reservation. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/customers#get-customers)",
      async options({
        prevContext: { cursor },
        data = {
          CreatedUtc: {
            StartUtc: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
            EndUtc: new Date().toISOString(),
          },
          Extent: {
            Customers: true,
            Addresses: false,
          },
        },
        mapper = ({
          FirstName,
          LastName,
          Id: value,
        }) => ({
          label: FirstName
            ? `${FirstName} ${LastName}`
            : LastName,
          value,
        }),
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Customers: customers,
          Cursor: nextCursor,
        } = await this.customersGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: customers.map(mapper),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    startUtc: {
      type: "string",
      label: "Start (UTC)",
      description: "Start of the reservation in ISO 8601 (UTC). Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    endUtc: {
      type: "string",
      label: "End (UTC)",
      description: "End of the reservation in ISO 8601 (UTC). Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the reservation.",
      options: [
        "Optional",
        "Enquired",
        "Confirmed",
      ],
    },
    resourceId: {
      type: "string",
      label: "Resource ID",
      description: "Identifier of the Resource (bookable resource). [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/resources#get-resources)",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Resources: resources,
          Cursor: nextCursor,
        } = await this.resourcesGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: resources.map(({
            Name: label,
            Id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    number: {
      type: "string",
      label: "Reservation Number",
      description: "Number of the reservation.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes of the reservation.",
      optional: true,
    },
    rateId: {
      type: "string",
      label: "Rate ID",
      description: "Identifier of the Rate. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/rates#get-rates)",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Rates: rates,
          Cursor: nextCursor,
        } = await this.ratesGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: rates.map(({
            Name: label,
            Id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Identifier of the Company. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/companies#get-companies)",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
        filter = () => true,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Companies: companies,
          Cursor: nextCursor,
        } = await this.companiesGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: companies
            .filter(filter)
            .map(({
              Name: label,
              Id: value,
            }) => ({
              label,
              value,
            })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    travelAgencyId: {
      type: "string",
      label: "Travel Agency ID",
      description: "Identifier of the Travel Agency.",
      optional: true,
    },
    businessSegmentId: {
      type: "string",
      label: "Business Segment ID",
      description: "Identifier of the Business Segment. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/business-segments#get-business-segments)",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          BusinessSegments: businessSegments,
          Cursor: nextCursor,
        } = await this.businessSegmentsGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: businessSegments.map(({
            Name: label,
            Id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "Identifier of the Product. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/products#get-products)",
      async options({
        prevContext: { cursor },
        data,
      }) {
        const {
          Products: products,
          Cursor: nextCursor,
        } = await this.productsGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: products.map(({
            Name: label,
            Id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency of the product. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/currencies#currency)",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Currencies: currencies,
          Cursor: nextCursor,
        } = await this.currenciesGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: currencies.map(({ Code: value }) => value),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    taxRate: {
      type: "string",
      label: "Tax Rate",
      description: "Tax rate of the product.",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          TaxRates: taxRates,
          Cursor: nextCursor,
        } = await this.taxationsGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: taxRates.map(({ Code: value }) => value),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "Unique identifier of the Department.",
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Departments: departments,
          Cursor: nextCursor,
        } = await this.departmentsGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: departments.map(({
            Name: label,
            Id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    productServiceOrderId: {
      type: "string",
      label: "Product Service Order ID",
      description: "Unique identifier of the Product Service Order.",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          ProductServiceOrders: productServiceOrders,
          Cursor: nextCursor,
        } = await this.productServiceOrdersGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: productServiceOrders.map(({
            Number: label,
            Id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    accountType: {
      type: "string",
      label: "Account Type",
      description: "Type of account to be charged",
      options: [
        "customer",
        "company",
      ],
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Identifier of the Customer or Company to be charged. Company billing may not be enabled for your integration.",
      async options({
        accountType,
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        if (accountType === "company") {
          const {
            Companies: companies,
            Cursor: nextCursor,
          } = await this.companiesGetAll({
            data: {
              ...data,
              Limitation: {
                Count: 100,
                Cursor: cursor,
              },
            },
          });

          return {
            options: companies.map(({
              Name: label,
              Id: value,
            }) => ({
              label,
              value,
            })),
            context: {
              cursor: nextCursor,
            },
          };
        }

        const {
          Customers: customers,
          Cursor: nextCursor,
        } = await this.customersGetAll({
          data: {
            ...data,
            CreatedUtc: {
              StartUtc: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
              EndUtc: new Date().toISOString(),
            },
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: customers.map(({
            FirstName,
            LastName,
            Id: value,
          }) => ({
            label: FirstName
              ? `${FirstName} ${LastName}`
              : LastName,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    billId: {
      type: "string",
      label: "Bill ID",
      description: "Identifier of the Bill to which the created order will be assigned. The bill needs to be issued to the same account as the order.",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Bills: bills,
          Cursor: nextCursor,
        } = await this.billsGetAll({
          data: {
            ...data,
            UpdatedUtc: {
              StartUtc: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
              EndUtc: new Date().toISOString(),
            },
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: bills.map(({
            Number,
            Name,
            Id: value,
          }) => ({
            label: Name || Number,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "ISO 3166-1 Alpha-2 country code.",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Countries: countries,
          Cursor: nextCursor,
        } = await this.countriesGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: countries.map(({
            EnglishName: label,
            Code: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    creditCardId: {
      type: "string",
      label: "Credit Card ID",
      description: "Identifier of CreditCard belonging to Customer who owns the reservation",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          CreditCards: creditCards,
          Cursor: nextCursor,
        } = await this.creditCardsGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: creditCards.map(({
            ObfuscatedNumber: obfuscatedNumber,
            Type: type,
            Id: value,
          }) => ({
            label: `${type} ${obfuscatedNumber}`,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    availabilityBlockId: {
      type: "string",
      label: "Availability Block ID",
      description: "Unique identifier of the AvailabilityBlock the reservation is assigned to.",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          AvailabilityBlocks: availabilityBlocks,
          Cursor: nextCursor,
        } = await this.availabilityBlocksGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: availabilityBlocks.map(({
            Id: value,
            Name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    enterpriseIds: {
      type: "string[]",
      label: "Enterprise IDs",
      description: "Unique identifiers of the Enterprises. If not specified, the operation returns data for all enterprises within scope of the Access Token. Max 1000 items.",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          Enterprises: enterprises,
          Cursor: nextCursor,
        } = await this.enterprisesGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: enterprises.map(({
            Name: label,
            Id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    orderItemIds: {
      type: "string[]",
      label: "Order Item IDs",
      description: "Unique identifiers of the Order items. Required if no other filter is provided. Max 1000 items.",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          OrderItems: orderItems,
          Cursor: nextCursor,
        } = await this.orderItemsGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: orderItems.map(({
            Number: label,
            Id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    reservationGroupIds: {
      type: "string[]",
      label: "Reservation Group IDs",
      description: "Unique identifiers of Reservation groups. Max 1000 items.",
      optional: true,
      async options({
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          ReservationGroups: reservationGroups,
          Cursor: nextCursor,
        } = await this.reservationGroupsGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: reservationGroups.map(({
            Name: label,
            Id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    sex: {
      type: "string",
      label: "Sex",
      description: "Sex of the customer.",
      optional: true,
      options: [
        "Male",
        "Female",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title prefix of the customer",
      optional: true,
      options: [
        {
          label: "Mister - Mr.",
          value: "Mister",
        },
        {
          label: "Miss - Ms.",
          value: "Miss",
        },
        {
          label: "Misses - Mrs.",
          value: "Misses",
        },
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "New first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "New last name.",
      optional: true,
    },
    secondLastName: {
      type: "string",
      label: "Second Last Name",
      description: "New second last name.",
      optional: true,
    },
    birthDate: {
      type: "string",
      label: "Birth Date",
      description: "Date of birth in ISO 8601 format (e.g., 1985-09-30)",
      optional: true,
    },
    birthPlace: {
      type: "string",
      label: "Birth Place",
      description: "Place of birth",
      optional: true,
    },
    occupation: {
      type: "string",
      label: "Occupation",
      description: "Occupation of the customer",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the customer (possibly mobile)",
      optional: true,
    },
    loyaltyCode: {
      type: "string",
      label: "Loyalty Code",
      description: "Loyalty code of the customer.",
      optional: true,
    },
    carRegistrationNumber: {
      type: "string",
      label: "Car Registration Number",
      description: "Registration number of the customer's car (max 255 characters)",
      optional: true,
    },
    dietaryRequirements: {
      type: "string",
      label: "Dietary Requirements",
      description: "Customer's dietary requirements, e.g. Vegan, Halal (max 255 characters)",
      optional: true,
    },
    taxIdentificationNumber: {
      type: "string",
      label: "Tax Identification Number",
      description: "Tax identification number of the customer",
      optional: true,
    },
    address: {
      type: "object",
      label: "Address",
      description: `New address details in JSON format with the following properties:
- **Line1** (string, optional): First line of the address
- **Line2** (string, optional): Second line of the address  
- **City** (string, optional): The city
- **PostalCode** (string, optional): Postal code
- **CountryCode** (string, optional): ISO 3166-1 code of the Country
- **CountrySubdivisionCode** (string, optional): ISO 3166-2 code of the administrative division, e.g. \`DE-BW\`

**Example:**
\`\`\`json
{
  "Line1": "123 Main Street",
  "Line2": "Apt 4B",
  "City": "New York",
  "PostalCode": "10001",
  "CountryCode": "US",
  "CountrySubdivisionCode": "US-NY"
}
\`\`\``,
      optional: true,
    },
    classifications: {
      type: "string[]",
      label: "Classifications",
      description: "New classifications of the customer",
      optional: true,
      options: [
        "None",
        "PaymasterAccount",
        "Blacklist",
        "Media",
        "LoyaltyProgram",
        "PreviousComplaint",
        "Returning",
        "Staff",
        "FriendOrFamily",
        "TopManagement",
        "Important",
        "VeryImportant",
        "Problematic",
        "Cashlist",
        "DisabledPerson",
        "Military",
        "Airline",
        "HealthCompliant",
        "InRoom",
        "WaitingForRoom",
        "Student",
      ],
    },
    options: {
      type: "string[]",
      label: "Options",
      description: "Options of the customer.",
      optional: true,
      options: [
        "None",
        "SendMarketingEmails",
        "Invoiceable",
        "BillAddressObjection",
        "SendMarketingPostalMail",
        "SendPartnerMarketingEmails",
        "SendPartnerMarketingPostalMail",
        "WithdrawCardConsent",
        "GuestPhotoConsent",
        "IdPhotosConsent",
      ],
    },
    italianDestinationCode: {
      type: "string",
      label: "Italian Destination Code",
      description: "New Italian destination code of customer",
      optional: true,
    },
    italianFiscalCode: {
      type: "string",
      label: "Italian Fiscal Code",
      description: "New Italian fiscal code of customer.",
      optional: true,
    },
    createdStartUtc: {
      type: "string",
      label: "Created Start (UTC)",
      description: "Start of the interval in which Customer was created. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    createdEndUtc: {
      type: "string",
      label: "Created End (UTC)",
      description: "End of the interval in which Customer was created. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    updatedStartUtc: {
      type: "string",
      label: "Updated Start (UTC)",
      description: "Start of the interval in which Customer was updated. ISO 8601 format. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    updatedEndUtc: {
      type: "string",
      label: "Updated End (UTC)",
      description: "End of the interval in which Customer was updated. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    deletedStartUtc: {
      type: "string",
      label: "Deleted Start (UTC)",
      description: "Start of the interval in which Customer was deleted. ISO 8601 format. ActivityStates value 'Deleted' should be provided with this filter. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    deletedEndUtc: {
      type: "string",
      label: "Deleted End (UTC)",
      description: "End of the interval in which Customer was deleted. ISO 8601 format. Max 3 months interval. Eg. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path Or URL",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
    },
    resourceCategoryId: {
      type: "string",
      label: "Category ID",
      description: "Identifier of the category",
      optional: true,
      async options({
        defaultLanguage = "en-US",
        prevContext: { cursor },
        data,
      }) {
        if (cursor === null) {
          return [];
        }

        const {
          ResourceCategories: categories,
          Cursor: nextCursor,
        } = await this.resourceCategoriesGetAll({
          data: {
            ...data,
            Limitation: {
              Count: 100,
              Cursor: cursor,
            },
          },
        });

        return {
          options: categories.map(({
            Names: names,
            Id: value,
          }) => ({
            label: names[defaultLanguage],
            value,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    activityStates: {
      type: "string[]",
      label: "Activity States",
      description: "Whether to return only active, only deleted or both records",
      optional: true,
      options: [
        "Active",
        "Deleted",
      ],
    },
  },
  methods: {
    getUrl(path) {
      return `https://${this.$auth.platform_url}/api/connector/v1${path}`;
    },
    getAuthData(data) {
      const {
        ClientToken: clientToken,
        AccessToken: accessToken,
        Client: client,
      } = this.$auth;
      return {
        ...data,
        ClientToken: clientToken,
        AccessToken: accessToken,
        Client: client,
      };
    },
    _makeRequest({
      $ = this, path, data, ...args
    } = {}) {
      return axios($, {
        method: "POST",
        url: this.getUrl(path),
        data: this.getAuthData(data),
        ...args,
      });
    },
    reservationsGetAll(args = {}) {
      return this._makeRequest({
        path: "/reservations/getAll/2023-06-06",
        ...args,
      });
    },
    reservationsCreate(args = {}) {
      return this._makeRequest({
        path: "/reservations/create",
        ...args,
      });
    },
    reservationsUpdate(args = {}) {
      return this._makeRequest({
        path: "/reservations/update",
        ...args,
      });
    },
    reservationsCancel(args = {}) {
      return this._makeRequest({
        path: "/reservations/cancel",
        ...args,
      });
    },
    reservationsAddCompanion(args = {}) {
      return this._makeRequest({
        path: "/reservations/addCompanion",
        ...args,
      });
    },
    reservationsAddProduct(args = {}) {
      return this._makeRequest({
        path: "/reservations/addProduct",
        ...args,
      });
    },
    orderItemsGetAll(args = {}) {
      return this._makeRequest({
        path: "/orderItems/getAll",
        ...args,
      });
    },
    productsGetAll(args = {}) {
      return this._makeRequest({
        path: "/products/getAll",
        ...args,
      });
    },
    customersGetAll(args = {}) {
      return this._makeRequest({
        path: "/customers/getAll",
        ...args,
      });
    },
    customersAdd(args = {}) {
      return this._makeRequest({
        path: "/customers/add",
        ...args,
      });
    },
    customersAddFile(args = {}) {
      return this._makeRequest({
        path: "/customers/addFile",
        ...args,
      });
    },
    customersUpdate(args = {}) {
      return this._makeRequest({
        path: "/customers/update",
        ...args,
      });
    },
    customersSearch(args = {}) {
      return this._makeRequest({
        path: "/customers/search",
        ...args,
      });
    },
    productServiceOrdersGetAll(args = {}) {
      return this._makeRequest({
        path: "/productServiceOrders/getAll",
        ...args,
      });
    },
    servicesGetAll(args = {}) {
      return this._makeRequest({
        path: "/services/getAll",
        ...args,
      });
    },
    resourcesGetAll(args = {}) {
      return this._makeRequest({
        path: "/resources/getAll",
        ...args,
      });
    },
    ratesGetAll(args = {}) {
      return this._makeRequest({
        path: "/rates/getAll",
        ...args,
      });
    },
    ratesGetPricing(args = {}) {
      return this._makeRequest({
        path: "/rates/getPricing",
        ...args,
      });
    },
    companiesGetAll(args = {}) {
      return this._makeRequest({
        path: "/companies/getAll",
        ...args,
      });
    },
    businessSegmentsGetAll(args = {}) {
      return this._makeRequest({
        path: "/businessSegments/getAll",
        ...args,
      });
    },
    currenciesGetAll(args = {}) {
      return this._makeRequest({
        path: "/currencies/getAll",
        ...args,
      });
    },
    taxationsGetAll(args = {}) {
      return this._makeRequest({
        path: "/taxations/getAll",
        ...args,
      });
    },
    availabilityBlocksCreate(args = {}) {
      return this._makeRequest({
        path: "/availabilityBlocks/add",
        ...args,
      });
    },
    tasksCreate(args = {}) {
      return this._makeRequest({
        path: "/tasks/add",
        ...args,
      });
    },
    departmentsGetAll(args = {}) {
      return this._makeRequest({
        path: "/departments/getAll",
        ...args,
      });
    },
    ordersCreate(args = {}) {
      return this._makeRequest({
        path: "/orders/add",
        ...args,
      });
    },
    billsGetAll(args = {}) {
      return this._makeRequest({
        path: "/bills/getAll",
        ...args,
      });
    },
    billsGetPdf(args = {}) {
      return this._makeRequest({
        path: "/bills/getPdf",
        ...args,
      });
    },
    countriesGetAll(args = {}) {
      return this._makeRequest({
        path: "/countries/getAll",
        ...args,
      });
    },
    creditCardsGetAll(args = {}) {
      return this._makeRequest({
        path: "/creditCards/getAll",
        ...args,
      });
    },
    availabilityBlocksGetAll(args = {}) {
      return this._makeRequest({
        path: "/availabilityBlocks/getAll",
        ...args,
      });
    },
    enterprisesGetAll(args = {}) {
      return this._makeRequest({
        path: "/enterprises/getAll",
        ...args,
      });
    },
    reservationGroupsGetAll(args = {}) {
      return this._makeRequest({
        path: "/reservationGroups/getAll",
        ...args,
      });
    },
    resourceCategoriesGetAll(args = {}) {
      return this._makeRequest({
        path: "/resourceCategories/getAll",
        ...args,
      });
    },
    ageCategoriesGetAll(args = {}) {
      return this._makeRequest({
        path: "/ageCategories/getAll",
        ...args,
      });
    },
    async paginate({
      requester,
      requesterArgs = {},
      resultKey,
      count = 100,
      maxRequests = 3,
    } = {}) {
      const items = [];
      let next;
      let requestCount = 0;

      while (true) {
        if (requestCount >= maxRequests) {
          break;
        }

        const response = await requester({
          ...requesterArgs,
          data: {
            ...requesterArgs?.data,
            Limitation: {
              Cursor: next,
              Count: count,
            },
          },
        });

        items.push(...(response?.[resultKey] || []));

        next = response?.Limitation?.Cursor ?? null;
        requestCount += 1;

        if (!next) {
          break;
        }
      }

      return items;
    },
  },
};

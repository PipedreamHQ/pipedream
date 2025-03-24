import { axios } from "@pipedream/platform";
import {
  DISCOUNT_TYPE_OPTIONS,
  GST_TREATMENT_OPTIONS,
  PLACE_OF_SUPPLY_OPTIONS,
  TAX_TREATMENT_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoho_books",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account Id",
      description: "ID of the cash/bank account the payment has to be deposited.",
      async options({ page }) {
        const { bankaccounts } = await this.listBankAccounts({
          params: {
            page: page + 1,
          },
        });

        return bankaccounts.map(({
          account_id: value, account_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactPersons: {
      type: "string[]",
      label: "Contact Persons",
      description: "IDs of the contact persons the thank you mail has to be triggered.",
      async options({
        page, customerId,
      }) {
        const { contact_persons: data } = await this.listContactPersons({
          customerId,
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          contact_person_id: value, first_name: fName, last_name: lName, email,
        }) => ({
          label: `${fName} ${lName} ${email}`,
          value,
        }));
      },
    },
    currencyId: {
      type: "string",
      label: "Currency Id",
      description: "The id of the customer.",
      async options({ page }) {
        const { currencies } = await this.listCurrencies({
          params: {
            page: page + 1,
          },
        });
        return currencies.map(({
          currency_id: value, currency_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer Id",
      description: "Customer ID of the customer involved in the payment.",
      async options({ page }) {
        const { contacts } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });
        return contacts.map(({
          contact_id: value, contact_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    expenseId: {
      type: "string",
      label: "Expense Id",
      async options({ page }) {
        const { expenses } = await this.listExpenses({
          params: {
            page: page + 1,
          },
        });
        return expenses.map(({
          expense_id: value, description: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    invoiceId: {
      type: "string",
      label: "Invoice Id",
      description: "ID of the invoice to get payments of.",
      async options({
        page, customerId,
      }) {
        const { invoices } = await this.listInvoices({
          params: {
            page: page + 1,
            customer_id: customerId,
          },
        });

        return invoices.map(({
          invoice_id: value, invoice_number: inv, customer_name: name,
        }) => ({
          label: `${inv} - ${name}`,
          value,
        }));
      },
    },
    itemId: {
      type: "string",
      label: "Item Id",
      description: "ID of the item to get details.",
      async options({ page }) {
        const { items } = await this.listItems({
          params: {
            page: page + 1,
          },
        });

        return items.map(({
          item_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    recurringInvoiceId: {
      type: "string",
      label: "Recurring Invoice Id",
      description: "ID of the recurring invoice from which the invoice is created.",
      async options({
        page, customerId,
      }) {
        const { recurring_invoices: data } = await this.listRecurringInvoices({
          params: {
            page: page + 1,
            customerId,
          },
        });

        return data.map(({
          recurring_invoice_id: value, recurrence_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    salesorderId: {
      type: "string",
      label: "Salesorder Id",
      description: "ID of the sales order to update.",
      async options({ page }) {
        const { salesorders } = await this.listSalesorders({
          params: {
            page: page + 1,
          },
        });

        return salesorders.map(({
          salesorder_id: value, salesorder_number: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taxAuthorityId: {
      type: "string",
      label: "Tax Authority Id",
      description: "ID of the tax authority. Tax authority depends on the location of the customer. For example, if the customer is located in NY, then the tax authority is NY tax authority.",
      async options({ page }) {
        const { tax_authorities: data } = await this.listTaxAuthorities({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          tax_authority_id: value, tax_authority_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taxExemptionId: {
      type: "string",
      label: "Tax Exemption Id",
      description: "ID of the tax exemption.",
      async options({ page }) {
        const { tax_exemptions: data } = await this.listTaxExemptions({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          tax_exemption_id: value, tax_exemption_code: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taxId: {
      type: "string",
      label: "Tax Id",
      description: "ID of the tax.",
      async options({ page }) {
        const { taxes } = await this.listTaxes({
          params: {
            page: page + 1,
          },
        });

        return taxes.map(({
          tax_id: value, tax_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "ID of the pdf template associated with the invoice.",
      async options({ page }) {
        const { templates } = await this.listTemplates({
          params: {
            page: page + 1,
          },
        });

        return templates.map(({
          template_id: value, template_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    timeEntryIds: {
      type: "string[]",
      label: "Time Entry Ids",
      description: "IDs of the time entries associated with the project.",
      async options({ page }) {
        const { time_entries: data } = await this.listTimeEntries({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          time_entry_id: value, task_name: tName, user_name: uName,
        }) => ({
          label: `${tName} - ${uName}`,
          value,
        }));
      },
    },
    date: {
      type: "string",
      label: "date",
      description: "The date, the sales order is created.",
    },
    shipmentDate: {
      type: "string",
      label: "Shipment Date",
      description: "Shipping date of sales order.",
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "A list of custom field objects for a sales order. **Example: {\"customfield_id\": \"1352827000000156060\", \"value\": \"value\" }** [See the documentation](https://www.zoho.com/books/api/v3/sales-order/#create-a-sales-order) for further details.",
    },
    placeOfSupply: {
      type: "string",
      label: "Place Of Supply",
      description: "Place where the goods/services are supplied to. (If not given, `place of contact` given for the contact will be taken).",
      options: PLACE_OF_SUPPLY_OPTIONS,
    },
    salespersonId: {
      type: "string",
      label: "Salesperson Id",
      description: "ID of the salesperson.",
    },
    merchantId: {
      type: "string",
      label: "Merchant Id",
      description: "ID of the merchant.",
    },
    gstTreatment: {
      type: "string",
      label: "GST Treatment",
      description: "Choose whether the contact is GST registered/unregistered/consumer/overseas.",
      options: GST_TREATMENT_OPTIONS,
    },
    gstNo: {
      type: "string",
      label: "GST No",
      description: "15 digit GST identification number of the customer.",
    },
    isInclusiveTax: {
      type: "boolean",
      label: "Is Inclusive Tax",
      description: "Used to specify whether the line item rates are inclusive or exclusive of tax.",
    },
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "A list of line items objects of a sales order. **Example: {\"item_order\": \"1352827000000156060\", \"name\": \"name\", \"description\": \"description\", \"quantity\": \"1\" }** [See the documentation](https://www.zoho.com/books/api/v3/sales-order/#create-a-sales-order) for further details.",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes for this Sales Order.",
    },
    terms: {
      type: "string",
      label: "Terms",
      description: "The terms added below expressing gratitude or for conveying some information.",
    },
    billingAddressId: {
      type: "string",
      label: "Billing Address Id",
      description: "ID of the Billing Address",
    },
    shippingAddressId: {
      type: "string",
      label: "Shipping Address Id",
      description: "ID of the Shipping Address.",
    },
    crmOwnerId: {
      type: "string",
      label: "CRM Owner Id",
    },
    crmCustomReferenceId: {
      type: "string",
      label: "CRM Custom Reference Id",
    },
    vatTreatment: {
      type: "string",
      label: "VAT Treatment",
      description: "Enter vat treatment.",
    },
    taxTreatment: {
      type: "string",
      label: "Tax Treatment",
      description: "VAT treatment for the invoice.",
      options: TAX_TREATMENT_OPTIONS,
    },
    salesorderNumber: {
      type: "string",
      label: "Salesorder Number",
      description: "Mandatory if auto number generation is disabled.",
    },
    referenceNumber: {
      type: "string",
      label: "Reference Number",
      description: "**For Customer Only** : If a contact is assigned to any particular user, that user can manage transactions for the contact",
    },
    isUpdateCustomer: {
      type: "boolean",
      label: "Is Update Customer",
      description: "Boolean to update billing address of customer.",
    },
    discount: {
      type: "string",
      label: "Discount",
      description: "Discount applied to the sales order. It can be either in % or in amount. e.g. 12.5% or 190.",
    },
    exchangeRate: {
      type: "string",
      label: "Exchange Rate",
      description: "Exchange rate of the currency.",
    },
    salespersonName: {
      type: "string",
      label: "Salesperson Name",
      description: "Name of the sales person.",
    },
    notesDefault: {
      type: "string",
      label: "Notes Default",
      description: "Default Notes for the Sales Order",
    },
    termsDefault: {
      type: "string",
      label: "Terms Default",
      description: "Default Terms of the Sales Order.",
    },
    taxAuthorityName: {
      type: "string",
      label: "Tax Authority Name",
      description: "Tax Authority's name.",
    },
    taxExemptionCode: {
      type: "string",
      label: "Tax Exemption Code",
      description: "Code of Tax Exemption that is applied.",
    },
    avataxExemptNo: {
      type: "string",
      label: "Avatax Exempt No",
      description: "Exemption certificate number of the customer.",
    },
    avataxUseCode: {
      type: "string",
      label: "Avatax Use Code",
      description: "Used to group like customers for exemption purposes. It is a custom value that links customers to a tax rule.",
    },
    shippingCharge: {
      type: "string",
      label: "Shipping Charge",
      description: "Shipping charges applied to the invoice.",
    },
    adjustment: {
      type: "string",
      label: "Adjustment",
    },
    deliveryMethod: {
      type: "string",
      label: "Delivery Method",
    },
    isDiscountBeforeTax: {
      type: "boolean",
      label: "Is Discount Before Tax",
      description: "Used to specify how the discount has to applied. Either before or after the calculation of tax.",
    },
    discountType: {
      type: "string",
      label: "Discount Type",
      description: "How the discount is specified. Allowed values are entity_level or item_level.",
      options: DISCOUNT_TYPE_OPTIONS,
    },
    adjustmentDescription: {
      type: "string",
      label: "Adjustment Description",
    },
    pricebookId: {
      type: "string",
      label: "Pricebook Id",
    },
    pdfTemplateId: {
      type: "string",
      label: "Template Id",
      description: "ID of the PDF template.",
    },
    documents: {
      type: "string[]",
      label: "Documents",
      description: "A list of documents.",
    },
    zcrmPotentialId: {
      type: "string",
      label: "ZCRM Potential Id",
    },
    zcrmPotentialName: {
      type: "string",
      label: "ZCRM Potential Name",
    },
    ignoreAutoNumberGeneration: {
      type: "boolean",
      label: "Ignore Auto Number Generation",
      description: "Ignore auto sales order number generation for this sales order. This mandates the sales order number.",
      default: false,
    },
    canSendInMail: {
      type: "string",
      label: "Can Send In Mail",
      description: "Can the file be sent in mail.",
    },
    totalFiles: {
      type: "string",
      label: "Total Files",
      description: "Total number of files.",
    },
    doc: {
      type: "string",
      label: "doc",
      description: "Document that is to be attached",
    },
    customBody: {
      type: "string",
      label: "Custom Body",
    },
    customSubject: {
      type: "string",
      label: "Custom Subject",
      optional: true,
    },
    send: {
      type: "boolean",
      label: "Send",
      description: "Send the estimate to the contact person(s) associated with the estimate.",
    },
    paymentTerms: {
      type: "integer",
      label: "Payment Terms",
      description: "Payment terms in days e.g. 15, 30, 60. Invoice due date will be calculated based on this. Max-length [100]",
    },
    paymentTermsLabel: {
      type: "string",
      label: "Payment Terms Label",
      description: "Used to override the default payment terms label. Default value for 15 days is \"Net 15 Days\". Max-length [100]",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_domain}/books/v3`;
    },
    _headers(headers = {}) {
      return {
        ...headers,
        Authorization: `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
      };
    },
    _params(params = {}) {
      return {
        ...params,
        organization_id: `${this.$auth.organization_id}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        params: this._params(params),
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    createCustomerPayment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customerpayments",
        ...opts,
      });
    },
    createEmployee(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/employees",
        ...opts,
      });
    },
    createEstimate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/estimates",
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        ...opts,
      });
    },
    createItem(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/items",
        ...opts,
      });
    },
    createSalesorder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/salesorders",
        ...opts,
      });
    },
    deleteContact({
      customerId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${customerId}`,
        ...opts,
      });
    },
    getInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `/invoices/${invoiceId}`,
        ...opts,
      });
    },
    getItem({
      itemId, ...opts
    }) {
      return this._makeRequest({
        path: `/items/${itemId}`,
        ...opts,
      });
    },
    listBankAccounts(opts = {}) {
      return this._makeRequest({
        path: "/bankaccounts",
        ...opts,
      });
    },
    listContactPersons({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/${customerId}/contactpersons`,
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listCurrencies(opts = {}) {
      return this._makeRequest({
        path: "/settings/currencies",
        ...opts,
      });
    },
    listExpenses(opts = {}) {
      return this._makeRequest({
        path: "/expenses",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
    listItems(opts = {}) {
      return this._makeRequest({
        path: "/items",
        ...opts,
      });
    },
    listRecurringInvoices(opts = {}) {
      return this._makeRequest({
        path: "/recurringinvoices",
        ...opts,
      });
    },
    listSalesorders(opts = {}) {
      return this._makeRequest({
        path: "/salesorders",
        ...opts,
      });
    },
    listTaxAuthorities(opts = {}) {
      return this._makeRequest({
        path: "/settings/taxauthorities",
        ...opts,
      });
    },
    listTaxes(opts = {}) {
      return this._makeRequest({
        path: "/settings/taxes",
        ...opts,
      });
    },
    listTaxExemptions(opts = {}) {
      return this._makeRequest({
        path: "/settings/taxexemptions",
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/invoices/templates",
        ...opts,
      });
    },
    listTimeEntries(opts = {}) {
      return this._makeRequest({
        path: "/projects/timeentries",
        ...opts,
      });
    },
    updateSalesorder({
      salesorderId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/salesorders/${salesorderId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, fieldName, ...opts
    }) {
      let hasMore = false;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data[fieldName]) {
          yield d;
        }

        hasMore = data[fieldName].length;

      } while (hasMore);
    },
  },
};

import { parseObject } from "../../common/utils.mjs";
import freshbooks from "../../freshbooks.app.mjs";

export default {
  key: "freshbooks-update-invoice",
  name: "Update Invoice",
  description: "Update an existing invoice in FreshBooks. [See the documentation](https://www.freshbooks.com/api/invoices)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    freshbooks,
    accountId: {
      propDefinition: [
        freshbooks,
        "accountId",
      ],
    },
    invoiceId: {
      propDefinition: [
        freshbooks,
        "invoiceId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    clientId: {
      propDefinition: [
        freshbooks,
        "clientId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
      optional: true,
    },
    invoiceNumber: {
      propDefinition: [
        freshbooks,
        "invoiceNumber",
      ],
    },
    createDate: {
      propDefinition: [
        freshbooks,
        "createDate",
      ],
    },
    generationDate: {
      propDefinition: [
        freshbooks,
        "generationDate",
      ],
    },
    discountValue: {
      propDefinition: [
        freshbooks,
        "discountValue",
      ],
    },
    discountDescription: {
      propDefinition: [
        freshbooks,
        "discountDescription",
      ],
    },
    poNumber: {
      propDefinition: [
        freshbooks,
        "poNumber",
      ],
    },
    currencyCode: {
      propDefinition: [
        freshbooks,
        "currencyCode",
      ],
    },
    language: {
      propDefinition: [
        freshbooks,
        "language",
      ],
    },
    terms: {
      propDefinition: [
        freshbooks,
        "terms",
      ],
    },
    notes: {
      propDefinition: [
        freshbooks,
        "notes",
      ],
    },
    address: {
      propDefinition: [
        freshbooks,
        "address",
      ],
    },
    street: {
      propDefinition: [
        freshbooks,
        "street",
      ],
    },
    street2: {
      propDefinition: [
        freshbooks,
        "street2",
      ],
    },
    city: {
      propDefinition: [
        freshbooks,
        "city",
      ],
    },
    province: {
      propDefinition: [
        freshbooks,
        "province",
      ],
    },
    code: {
      propDefinition: [
        freshbooks,
        "code",
      ],
    },
    country: {
      propDefinition: [
        freshbooks,
        "country",
      ],
    },
    dueOffsetDays: {
      propDefinition: [
        freshbooks,
        "dueOffsetDays",
      ],
    },
    lines: {
      propDefinition: [
        freshbooks,
        "lines",
      ],
    },
  },
  async run({ $ }) {
    const {
      freshbooks,
      accountId,
      invoiceId,
      clientId,
      invoiceNumber,
      createDate,
      generationDate,
      discountValue,
      discountDescription,
      poNumber,
      currencyCode,
      language,
      terms,
      notes,
      address,
      street,
      street2,
      city,
      province,
      code,
      country,
      dueOffsetDays,
      lines,
    } = this;

    const invoice = {};
    if (clientId) invoice.customerid = clientId;
    if (createDate) invoice.create_date = createDate;
    if (generationDate) invoice.generation_date = generationDate;
    if (notes) invoice.notes = notes;
    if (terms) invoice.terms = terms;
    if (dueOffsetDays) invoice.due_offset_days = dueOffsetDays;
    if (discountValue) invoice.discount_value = discountValue && parseFloat(discountValue);
    if (discountDescription) invoice.discount_description = discountDescription;
    if (poNumber) invoice.po_number = poNumber;
    if (currencyCode) invoice.currency_code = currencyCode;
    if (language) invoice.language = language;
    if (address) invoice.address = address;
    if (street) invoice.street = street;
    if (street2) invoice.street2 = street2;
    if (city) invoice.city = city;
    if (province) invoice.province = province;
    if (code) invoice.code = code;
    if (country) invoice.country = country;
    if (invoiceNumber) invoice.invoice_number = invoiceNumber;
    if (lines) invoice.lines = parseObject(lines);

    const { response } = await freshbooks.updateInvoice({
      $,
      accountId,
      invoiceId,
      data: {
        invoice,
      },
    });
    $.export("$summary", `Updated invoice ${response.result.invoice.invoice_number || response.result.invoice.id}`);
    return response.result.invoice;
  },
};

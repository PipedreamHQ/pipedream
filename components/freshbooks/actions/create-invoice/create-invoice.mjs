import { parseObject } from "../../common/utils.mjs";
import freshbooks from "../../freshbooks.app.mjs";

export default {
  key: "freshbooks-create-invoice",
  name: "Create Invoice",
  description: "Create a new invoice in FreshBooks. [See the documentation](https://www.freshbooks.com/api/invoices)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    clientId: {
      propDefinition: [
        freshbooks,
        "clientId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
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
      clientId,
      createDate,
      generationDate,
      currencyCode,
      lines,
      notes,
      terms,
      dueOffsetDays,
      invoiceNumber,
      discountValue,
      discountDescription,
      poNumber,
      language,
      address,
      street,
      street2,
      city,
      province,
      code,
      country,
    } = this;

    const invoice = {
      customerid: clientId,
      create_date: createDate || new Date().toISOString()
        .slice(0, 10),
    };
    if (generationDate) invoice.generation_date = generationDate;
    if (notes) invoice.notes = notes;
    if (terms) invoice.terms = terms;
    if (dueOffsetDays != null) invoice.due_offset_days = dueOffsetDays;
    if (invoiceNumber) invoice.invoice_number = invoiceNumber;
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
    if (lines) invoice.lines = parseObject(lines);

    const { response } = await freshbooks.createInvoice({
      $,
      accountId,
      data: {
        invoice,
      },
    });

    const responseInvoice = response.result.invoice;

    $.export("$summary", `Successfully created invoice with ID ${responseInvoice.id}`);
    return responseInvoice;
  },
};

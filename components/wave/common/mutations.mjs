export const CREATE_CUSTOMER_MUTATION = `
  mutation ($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      didSucceed
      inputErrors {
        code
        message
        path
      }
      customer {
        id
        name
        firstName
        lastName
        email
        address {
          addressLine1
          addressLine2
          city
          province {
            code
            name
          }
          country {
            code
            name
          }
          postalCode
        }
        currency {
          code
        }
      }
    }
  }
`;

export const CREATE_INVOICE_MUTATION = `
  mutation ($input: InvoiceCreateInput!) {
    invoiceCreate(input: $input) {
      didSucceed
      inputErrors {
        message
        code
        path
      }
      invoice {
        id
        createdAt
        modifiedAt
        pdfUrl
        viewUrl
        status
        title
        subhead
        invoiceNumber
        invoiceDate
        poNumber
        customer {
          id
          name
          # Can add additional customer fields here
        }
        currency {
          code
        }
        dueDate
        amountDue {
          value
          currency {
            symbol
          }
        }
        amountPaid {
          value
          currency {
            symbol
          }
        }
        taxTotal {
          value
          currency {
            symbol
          }
        }
        total {
          value
          currency {
            symbol
          }
        }
        exchangeRate
        footer
        memo
        disableCreditCardPayments
        disableBankPayments
        itemTitle
        unitTitle
        priceTitle
        amountTitle
        hideName
        hideDescription
        hideUnit
        hidePrice
        hideAmount
        items {
          product {
            id
            name
            # Can add additional product fields here
          }
          description
          quantity
          price
          subtotal {
            value
            currency {
              symbol
            }
          }
          total {
            value
            currency {
              symbol
            }
          }
          account {
            id
            name
            subtype {
              name
              value
            }
            # Can add additional account fields here
          }
          taxes {
            amount {
              value
            }
            salesTax {
              id
              name
              # Can add additional sales tax fields here
            }
          }
        }
        lastSentAt
        lastSentVia
        lastViewedAt
      }
    }
  }
`;

const LIST_ABANDONED_CHECKOUTS = `
  query AbandonedCheckouts($first: Int, $after: String) {
    abandonedCheckouts(first: $first, after: $after) {
      nodes {
        abandonedCheckoutUrl
        billingAddress {
          country
        }
        completedAt
        createdAt
        customer {
          firstName
          lastName
          email
        }
        id
        shippingAddress {
          country
        }
        updatedAt
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_BLOG_ARTICLES = `
  query BlogShow($id: ID!, $first: Int, $after: String, $reverse: Boolean) {
    blog(id: $id) {
      articles(first: $first, after: $after, reverse: $reverse) {
        nodes {
          id
          title
          author {
            name
          }
          blog {
            id
          }
          body
          createdAt
          updatedAt
          isPublished
          publishedAt
          summary
          tags
          metafields (first: $first) {
            nodes {
              id
              key
              namespace
              value
              type
            }
          }
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const LIST_BLOGS = `
  query BlogList($first: Int, $after: String) {
    blogs(first: $first, after: $after) {
      nodes {
        id
        title
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_PAGES = `
  query PageList($first: Int, $after: String, $reverse: Boolean) {
    pages(first: $first, after: $after, reverse: $reverse) {
      nodes {
        id
        title
        body
        bodySummary
        createdAt
        handle
        isPublished
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
        publishedAt
        updatedAt
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_PRODUCTS = `
  query ($first: Int, $after: String, $reverse: Boolean, $sortKey: ProductSortKeys, $query: String) {
    products (first: $first, after: $after, reverse: $reverse, sortKey: $sortKey, query: $query) {
      nodes {
        id
        title
        category {
          id
        }
        collections (first: $first) {
          nodes {
            id
            title
          }
        }
        createdAt
        description
        handle
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
        onlineStoreUrl
        productType
        publishedAt
        status
        tags
        totalInventory
        updatedAt
        variants (first: $first) {
          nodes {
            id
            title
          }
        }
        vendor
        options (first: $first) {
          id
          name
        }
      } 
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_COLLECTIONS = `
  query CustomCollectionList($first: Int, $after: String, $reverse: Boolean, $query: String) {
    collections(first: $first, after: $after, reverse: $reverse, query: $query) {
      nodes {
        id
        title
        description
        descriptionHtml
        handle
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
        products (first: $first) {
          nodes {
            id
            title
          }
        }
        productsCount {
          count
        }
        seo {
          title
          description
        }
        updatedAt
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_PRODUCT_VARIANTS = `
  query ($first: Int, $after: String, $query: String) {
    productVariants (first: $first, after: $after, query: $query) {
      nodes {
        id
        title
        inventoryItem {
          id
        }
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_METAOBJECTS = `
  query ($type: String!, $first: Int, $after: String) {
    metaobjects(type: $type, first: $first, after: $after) {
      nodes {
        id
        handle
        type
        displayName
        updatedAt
        fields {
          key
          type
          value
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_METAOBJECT_DEFINITIONS = `
  query ($first: Int, $after: String) {
    metaobjectDefinitions(first: $first, after: $after) {
      nodes {
        id
        name
        type
        fieldDefinitions {
          key
          type {
            name
          }
          name
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_LOCATIONS = `
  query ($first: Int, $after: String) {
    locations(first: $first, after: $after) {
      nodes {
        id
        name
        address {
          formatted
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const GET_PRODUCT = `
  query ($id: ID!, $first: Int, $after: String) {
    product (id: $id) {
      id
      title
      media (first: $first, after: $after) {
        nodes {
          id
        }
        pageInfo {
          endCursor
        }
      }
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
      options (first: $first) {
        id
        name
        optionValues {
          id
          name
        }
      }
    },
  }
`;

const GET_PRODUCT_VARIANT = `
  query ($id: ID!, $first: Int, $after: String) {
    productVariant (id: $id) {
      id
      title
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_COLLECTION = `
  query ($id: ID!, $first: Int, $after: String) {
    collection(id: $id) {
      id
      title
      handle
      updatedAt
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_BLOG = `
  query BlogShow($id: ID!, $first: Int, $after: String) {
    blog(id: $id) {
      id
      title
      handle
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_PAGE = `
  query PageShow($id: ID!, $first: Int, $after: String) {
    page(id: $id) {
      id
      title
      handle
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_ARTICLE = `
  query ArticleShow($id: ID!, $first: Int, $after: String) {
    article(id: $id) {
      id
      author {
        name
      }
      createdAt
      handle
      metafields (first: $first, after: $after) {
        nodes {
          id
          key
          namespace
          value
          type
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;

const GET_METAOBJECT = `
  query ($id: ID!) {
    metaobject(id: $id) {
      id
      handle
      type
      displayName
      updatedAt
      fields {
        key
        type
        value
        definition {
          name
        }
      }
    }
  }
`;

const LIST_ORDERS = `
  query ($first: Int, $after: String, $reverse: Boolean, $query: String){
    orders(first: $first, after: $after, reverse: $reverse, query: $query) {
      nodes {
        id
        name
        createdAt
        updatedAt
        processedAt
        currencyCode
        displayFinancialStatus
        displayFulfillmentStatus
        closed
        confirmed
        test
        note
        tags
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        subtotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        totalTaxSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        totalShippingPriceSet {
          shopMoney {
            amount
            currencyCode
          }
          presentmentMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          displayName
          firstName
          lastName
          email
          phone
          defaultAddress {
            id
            address1
            address2
            city
            province
            zip
            country
            company
          }
        }
        shippingAddress {
          address1
          address2
          city
          province
          zip
          country
          company
          firstName
          lastName
        }
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              variantTitle
              vendor
              fulfillmentStatus
              originalUnitPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
              variant {
                id
                title
                sku
                price
                image {
                  url
                  altText
                }
              }
              product {
                id
                title
                handle
                vendor
                productType
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        fulfillments {
          id
          status
          displayStatus
        }
        metafields (first: $first) {
          nodes {
            id
            key
            namespace
            value
            type
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const GET_DRAFT_ORDER = `
  query ($id: ID!) {
    draftOrder(id: $id) {
      id
      name
      email
      note2
      createdAt
      updatedAt
      completedAt
      invoiceSentAt
      status
      totalPriceSet
      subtotalPriceSet
      totalShippingPriceSet
      totalTaxSet
      currencyCode
      taxExempt
      taxesIncluded
      invoiceUrl
      billingAddress {
        address1
        address2
        city
        company
        country
        countryCodeV2
        firstName
        lastName
        phone
        province
        provinceCode
        zip
        name
        latitude
        longitude
      }
      shippingAddress {
        address1
        address2
        city
        company
        country
        countryCodeV2
        firstName
        lastName
        phone
        province
        provinceCode
        zip
        name
        latitude
        longitude
      }
      customer {
        id
        defaultEmailAddress
        firstName
        lastName
        phone
        state
        tags
      }
      lineItems(first: 250) {
        nodes {
          id
          name
          quantity
          sku
          vendor
          title
          requiresShipping
          taxable
          weight {
            unit
            value
          }
          product {
            id
            title
          }
          variant {
            id
            title
          }
        }
      }
      appliedDiscount {
        title
        value
        valueType
      }
      order {
        id
        name
      }
      shippingLine {
        id
        title
        code
        source
        custom
        carrierIdentifier
        deliveryCategory
        discountedPriceSet {
          presentmentMoney {
            amount
            currencyCode
          }
          shopMoney {
            amount
            currencyCode
          }
        }
      }
      taxLines {
        title
        rate
        ratePercentage
        priceSet {
          presentmentMoney {
            amount
            currencyCode
          }
          shopMoney {
            amount
            currencyCode
          }
        }
      }
      tags
    }
  }
`;

const LIST_DRAFT_ORDERS = `
  query ($first: Int, $after: String, $reverse: Boolean, $sortKey: DraftOrderSortKeys, $query: String) {
    draftOrders(first: $first, after: $after, reverse: $reverse, sortKey: $sortKey, query: $query) {
      nodes {
        id
        name
        email
        note2
        createdAt
        updatedAt
        completedAt
        invoiceSentAt
        status
        totalPrice
        subtotalPrice
        totalShippingPrice
        totalTax
        currencyCode
        taxExempt
        taxesIncluded
        invoiceUrl
        billingAddress {
          address1
          address2
          city
          company
          country
          countryCode
          firstName
          lastName
          phone
          province
          provinceCode
          zip
          name
          latitude
          longitude
        }
        shippingAddress {
          address1
          address2
          city
          company
          country
          countryCode
          firstName
          lastName
          phone
          province
          provinceCode
          zip
          name
          latitude
          longitude
        }
        customer {
          id
          email
          firstName
          lastName
          phone
          state
          tags
        }
        lineItems(first: 250) {
          nodes {
            id
            name
            quantity
            sku
            vendor
            title
            requiresShipping
            taxable
            weight {
              unit
              value
            }
            product {
              id
              title
            }
            variant {
              id
              title
            }
          }
        }
        appliedDiscount {
          title
          value
          valueType
        }
        order {
          id
          name
        }
        shippingLine {
          id
          title
          code
          source
          custom
          carrierIdentifier
          deliveryCategory
          discountedPriceSet {
            presentmentMoney {
              amount
              currencyCode
            }
            shopMoney {
              amount
              currencyCode
            }
          }
        }
        taxLines {
          title
          rate
          ratePercentage
          priceSet {
            presentmentMoney {
              amount
              currencyCode
            }
            shopMoney {
              amount
              currencyCode
            }
          }
        }
        tags
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const GET_CUSTOMER = `
  query ($id: ID!) {
    customer(id: $id) {
      id
      firstName
      lastName
      createdAt
      updatedAt
      state
      note
      verifiedEmail
      taxExempt
      tags
      addresses {
        address1
        address2
        city
        company
        country
        countryCodeV2
        firstName
        lastName
        phone
        province
        provinceCode
        zip
      }
      defaultAddress {
        address1
        address2
        city
        company
        country
        countryCodeV2
        firstName
        lastName
        phone
        province
        provinceCode
        zip
      }
    }
  }
`;

const LIST_CUSTOMERS = `
  query ($first: Int, $after: String, $reverse: Boolean, $sortKey: CustomerSortKeys, $query: String) {
    customers(first: $first, after: $after, reverse: $reverse, sortKey: $sortKey, query: $query) {
      nodes {
        id
        email
        firstName
        lastName
        phone
        createdAt
        updatedAt
        state
        note
        verifiedEmail
        taxExempt
        tags
        addresses {
          address1
          address2
          city
          company
          country
          countryCodeV2
          firstName
          lastName
          phone
          province
          provinceCode
          zip
        }
        defaultAddress {
          address1
          address2
          city
          company
          country
          countryCodeV2
          firstName
          lastName
          phone
          province
          provinceCode
          zip
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const LIST_ASSIGNED_FULFILLMENT_ORDERS = `
  query ($first: Int, $after: String, $reverse: Boolean, $sortKey: FulfillmentOrderSortKeys) {
    assignedFulfillmentOrders(first: $first, after: $after, reverse: $reverse, sortKey: $sortKey) {
      nodes {
        id
        status
        createdAt
         updatedAt
        requestStatus
        order {
          id
          name
        }
        assignedLocation {
          location {
            id
            name
          }
        }
        destination {
          address1
          address2
          city
          company
          countryCodeV2
          firstName
          lastName
          phone
          province
          zip
        }
        lineItems(first: $first) {
          nodes {
            id
            remainingQuantity
            totalQuantity
            lineItem {
              id
              name
              sku
            }
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const GET_FULFILLMENT_ORDER = `
  query ($id: ID!, $first: Int) {
    fulfillmentOrder(id: $id) {
      id
      status
      createdAt
      updatedAt
      requestStatus
      order {
        id
        name
      }
      assignedLocation {
        location {
          id
          name
        }
      }
      destination {
        address1
        address2
        city
        company
        country
        countryCodeV2
        firstName
        lastName
        phone
        province
        provinceCode
        zip
      }
      lineItems(first: $first) {
        nodes {
          id
          remainingQuantity
          totalQuantity
          lineItem {
            id
            name
            sku
          }
        }
      }
    }
  }
`;

const LIST_FULFILLMENT_ORDERS = `
  query ($first: Int, $after: String, $reverse: Boolean, $sortKey: FulfillmentOrderSortKeys, $query: String) {
    fulfillmentOrders(first: $first, after: $after, reverse: $reverse, sortKey: $sortKey, query: $query) {
      nodes {
        id
        status
        createdAt
        updatedAt
        requestStatus
        order {
          id
          name
        }
        assignedLocation {
          location {
            id
            name
          }
        }
        destination {
          address1
          address2
          city
          company
          countryCodeV2
          firstName
          lastName
          phone
          province
          zip
        }
        lineItems(first: $first) {
          nodes {
            id
            remainingQuantity
            totalQuantity
            lineItem {
              id
              name
              sku
            }
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

export default {
  LIST_ABANDONED_CHECKOUTS,
  LIST_BLOG_ARTICLES,
  LIST_BLOGS,
  LIST_PAGES,
  LIST_PRODUCTS,
  LIST_COLLECTIONS,
  LIST_PRODUCT_VARIANTS,
  LIST_METAOBJECTS,
  LIST_METAOBJECT_DEFINITIONS,
  LIST_LOCATIONS,
  GET_PRODUCT,
  GET_PRODUCT_VARIANT,
  GET_COLLECTION,
  GET_BLOG,
  GET_PAGE,
  GET_ARTICLE,
  GET_METAOBJECT,
  LIST_ORDERS,
  GET_DRAFT_ORDER,
  LIST_DRAFT_ORDERS,
  GET_CUSTOMER,
  LIST_CUSTOMERS,
  LIST_ASSIGNED_FULFILLMENT_ORDERS,
  GET_FULFILLMENT_ORDER,
  LIST_FULFILLMENT_ORDERS,
};

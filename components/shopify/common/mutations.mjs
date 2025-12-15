const CREATE_WEBHOOK = `
  mutation webhookSubscriptionCreate(
    $topic: WebhookSubscriptionTopic!,
    $webhookSubscription: WebhookSubscriptionInput!
  ) {
    webhookSubscriptionCreate(
      topic: $topic,
      webhookSubscription: $webhookSubscription
    ) {
      webhookSubscription {
        id
        topic
        filter
        format
        callbackUrl
      }
      userErrors {
        field
        message
      }
    }
  }`;

const DELETE_WEBHOOK = `
  mutation webhookSubscriptionDelete($id: ID!) {
    webhookSubscriptionDelete(id: $id) {
      userErrors {
        field
        message
      }
      deletedWebhookSubscriptionId
    }
  }
`;

const ADD_TAGS = `
  mutation tagsAdd($gid: ID!, $tags: [String!]!) {
    tagsAdd(id: $gid, tags: $tags) {
      node {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_PRODUCTS_TO_COLLECTION = `
  mutation collectionAddProductsV2($id: ID!, $productIds: [ID!]!) {
    collectionAddProductsV2(id: $id, productIds: $productIds) {
      job {
        done
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_ARTICLE = `
  mutation CreateArticle($article: ArticleCreateInput!) {
    articleCreate(article: $article) {
      article {
        id
        title
        author {
          name
        }
        handle
        body
        summary
        tags
        image {
          altText
          originalSrc
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_BLOG = `
  mutation CreateBlog($blog: BlogCreateInput!) {
    blogCreate(blog: $blog) {
      blog {
        id
        title
        handle
        templateSuffix
        commentPolicy
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_COLLECTION = `
  mutation createCollectionMetafields($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        title
        metafields(first: 50) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
        }
      }
      userErrors {
        message
        field
      }
    }
  }
`;

const CREATE_PAGE = `
  mutation CreatePage($page: PageCreateInput!) {
    pageCreate(page: $page) {
      page {
        id
        title
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_PRODUCT = `
  mutation ($product: ProductCreateInput, $media: [CreateMediaInput!]) {
    productCreate(product: $product, media: $media) {
      product {
        id
        title
        options {
          id
          name
          position
          values
          optionValues {
            id
            name
            hasVariants
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_METAFIELD = `
  mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition {
          id
          name
        }
        userErrors {
          field
          message
        }
      }
    }
`;

const CREATE_METAOBJECT = `
  mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject {
        id
        handle
        type
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_PRODUCT_VARIANTS = `
  mutation ProductVariantsCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkCreate(productId: $productId, variants: $variants) {
      productVariants {
        id
        title
        selectedOptions {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_METAFIELD = `
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_METAOBJECT = `
  mutation metaobjectUpdate ($id: ID!, $metaobject: MetaobjectUpdateInput!) {
    metaobjectUpdate(id: $id, metaobject: $metaobject) {
      metaobject {
        id
        type
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_PRODUCT = `
  mutation UpdateProductWithNewMedia($input: ProductInput!, $media: [CreateMediaInput!]) {
    productUpdate(input: $input, media: $media) {
      product {
        id
        title
        options {
          id
          name
          position
          values
          optionValues {
            id
            name
            hasVariants
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_ARTICLE = `
  mutation UpdateArticle($id: ID!, $article: ArticleUpdateInput!) {
    articleUpdate(id: $id, article: $article) {
      article {
        id
        title
        handle
        body
        summary
        tags
        image {
          altText
          originalSrc
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_PAGE = `
  mutation UpdatePage($id: ID!, $page: PageUpdateInput!) {
    pageUpdate(id: $id, page: $page) {
      page {
        id
        title
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_INVENTORY_LEVEL = `
  mutation inventorySetOnHandQuantities($input: InventorySetOnHandQuantitiesInput!) {
    inventorySetOnHandQuantities(input: $input) {
      inventoryAdjustmentGroup {
        createdAt
        reason
        referenceDocumentUri
        changes {
          name
          delta
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_PRODUCT_VARIANT = `
  mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      product {
        id
      }
      productVariants {
        id
        title
        selectedOptions {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DELETE_ARTICLE = `
  mutation DeleteArticle($id: ID!) {
    articleDelete(id: $id) {
      deletedArticleId
      userErrors {
        field
        message
      }
    }
  }
`;

const DELETE_BLOG = `
  mutation DeleteBlog($id: ID!) {
    blogDelete(id: $id) {
      deletedBlogId
      userErrors {
        field
        message
      }
    }
  }
`;

const DELETE_PAGE = `
  mutation DeletePage($id: ID!) {
    pageDelete(id: $id) {
      deletedPageId
      userErrors {
        field
        message
      }
    }
  }
`;

const DELETE_METAFIELD = `
  mutation MetafieldsDelete($metafields: [MetafieldIdentifierInput!]!) {
    metafieldsDelete(metafields: $metafields) {
      deletedMetafields {
        key
        namespace
        ownerId
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_ORDER = `
  mutation orderUpdate($input: OrderInput!) {
    orderUpdate(input: $input) {
      order {
        id
        name
        email
        tags
        note
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export default {
  CREATE_WEBHOOK,
  DELETE_WEBHOOK,
  ADD_TAGS,
  ADD_PRODUCTS_TO_COLLECTION,
  CREATE_ARTICLE,
  CREATE_BLOG,
  CREATE_COLLECTION,
  CREATE_PAGE,
  CREATE_PRODUCT,
  CREATE_PRODUCT_VARIANTS,
  CREATE_METAFIELD,
  CREATE_METAOBJECT,
  UPDATE_METAFIELD,
  UPDATE_METAOBJECT,
  UPDATE_PRODUCT,
  UPDATE_ARTICLE,
  UPDATE_PAGE,
  UPDATE_INVENTORY_LEVEL,
  UPDATE_PRODUCT_VARIANT,
  DELETE_ARTICLE,
  DELETE_BLOG,
  DELETE_PAGE,
  DELETE_METAFIELD,
  UPDATE_ORDER,
};

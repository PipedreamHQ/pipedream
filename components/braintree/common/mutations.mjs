const createCustomer = `
  mutation createCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      customer {
        id
        firstName
        lastName
        company
        email
        phoneNumber
        fax
        website
        createdAt
      }
    }
  }
`;

export default {
  createCustomer,
};

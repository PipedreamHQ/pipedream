export default {
  searchPeople: `
    query SearchPeople($input: SearchPeopleInput!) {
      searchPeople(input: $input) {
        results {
          _id
          name {
            first
            fullName
            last
            middle
          }
          currentPositions {
            companyId
            title
            updatedAt
            emails {
              type
              status
              updatedAt
              value
            }
            companyInfo {
              name
              alternativeNames
              domain
              description
              emailDomains
              type
              phones
              country
            }
          }
          pastPositions {
            companyId
            title
            updatedAt
            emails {
              type
              status
              updatedAt
              value
            }
            companyInfo {
              name
              alternativeNames
              domain
              description
              emailDomains
              type
              phones
              country
            }
          }
        }
      }
    }
  `,
};

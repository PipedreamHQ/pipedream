/**
 * Mock data for DealCloud API endpoints
 * Used for testing without actual API access
 */

/**
 * Mock response for GET /schema/entrytypes
 * Returns a list of entry types (objects/entities) available in DealCloud
 *
 * Each entry type represents a different object type like Company, Contact, Deal, etc.
 */
export const mockEntryTypes = [
  {
    id: 1,
    name: "Company",
    description: "Companies and organizations",
    isActive: true,
    isSystem: false,
    iconName: "building",
    pluralName: "Companies",
  },
  {
    id: 2,
    name: "Contact",
    description: "Individual contacts and people",
    isActive: true,
    isSystem: false,
    iconName: "user",
    pluralName: "Contacts",
  },
  {
    id: 3,
    name: "Deal",
    description: "Investment deals and opportunities",
    isActive: true,
    isSystem: false,
    iconName: "handshake",
    pluralName: "Deals",
  },
  {
    id: 4,
    name: "Fund",
    description: "Investment funds",
    isActive: true,
    isSystem: false,
    iconName: "piggy-bank",
    pluralName: "Funds",
  },
  {
    id: 5,
    name: "Portfolio Company",
    description: "Companies in the portfolio",
    isActive: true,
    isSystem: false,
    iconName: "briefcase",
    pluralName: "Portfolio Companies",
  },
];

/**
 * Mock response for GET /schema/entrytypes/{entryTypeId}/fields
 * Returns field definitions for a specific entry type
 *
 * Field types:
 * 1 = TEXT
 * 2 = CHOICE (dropdown/select)
 * 3 = NUMBER
 * 4 = DATE
 * 5 = REFERENCE (relationship to another entry type)
 * 6 = BOOLEAN
 * 7 = USER
 * 13 = BINARY
 * 14 = ENTRY_LIST_ID
 * 15 = COUNTER
 * 16 = IMAGE
 * 17 = DATA_SOURCE
 * 18 = CURRENCY
 */
export const mockEntryTypeFields = {
  // Company fields (entryTypeId: 1)
  1: [
    {
      id: 101,
      name: "Company Name",
      apiName: "CompanyName",
      fieldType: 1, // TEXT
      systemFieldType: 0,
      isRequired: true,
      isKey: true,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "The legal name of the company",
      maxLength: 255,
    },
    {
      id: 102,
      name: "Industry",
      apiName: "Industry",
      fieldType: 2, // CHOICE
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [
        10,
      ], // References entry list ID 10
      entryListId: 10,
      description: "The industry sector of the company",
    },
    {
      id: 103,
      name: "Revenue",
      apiName: "Revenue",
      fieldType: 3, // NUMBER
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: true,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Annual revenue",
      decimalPlaces: 2,
    },
    {
      id: 104,
      name: "Founded Date",
      apiName: "FoundedDate",
      fieldType: 4, // DATE
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Date the company was founded",
    },
    {
      id: 105,
      name: "Primary Contact",
      apiName: "PrimaryContact",
      fieldType: 5, // REFERENCE
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [
        2,
      ], // References Contact entry type
      entryListId: 2,
      description: "Primary contact person at the company",
    },
    {
      id: 106,
      name: "Is Active",
      apiName: "IsActive",
      fieldType: 6, // BOOLEAN
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Whether the company is actively being tracked",
    },
    {
      id: 107,
      name: "Account Manager",
      apiName: "AccountManager",
      fieldType: 7, // USER
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "User responsible for managing this company",
    },
    {
      id: 108,
      name: "Tags",
      apiName: "Tags",
      fieldType: 2, // CHOICE
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: true, // Multi-select field
      entryLists: [
        11,
      ],
      entryListId: 11,
      description: "Tags for categorizing the company",
    },
    {
      id: 109,
      name: "Valuation Currency",
      apiName: "ValuationCurrency",
      fieldType: 18, // CURRENCY
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Currency for company valuation",
    },
    {
      id: 110,
      name: "Employee Count",
      apiName: "EmployeeCount",
      fieldType: 3, // NUMBER
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Number of employees",
      decimalPlaces: 0,
    },
  ],
  // Contact fields (entryTypeId: 2)
  2: [
    {
      id: 201,
      name: "Full Name",
      apiName: "FullName",
      fieldType: 1, // TEXT
      systemFieldType: 0,
      isRequired: true,
      isKey: true,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Contact's full name",
      maxLength: 255,
    },
    {
      id: 202,
      name: "Email",
      apiName: "Email",
      fieldType: 1, // TEXT
      systemFieldType: 0,
      isRequired: true,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Contact's email address",
      maxLength: 255,
    },
    {
      id: 203,
      name: "Phone",
      apiName: "Phone",
      fieldType: 1, // TEXT
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Contact's phone number",
      maxLength: 50,
    },
    {
      id: 204,
      name: "Company",
      apiName: "Company",
      fieldType: 5, // REFERENCE
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [
        1,
      ], // References Company entry type
      entryListId: 1,
      description: "Company the contact works for",
    },
    {
      id: 205,
      name: "Title",
      apiName: "Title",
      fieldType: 1, // TEXT
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Job title",
      maxLength: 255,
    },
    {
      id: 206,
      name: "Contact Type",
      apiName: "ContactType",
      fieldType: 2, // CHOICE
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [
        12,
      ],
      entryListId: 12,
      description: "Type of contact",
    },
    {
      id: 207,
      name: "Is Primary",
      apiName: "IsPrimary",
      fieldType: 6, // BOOLEAN
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Whether this is a primary contact",
    },
  ],
  // Deal fields (entryTypeId: 3)
  3: [
    {
      id: 301,
      name: "Deal Name",
      apiName: "DealName",
      fieldType: 1, // TEXT
      systemFieldType: 0,
      isRequired: true,
      isKey: true,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Name of the deal",
      maxLength: 255,
    },
    {
      id: 302,
      name: "Deal Amount",
      apiName: "DealAmount",
      fieldType: 3, // NUMBER
      systemFieldType: 0,
      isRequired: true,
      isKey: false,
      isCalculated: false,
      isMoney: true,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Total deal value",
      decimalPlaces: 2,
    },
    {
      id: 303,
      name: "Deal Stage",
      apiName: "DealStage",
      fieldType: 2, // CHOICE
      systemFieldType: 0,
      isRequired: true,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [
        13,
      ],
      entryListId: 13,
      description: "Current stage of the deal",
    },
    {
      id: 304,
      name: "Target Company",
      apiName: "TargetCompany",
      fieldType: 5, // REFERENCE
      systemFieldType: 0,
      isRequired: true,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [
        1,
      ],
      entryListId: 1,
      description: "Company being acquired or invested in",
    },
    {
      id: 305,
      name: "Close Date",
      apiName: "CloseDate",
      fieldType: 4, // DATE
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Expected or actual close date",
    },
    {
      id: 306,
      name: "Deal Currency",
      apiName: "DealCurrency",
      fieldType: 18, // CURRENCY
      systemFieldType: 0,
      isRequired: true,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Currency for the deal",
    },
    {
      id: 307,
      name: "Deal Team",
      apiName: "DealTeam",
      fieldType: 7, // USER
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: true,
      entryLists: [],
      entryListId: null,
      description: "Team members working on the deal",
    },
    {
      id: 308,
      name: "Probability",
      apiName: "Probability",
      fieldType: 3, // NUMBER
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Probability of deal closing (0-100)",
      decimalPlaces: 0,
    },
  ],
  // Fund fields (entryTypeId: 4)
  4: [
    {
      id: 401,
      name: "Fund Name",
      apiName: "FundName",
      fieldType: 1, // TEXT
      systemFieldType: 0,
      isRequired: true,
      isKey: true,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Name of the fund",
      maxLength: 255,
    },
    {
      id: 402,
      name: "Fund Size",
      apiName: "FundSize",
      fieldType: 3, // NUMBER
      systemFieldType: 0,
      isRequired: true,
      isKey: false,
      isCalculated: false,
      isMoney: true,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Total fund size",
      decimalPlaces: 2,
    },
    {
      id: 403,
      name: "Fund Currency",
      apiName: "FundCurrency",
      fieldType: 18, // CURRENCY
      systemFieldType: 0,
      isRequired: true,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Currency of the fund",
    },
    {
      id: 404,
      name: "Vintage Year",
      apiName: "VintageYear",
      fieldType: 3, // NUMBER
      systemFieldType: 0,
      isRequired: true,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Year the fund was established",
      decimalPlaces: 0,
    },
    {
      id: 405,
      name: "Fund Status",
      apiName: "FundStatus",
      fieldType: 2, // CHOICE
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [
        14,
      ],
      entryListId: 14,
      description: "Current status of the fund",
    },
    {
      id: 406,
      name: "Fund Manager",
      apiName: "FundManager",
      fieldType: 7, // USER
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Primary fund manager",
    },
  ],
  // Portfolio Company fields (entryTypeId: 5)
  5: [
    {
      id: 501,
      name: "Portfolio Company Name",
      apiName: "PortfolioCompanyName",
      fieldType: 1, // TEXT
      systemFieldType: 0,
      isRequired: true,
      isKey: true,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Name of the portfolio company",
      maxLength: 255,
    },
    {
      id: 502,
      name: "Investment Amount",
      apiName: "InvestmentAmount",
      fieldType: 3, // NUMBER
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: true,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Total investment amount",
      decimalPlaces: 2,
    },
    {
      id: 503,
      name: "Investment Date",
      apiName: "InvestmentDate",
      fieldType: 4, // DATE
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Date of initial investment",
    },
    {
      id: 504,
      name: "Ownership Percentage",
      apiName: "OwnershipPercentage",
      fieldType: 3, // NUMBER
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Percentage ownership",
      decimalPlaces: 2,
    },
    {
      id: 505,
      name: "Related Fund",
      apiName: "RelatedFund",
      fieldType: 5, // REFERENCE
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [
        4,
      ],
      entryListId: 4,
      description: "Fund that made the investment",
    },
    {
      id: 506,
      name: "Board Representation",
      apiName: "BoardRepresentation",
      fieldType: 6, // BOOLEAN
      systemFieldType: 0,
      isRequired: false,
      isKey: false,
      isCalculated: false,
      isMoney: false,
      isMultiSelect: false,
      entryLists: [],
      entryListId: null,
      description: "Whether we have board representation",
    },
  ],
};

/**
 * Mock response for GET data/entrydata/{entryTypeId}/entries
 * Returns actual entry (record) data for a specific entry type
 *
 * Note: The response structure includes various field name formats:
 * - EntryId, Id, or id for the record ID
 * - Name for the display name
 * - Field values using the apiName from the field definitions
 */
export const mockEntries = {
  // Company entries (entryTypeId: 1)
  1: [
    {
      EntryId: 1001,
      Id: 1001,
      Name: "Acme Corporation",
      CompanyName: "Acme Corporation",
      Industry: 101, // References entry list item
      Revenue: 50000000.00,
      FoundedDate: "2010-03-15T00:00:00Z",
      PrimaryContact: 2001, // References Contact with ID 2001
      IsActive: true,
      AccountManager: 5001, // User ID
      Tags: [
        111,
        112,
      ], // Multiple entry list items
      ValuationCurrency: "USD",
      EmployeeCount: 250,
      CreatedDate: "2023-01-10T14:30:00Z",
      ModifiedDate: "2024-11-20T09:15:00Z",
    },
    {
      EntryId: 1002,
      Id: 1002,
      Name: "TechStart Inc",
      CompanyName: "TechStart Inc",
      Industry: 102,
      Revenue: 15000000.00,
      FoundedDate: "2018-07-22T00:00:00Z",
      PrimaryContact: 2002,
      IsActive: true,
      AccountManager: 5002,
      Tags: [
        111,
      ],
      ValuationCurrency: "USD",
      EmployeeCount: 75,
      CreatedDate: "2023-02-15T10:20:00Z",
      ModifiedDate: "2024-11-18T16:45:00Z",
    },
    {
      EntryId: 1003,
      Id: 1003,
      Name: "Global Ventures Ltd",
      CompanyName: "Global Ventures Ltd",
      Industry: 103,
      Revenue: 125000000.00,
      FoundedDate: "2005-11-08T00:00:00Z",
      PrimaryContact: 2003,
      IsActive: true,
      AccountManager: 5001,
      Tags: [
        112,
        113,
      ],
      ValuationCurrency: "EUR",
      EmployeeCount: 500,
      CreatedDate: "2023-03-20T11:00:00Z",
      ModifiedDate: "2024-11-22T13:30:00Z",
    },
  ],
  // Contact entries (entryTypeId: 2)
  2: [
    {
      EntryId: 2001,
      Id: 2001,
      Name: "John Smith",
      FullName: "John Smith",
      Email: "john.smith@acme.com",
      Phone: "+1-555-0101",
      Company: 1001, // References Company
      Title: "CEO",
      ContactType: 121,
      IsPrimary: true,
      CreatedDate: "2023-01-10T14:35:00Z",
      ModifiedDate: "2024-10-15T08:20:00Z",
    },
    {
      EntryId: 2002,
      Id: 2002,
      Name: "Sarah Johnson",
      FullName: "Sarah Johnson",
      Email: "sarah.j@techstart.io",
      Phone: "+1-555-0102",
      Company: 1002,
      Title: "Founder & CTO",
      ContactType: 121,
      IsPrimary: true,
      CreatedDate: "2023-02-15T10:25:00Z",
      ModifiedDate: "2024-11-10T14:15:00Z",
    },
    {
      EntryId: 2003,
      Id: 2003,
      Name: "Michael Chen",
      FullName: "Michael Chen",
      Email: "m.chen@globalventures.com",
      Phone: "+44-20-5555-0103",
      Company: 1003,
      Title: "Managing Director",
      ContactType: 121,
      IsPrimary: true,
      CreatedDate: "2023-03-20T11:05:00Z",
      ModifiedDate: "2024-11-15T10:00:00Z",
    },
    {
      EntryId: 2004,
      Id: 2004,
      Name: "Emily Rodriguez",
      FullName: "Emily Rodriguez",
      Email: "emily.r@acme.com",
      Phone: "+1-555-0104",
      Company: 1001,
      Title: "CFO",
      ContactType: 122,
      IsPrimary: false,
      CreatedDate: "2023-04-05T09:30:00Z",
      ModifiedDate: "2024-09-20T16:45:00Z",
    },
  ],
  // Deal entries (entryTypeId: 3)
  3: [
    {
      EntryId: 3001,
      Id: 3001,
      Name: "Series A - TechStart",
      DealName: "Series A - TechStart",
      DealAmount: 10000000.00,
      DealStage: 131, // Entry list item for stage
      TargetCompany: 1002,
      CloseDate: "2024-12-31T00:00:00Z",
      DealCurrency: "USD",
      DealTeam: [
        5001,
        5002,
      ],
      Probability: 75,
      CreatedDate: "2024-06-01T10:00:00Z",
      ModifiedDate: "2024-11-20T15:30:00Z",
    },
    {
      EntryId: 3002,
      Id: 3002,
      Name: "Acquisition - Acme Corp",
      DealName: "Acquisition - Acme Corp",
      DealAmount: 75000000.00,
      DealStage: 132,
      TargetCompany: 1001,
      CloseDate: "2025-03-15T00:00:00Z",
      DealCurrency: "USD",
      DealTeam: [
        5001,
        5003,
      ],
      Probability: 60,
      CreatedDate: "2024-08-10T14:20:00Z",
      ModifiedDate: "2024-11-23T11:15:00Z",
    },
    {
      EntryId: 3003,
      Id: 3003,
      Name: "Growth Investment - Global Ventures",
      DealName: "Growth Investment - Global Ventures",
      DealAmount: 25000000.00,
      DealStage: 133,
      TargetCompany: 1003,
      CloseDate: "2024-11-30T00:00:00Z",
      DealCurrency: "EUR",
      DealTeam: [
        5002,
      ],
      Probability: 90,
      CreatedDate: "2024-05-15T09:45:00Z",
      ModifiedDate: "2024-11-24T08:00:00Z",
    },
  ],
  // Fund entries (entryTypeId: 4)
  4: [
    {
      EntryId: 4001,
      Id: 4001,
      Name: "Growth Fund I",
      FundName: "Growth Fund I",
      FundSize: 500000000.00,
      FundCurrency: "USD",
      VintageYear: 2020,
      FundStatus: 141,
      FundManager: 5001,
      CreatedDate: "2020-01-15T10:00:00Z",
      ModifiedDate: "2024-10-01T14:30:00Z",
    },
    {
      EntryId: 4002,
      Id: 4002,
      Name: "Venture Fund II",
      FundName: "Venture Fund II",
      FundSize: 750000000.00,
      FundCurrency: "USD",
      VintageYear: 2022,
      FundStatus: 141,
      FundManager: 5002,
      CreatedDate: "2022-03-01T09:00:00Z",
      ModifiedDate: "2024-11-15T11:20:00Z",
    },
    {
      EntryId: 4003,
      Id: 4003,
      Name: "European Opportunities Fund",
      FundName: "European Opportunities Fund",
      FundSize: 300000000.00,
      FundCurrency: "EUR",
      VintageYear: 2023,
      FundStatus: 142,
      FundManager: 5003,
      CreatedDate: "2023-06-01T08:30:00Z",
      ModifiedDate: "2024-11-20T10:00:00Z",
    },
  ],
  // Portfolio Company entries (entryTypeId: 5)
  5: [
    {
      EntryId: 5001,
      Id: 5001,
      Name: "TechStart Inc",
      PortfolioCompanyName: "TechStart Inc",
      InvestmentAmount: 8000000.00,
      InvestmentDate: "2023-09-15T00:00:00Z",
      OwnershipPercentage: 15.5,
      RelatedFund: 4001,
      BoardRepresentation: true,
      CreatedDate: "2023-09-15T14:00:00Z",
      ModifiedDate: "2024-11-18T09:30:00Z",
    },
    {
      EntryId: 5002,
      Id: 5002,
      Name: "DataFlow Systems",
      PortfolioCompanyName: "DataFlow Systems",
      InvestmentAmount: 12000000.00,
      InvestmentDate: "2022-11-20T00:00:00Z",
      OwnershipPercentage: 22.3,
      RelatedFund: 4002,
      BoardRepresentation: true,
      CreatedDate: "2022-11-20T10:15:00Z",
      ModifiedDate: "2024-11-10T15:45:00Z",
    },
    {
      EntryId: 5003,
      Id: 5003,
      Name: "CloudScale Ltd",
      PortfolioCompanyName: "CloudScale Ltd",
      InvestmentAmount: 5000000.00,
      InvestmentDate: "2024-02-10T00:00:00Z",
      OwnershipPercentage: 10.0,
      RelatedFund: 4003,
      BoardRepresentation: false,
      CreatedDate: "2024-02-10T11:30:00Z",
      ModifiedDate: "2024-11-22T14:20:00Z",
    },
  ],
  // Entry list items (for dropdown/choice fields)
  // Industry options (entryListId: 10)
  10: [
    {
      EntryId: 101,
      Id: 101,
      Name: "Technology",
    },
    {
      EntryId: 102,
      Id: 102,
      Name: "Healthcare",
    },
    {
      EntryId: 103,
      Id: 103,
      Name: "Financial Services",
    },
    {
      EntryId: 104,
      Id: 104,
      Name: "Manufacturing",
    },
    {
      EntryId: 105,
      Id: 105,
      Name: "Retail",
    },
  ],
  // Tags options (entryListId: 11)
  11: [
    {
      EntryId: 111,
      Id: 111,
      Name: "High Priority",
    },
    {
      EntryId: 112,
      Id: 112,
      Name: "Strategic",
    },
    {
      EntryId: 113,
      Id: 113,
      Name: "International",
    },
    {
      EntryId: 114,
      Id: 114,
      Name: "Early Stage",
    },
  ],
  // Contact Type options (entryListId: 12)
  12: [
    {
      EntryId: 121,
      Id: 121,
      Name: "Executive",
    },
    {
      EntryId: 122,
      Id: 122,
      Name: "Finance",
    },
    {
      EntryId: 123,
      Id: 123,
      Name: "Operations",
    },
    {
      EntryId: 124,
      Id: 124,
      Name: "Legal",
    },
  ],
  // Deal Stage options (entryListId: 13)
  13: [
    {
      EntryId: 131,
      Id: 131,
      Name: "Prospecting",
    },
    {
      EntryId: 132,
      Id: 132,
      Name: "Due Diligence",
    },
    {
      EntryId: 133,
      Id: 133,
      Name: "Negotiation",
    },
    {
      EntryId: 134,
      Id: 134,
      Name: "Closed Won",
    },
    {
      EntryId: 135,
      Id: 135,
      Name: "Closed Lost",
    },
  ],
  // Fund Status options (entryListId: 14)
  14: [
    {
      EntryId: 141,
      Id: 141,
      Name: "Active",
    },
    {
      EntryId: 142,
      Id: 142,
      Name: "Fundraising",
    },
    {
      EntryId: 143,
      Id: 143,
      Name: "Closed",
    },
    {
      EntryId: 144,
      Id: 144,
      Name: "Liquidated",
    },
  ],
};

/**
 * Helper function to get mock data based on endpoint
 * @param {string} endpoint - The API endpoint being called
 * @param {object} params - Parameters for the endpoint (e.g., entryTypeId)
 * @returns {any} The appropriate mock data
 */
export function getMockData(endpoint, params = {}) {
  // GET /schema/entrytypes
  if (endpoint === "/schema/entrytypes") {
    return mockEntryTypes;
  }

  // GET /schema/entrytypes/{entryTypeId}/fields
  if (endpoint.match(/^\/schema\/entrytypes\/\d+\/fields$/)) {
    const entryTypeId = params.entryTypeId || parseInt(endpoint.split("/")[3]);
    return mockEntryTypeFields[entryTypeId] || [];
  }

  // GET data/entrydata/{entryTypeId}/entries
  if (endpoint.match(/^data\/entrydata\/\d+\/entries$/)) {
    const entryTypeId = params.entryTypeId || parseInt(endpoint.split("/")[2]);
    return mockEntries[entryTypeId] || [];
  }

  // GET data/entrydata/rows/{entryTypeId} - Query entries with filtering support
  if (endpoint.match(/^data\/entrydata\/rows\/\d+$/)) {
    const entryTypeId = params.entryTypeId || parseInt(endpoint.split("/")[3]);
    let entries = mockEntries[entryTypeId] || [];

    // Handle query parameter for filtering by IDs
    if (params.params?.query) {
      const queryStr = params.params.query;
      // Parse query like: {entryid: {$in:[1001,1002]}}
      const idMatch = queryStr.match(/\$in:\[([^\]]+)\]/);
      if (idMatch) {
        const requestedIds = idMatch[1].split(",").map((id) => parseInt(id.trim()));
        entries = entries.filter((entry) => {
          const entryId = entry.EntryId || entry.Id || entry.id;
          return requestedIds.includes(entryId);
        });
      }
    }

    return entries;
  }

  // POST data/entrydata - Create entry
  if (endpoint === "POST:data/entrydata") {
    const {
      entryTypeId, data,
    } = params;

    // Validate that data is provided
    if (!data || typeof data !== "object") {
      return {
        success: false,
        error: "Invalid data provided for entry creation",
      };
    }

    const entries = mockEntries[entryTypeId] || [];
    // Generate a new ID based on existing entries
    const maxId = entries.reduce((max, entry) => {
      const id = entry.EntryId || entry.Id || entry.id || 0;
      return Math.max(max, id);
    }, 0);
    const newId = maxId + 1;

    // Return a mock created entry with the new ID
    const createdEntry = {
      EntryId: newId,
      Id: newId,
      ...data,
      CreatedDate: new Date().toISOString(),
      ModifiedDate: new Date().toISOString(),
    };

    return {
      success: true,
      entry: createdEntry,
      message: `Successfully created entry with ID ${newId}`,
    };
  }

  // PUT data/entrydata - Update entry
  if (endpoint === "PUT:data/entrydata") {
    const {
      entryTypeId, data,
    } = params;

    // Validate that data is provided
    if (!data || typeof data !== "object") {
      return {
        success: false,
        error: "Invalid data provided for entry update",
      };
    }

    // Extract entry ID from data
    const entryId = data?.EntryId || data?.Id || data?.id;

    // Validate that an ID is provided
    if (!entryId) {
      return {
        success: false,
        error: "Entry ID is required for update operation",
      };
    }

    // Check if entry exists in mock data
    const entries = mockEntries[entryTypeId] || [];
    const existingEntry = entries.find((entry) => {
      const id = entry.EntryId || entry.Id || entry.id;
      return id === entryId;
    });

    // Return a mock updated entry
    const updatedEntry = {
      EntryId: entryId,
      Id: entryId,
      ...data,
      ModifiedDate: new Date().toISOString(),
    };

    return {
      success: true,
      entry: updatedEntry,
      message: `Successfully updated entry with ID ${entryId}`,
      existed: !!existingEntry,
    };
  }

  // DELETE data/entrydata - Delete entry
  if (endpoint === "DELETE:data/entrydata") {
    const { data } = params;

    // Handle both single ID and array of IDs
    let entryIds;
    if (Array.isArray(data)) {
      entryIds = data;
    } else if (typeof data === "object") {
      const entryId = data?.EntryId || data?.Id || data?.id;
      entryIds = entryId
        ? [
          entryId,
        ]
        : [];
    } else {
      entryIds = [
        data,
      ];
    }

    // Return a mock success response
    const count = entryIds.length;
    return {
      success: true,
      deletedIds: entryIds,
      count,
      message: `Successfully deleted ${count} entr${count === 1
        ? "y"
        : "ies"}: ID${count === 1
        ? ""
        : "s"} ${entryIds.join(", ")}`,
    };
  }

  // Default: return empty array
  return [];
}


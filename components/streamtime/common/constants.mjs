const COMPANY_SEARCH_BASE_PARAMS = {
  "conditionMatchTypeId": 1,
  "filterGroups": [
    {
      "conditionMatchTypeId": 2,
      "filterGroupTypeId": 114,
      "filters": [
        {
          "valueMatchTypeId": "1",
          "value": 1,
        },
      ],
    },
  ],
  "wildcardSearch": "",
  "sortField": 1,
  "sortAscending": true,
  "maxResults": 30,
  "offset": 0,
};

const TODO_SEARCH_BASE_PARAMS = {
  "conditionMatchTypeId": 1,
  "filterGroups": [],
  "wildcardSearch": "",
  "sortField": 5,
  "sortAscending": true,
  "maxResults": 30,
  "offset": 0,
  "groupByField": "jobFullName",
};

const JOB_SEARCH_BASE_PARAMS = {
  "conditionMatchTypeId": 1,
  "filterGroups": [
    {
      "conditionMatchTypeId": 2,
      "filterGroupTypeId": 3,
      "filters": [
        {
          "valueMatchTypeId": "1",
          "value": 1,
        },
        {
          "valueMatchTypeId": "1",
          "value": 5,
        },
      ],
    },
  ],
  "wildcardSearch": "",
  "sortField": 11,
  "sortAscending": true,
  "maxResults": 30,
  "offset": 0,
};

const LOGGED_TIME_STATUS = [
  {
    label: "Incomplete",
    value: 1,
  },
  {
    label: "Complete",
    value: 2,
  },
];

export default {
  COMPANY_SEARCH_BASE_PARAMS,
  TODO_SEARCH_BASE_PARAMS,
  LOGGED_TIME_STATUS,
  JOB_SEARCH_BASE_PARAMS,
};

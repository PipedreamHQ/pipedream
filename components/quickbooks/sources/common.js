const quickbooks = require('../quickbooks.app');

module.exports = {
  props: {
    quickbooks,
    http: {
      type: '$.interface.http',
      customResponse: true,
    },
  },
}

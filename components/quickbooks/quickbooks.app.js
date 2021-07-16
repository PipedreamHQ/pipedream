const QuickBooks = require('node-quickbooks')

module.exports = {
  type: "app",
  app: "quickbooks",
  propDefinitions: {
    operations_to_emit: {
      type: 'string[]',
      label: 'Operations',
      description: 'Select which operations to emit. If you want to emit them all you can just leave this field blank.',
      options: ['Create', 'Update', 'Merge', 'Delete', 'Void', 'Emailed'],
      optional: true,
    },
  },
  methods: {
  },
};
// const QuickBooks = require('node-quickbooks')

module.exports = {
  type: "app",
  app: "quickbooks",
  propDefinitions: {
    operations_to_emit: {
      type: 'string[]',
      label: 'Operations',
      description: 'Select which operations to emit or just leave it blank to emit them all.',
      options: ['Create', 'Update', 'Merge', 'Delete', 'Void', 'Emailed'],
      optional: true,
    },
  },
  methods: {
  },
};
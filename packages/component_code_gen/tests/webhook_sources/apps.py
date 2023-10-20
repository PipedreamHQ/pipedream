apps = [
    {
        'app': 'accelo',
        'instructions': 'how to get webhooks for every new assigned task',
        'key': 'accelo-new-task-assigned',
        'common-files': [
            'accelo/accelo.app.mjs',
            'accelo/sources/common/common.mjs',
        ],
    },
    {
        'app': 'asana',
        'instructions': 'how to get webhooks for every new project',
        'key': 'asana-new-project',
        'common-files': [
            'asana/asana.app.mjs',
            'asana/sources/common/common.mjs',
        ],
    },
    {
        'app': 'brex',
        'instructions': 'how to get webhooks for every new transfer event',
        'key': 'brex-new-transfer-event',
        'common-files': [
            'brex/brex.app.mjs',
            'brex/sources/new-transfer-event/common.mjs',
        ],
    },
    {
        'app': 'fibery',
        'instructions': 'how to get webhooks for every new created entity',
        'key': 'fibery-entity-created',
        'common-files': [
            'fibery/fibery.app.mjs',
            'fibery/sources/common/webhooks.mjs',
        ],
    },
    {
        'app': 'github',
        'instructions': 'how to get webhooks for every new commit',
        'key': 'github-new-commit',
        'common-files': [
            'github/github.app.mjs',
            'github/sources/common/constants.mjs',
            'github/sources/common/common-webhook.mjs',
        ],
    },
    {
        'app': 'postmark',
        'instructions': 'how to get webhooks for every new inbound email',
        'key': 'postmark-new-inbound-email-received',
        'common-files': [
            'postmark/postmark.app.mjs',
            'postmark/sources/common.mjs',
        ],
    },
    {
        'app': 'process_street',
        'instructions': 'how to get webhooks for every new completed workflow run',
        'key': 'process_street-workflow-run-completed',
        'common-files': [
            'process_street/process_street.app.mjs',
            'process_street/sources/common/constants.mjs',
            'process_street/sources/common/webhooks.mjs',
        ],
    },
    {
        'app': 'quaderno',
        'instructions': 'how to get webhooks for every new received payment',
        'key': 'quaderno-payment-received',
        'common-files': [
            'quaderno/quaderno.app.mjs',
            'quaderno/sources/common/events.mjs',
            'quaderno/sources/common/webhook.mjs',
            'quaderno/sources/common/base.mjs',
        ],
    },
    {
        'app': 'shipcloud',
        'instructions': 'how to get webhooks for every new shipment status',
        'key': 'shipcloud-new-shipment-status',
        'common-files': [
            'shipcloud/app/shipcloud.app.ts',
            'shipcloud/common/requestParams.ts',
            'shipcloud/common/responseSchemas.ts',
            'shipcloud/common/constants.ts',
        ],
    },
    {
        'app': 'stripe',
        'instructions': 'how to get webhooks for every new payment',
        'key': 'stripe-new-payment',
        'common-files': [
            'stripe/stripe.app.mjs',
            'stripe/sources/common/webhook-base.mjs',
        ],
    },
    {
        'app': 'tally',
        'instructions': 'how to get webhooks for every new response',
        'key': 'tally-new-response',
        'common-files': [
            'tally/tally.app.mjs',
            'tally/sources/common/common.mjs',
            'tally/sources/new-response/test-event.mjs',
        ],
    },
    {
        'app': 'twilio',
        'instructions': 'how to get webhooks for every new call',
        'key': 'twilio-new-call',
        'common-files': [
            'twilio/twilio.app.mjs',
            'twilio/common/constants.mjs',
            'twilio/sources/common-webhook.mjs',
        ],
    },
    {
        'app': 'woocommerce',
        'instructions': 'how to get webhooks for every new order event',
        'key': 'woocommerce-new-order-event',
        'common-files': [
            'woocommerce/woocommerce.app.mjs',
            'woocommerce/sources/new-order-event/test-event.mjs',
            'woocommerce/sources/common/base.mjs',
        ],
    },
    {
        'app': 'zenkit',
        'instructions': 'how to get webhooks for every new notification',
        'key': 'zenkit-new-notification',
        'common-files': [
            'zenkit/zenkit.app.mjs',
            'zenkit/sources/common/common.mjs',
            'zenkit/sources/common/constants.mjs',
        ],
    },
]

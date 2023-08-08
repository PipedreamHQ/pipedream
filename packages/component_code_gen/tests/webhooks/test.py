import sys
sys.path.append("...") # go back to root - hack to allow importing main
from main import main


apps = [
    {
        'app': 'github',
        'instructions': 'how to get webhooks for every new commit',
        'key': 'github-new-commit'
    },
    {
        'app': 'stripe',
        'instructions': 'how to get webhooks for every new payment',
        'key': 'stripe-new-payment'
    },
    {
        'app': 'twilio',
        'instructions': 'how to get webhooks for every new call',
        'key': 'twilio-new-call'
    },
    {
        'app': 'woocommerce',
        'instructions': 'how to get webhooks for every new order event',
        'key': 'woocommerce-new-order-event'
    },
    {
        'app': 'postmark',
        'instructions': 'how to get webhooks for every new inbound email',
        'key': 'postmark-new-inbound-email-received'
    },
    {
        'app': 'process_street',
        'instructions': 'how to get webhooks for every new completed workflow run',
        'key': 'process_street-workflow-run-completed'
    },
    {
        'app': 'zenkit',
        'instructions': 'how to get webhooks for every new notification',
        'key': 'zenkit-new-notification'
    },
    {
        'app': 'fibery',
        'instructions': 'how to get webhooks for every new created entity',
        'key': 'fibery-entity-created'
    },
    {
        'app': 'tally',
        'instructions': 'how to get webhooks for every new response',
        'key': 'tally-new-response'
    },
    {
        'app': 'asana',
        'instructions': 'how to get webhooks for every new project',
        'key': 'asana-new-project'
    },
    {
        'app': 'accelo',
        'instructions': 'how to get webhooks for every new assigned task',
        'key': 'accelo-new-task-assigned'
    },
    {
        'app': 'shipcloud',
        'instructions': 'how to get webhooks for every new shipment status',
        'key': 'shipcloud-new-shipment-status'
    },
    {
        'app': 'quaderno',
        'instructions': 'how to get webhooks for every new received payment',
        'key': 'quaderno-payment-received'
    },
    {
        'app': 'brex',
        'instructions': 'how to get webhooks for every new transfer event',
        'key': 'brex-new-transfer-event'
    },
]


def run_tests():
    for app in apps:
        print(f"testing {app['app']}...")
        result = main('webhook_source', app['app'], app['instructions'], verbose=True)
        with open(f'./tests/webhooks/output/{app["key"]}.mjs', 'w') as f:
            f.write(result)


if __name__ == '__main__':
    run_tests()

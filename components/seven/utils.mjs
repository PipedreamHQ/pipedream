import SevenClient from 'sms77-client'
import fetch from 'node-fetch'

if (!globalThis.fetch) globalThis.fetch = fetch

export function getClient(apiKey) {
    return new SevenClient(apiKey, 'pipedream')
}

export const apiKey = {
    description:
        'Your API key, found in your [dashboard](https://app.seven.io/developer).',
    label: 'API Key',
    secret: true,
    type: 'string',
}

export const debug = {
    default: false,
    description: 'Enable to use sandbox mode.',
    label: 'Debug',
    optional: true,
    type: 'boolean',
}

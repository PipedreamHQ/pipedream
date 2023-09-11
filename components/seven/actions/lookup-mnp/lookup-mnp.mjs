import {apiKey, getClient} from '../../utils.mjs'

export default {
    description: 'Look up mobile number portability status via seven.',
    key: 'seven_lookup_mnp',
    name: 'Look up MNP',
    props: {
        apiKey,
        number: {
            description: 'The mobile phone number for looking up.',
            label: 'Mobile Phone Number',
            type: 'string',
        },
    },
    type: 'action',
    version: '0.0.1',
    async run({$}) {
        const params = {
            json: true,
            number: this.number,
            type: 'mnp',
        }
        const res = await getClient(this.apiKey).lookup(params)

        $.export('$summary', `MNP lookup performed: ${JSON.stringify(res)}`)

        return res
    },
}

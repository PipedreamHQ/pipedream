export default {
  id: '123456-1234-1234-1234-123456789',
  type: 'order.charge.complete',
  data: {
    object: {
      id: '123456-1234-1234-1234-123456789',
      createdTime: '2023-12-29T14:59:38Z',
      currency: 'USD',
      amount: 10.8,
      state: 'complete',
      orderId: '123456789',
      captured: true,
      captures: [
        {
          "id": "123456-1234-1234-1234-123456789",
          "createdTime": "2023-12-29T15:02:16Z",
          "amount": 10.8,
          "state": "complete",
          "fulfillmentId": "ful_c123456-1234-1234-1234-123456789"
        }
      ],
      refunded: false,
      sourceId: '123456-1234-1234-1234-123456789',
      paymentSessionId: '123456-1234-1234-1234-123456789',
      type: 'customer_initiated',
      liveMode: true
    }
  },
  liveMode: true,
  createdTime: '2023-12-29T15:02:17.866755Z[UTC]'
}
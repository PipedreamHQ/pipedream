# Overview

The FraudLabs Pro API offers a robust suite of fraud prevention tools that empower users to screen online transactions for fraud. It leverages advanced scoring analytics to rate the risk level of a transaction based on various verification checks, such as IP address, email, transaction velocity, and more. Using Pipedream, developers can integrate these capabilities into workflows to automate fraud checks, augment data analysis, and trigger actions based on fraud scores.

# Example Use Cases

- **E-commerce Transaction Screening**: Automate the process of verifying transactions on your e-commerce platform. When a new order is placed, trigger a workflow on Pipedream to send order details to FraudLabs Pro for analysis. Depending on the fraud score, the workflow could automatically approve, flag for review, or reject the order, and update the order status in your e-commerce system.

- **Account Creation Monitoring**: Monitor and analyze account sign-ups in real-time by integrating FraudLabs Pro with a user management platform. Each time a new user registers, a Pipedream workflow can be triggered to assess the risk of fraud. If the score exceeds a certain threshold, the account can be disabled and an alert sent to administrators.

- **Payment Gateway Decision Automation**: Streamline the payment approval process by coupling FraudLabs Pro with your payment gateway. Upon payment submission, Pipedream can call the FraudLabs Pro API to assess the risk level. Based on the result, the workflow could either proceed with the payment process or hold the transaction for further review, and even notify your finance or security team.

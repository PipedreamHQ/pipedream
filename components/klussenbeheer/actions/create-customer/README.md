# Create Customer

## Overview

Adds a new customer. All fields are optional, but a name, phone number or email address is needed in practice to make the customer reachable.

If a customer with the same phone number or email address already exists, that customer is reused unchanged — no duplicate is created. Use **Search Customers** first when you need to know whether a customer already exists.

# Example Use Cases

1. Create a customer from a website contact form and then create a job for them.
2. Import leads from an ad platform with name, phone number and city.

# Getting Started

1. Connect the Klussenbeheer app with a Klussenbeheer token (Settings in Klussenbeheer).
2. Add the **Create Customer** action and fill in the fields you have. Leave fields empty when unknown — empty fields are not sent.

# Troubleshooting

## The action returned an existing customer

The API reuses a customer when the phone number or email address matches an existing one. This is intended behavior to prevent duplicates.

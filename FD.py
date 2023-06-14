def calculate_simple_interest(principal, duration, is_female, is_senior_citizen):
    if is_female and is_senior_citizen:
        rate = 8
    elif is_female and not is_senior_citizen:
        rate = 6
    elif not is_female and is_senior_citizen:
        rate = 7
    else:
        rate = 5

    interest = (principal * duration * rate) / 100
    return interest


# Example usage
principal_amount = 100000
deposit_duration = 5
is_female_customer = True
is_senior_citizen = True

interest_amount = calculate_simple_interest(principal_amount, deposit_duration, is_female_customer, is_senior_citizen)
total_amount = principal_amount + interest_amount

print("Principal Amount: $", principal_amount)
print("Interest Amount: $", interest_amount)
print("Total Amount: $", total_amount)

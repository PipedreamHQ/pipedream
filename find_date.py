from datetime import date
import datetime
import calendar
from turtle import st

#------------------DECLARE FUNCTIONS---------------------#

def last_day_of_month(any_day):
    # The day 28 exists in every month. 4 days later, it's always next month
    next_month = any_day.replace(day=28) + datetime.timedelta(days=4)
    # subtracting the number of the current day brings us back one month
    return next_month - datetime.timedelta(days=next_month.day)

def validate_greater_than_month(start_date,end_date):
    # month=any_date.month    
    # year=any_date.year    
    # last_date_of_month=calendar.monthrange(year, month)
    last_date_of_month=last_day_of_month(start_date)
    if(last_date_of_month>end_date):
        return end_date, "samemonth"
    else:
        return last_date_of_month, "nextmonth"

#--------------------MAIN LOGIC--------------------------#


# my_date = date.today()
# print(my_date)
# print(my_date.weekday())
# print(calendar.day_name[my_date.weekday()])
# my_date=datetime.datetime.strptime('2000-08-20','%Y-%m-%d')
# print(my_date)
# print(my_date.weekday())
# print(list(calendar.day_name))
# print(calendar.day_name[my_date.weekday()])

# print(calendar.monthrange(2002, 1))

# next_date=datetime.datetime.strptime('2000-08-20','%Y-%m-%d')+datetime.timedelta(days=27)
# print("---next date: ",next_date)
# print(next_date.day)
# print(next_date.month)
# print(next_date.strftime("%Y-%m-%d"))


# chk_date="2022-01-01"

# print("+++++++++",datetime.date(2022, 5, 17))
# chkdate="2022, 5, 17"
# print("+++++++++",last_day_of_month(datetime.date(2022, 5, 17)))


# start_date="2022-01-01"
# start_date=datetime.datetime.strptime(start_date,"%Y-%m-%d")
# end_date=start_date+datetime.timedelta(days=365)

while (end_date>start_date):
    print(start_date)
    next_week_date=start_date+datetime.timedelta(days=7)
    
    next_week_date, monthsattus=validate_greater_than_month(start_date,next_week_date)
    # print(next_week_date)

    if (monthsattus=="samemonth"):
        start_date=next_week_date
    else:
        start_date=next_week_date+datetime.timedelta(days=1)

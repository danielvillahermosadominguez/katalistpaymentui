
# Correct information of the course

In this section you can check the selected course information is correct.

## The correct name and price
The happy path is to review you can see the correct course and price in the index and payment pages.

You can try to change in moodle the name of the course and price and see how this changes are reflected on the page after refreshing.

## Course with 0 price should not allow to continue
You can change the price to be 0. There is three cases:
- empty price in moodle
- a string which is not a number in moodle
- 0 or 0. or 0.00 values

You should see an error page showing the course doesn't have a price.

## Course which doesn't have a price in Moodle

In this case you need to remove the custom field "price" in moodle.

You should see an error page showing the course doesn't have a price.

# Description of the manual test

The purpose of this document is to describe the manual test you need to do to verify the correct behaviour of the
tests.

You could get these test and create with cypress or selenium a set of automatized regression end to end tests. But, 
at this moment the pretension of this document is to be:
- A source of knowledge about the expected behaviour of the system
- A support document to guide the exploratory testing

A complementary document for the requirements is in the following BDD features:
- [Obtain course feature](https://github.com/danielvillahermosadominguez/katalistpaymentservice/blob/main/src/test/resources/cucumber/features/obtaincourse.feature)
- [Subscribe and payment feature](https://github.com/danielvillahermosadominguez/katalistpaymentservice/blob/main/src/test/resources/cucumber/features/subscribeandpayment.feature)

## Check the language of the pages
In this section you can check the correct translation of the forms.
You can access to the guide [here](./language/testsdescription.md).

## Form integration
In this section you can check the errors related to the integration. The integration is basically using the url:
```
index.html?lang=en&course=9
```
Where you include in the url the language and the real identifier of the course.

The general error appeair with the language of the browser and is:
"The form has not been called correctly. Please try to subscribe again in the website"

For each form (Step 1 and Step 2)
- Form without parameters should produce an error
- Form with wrong language parameter
- Form with not correct id for the course: letters, empty or id which doesn't exist in the database

## Correct information of the course

In this section you can check the selected course information is correct.

You can access to the guide [here](./courses/testsdescription.md).

## Filling the first step: Customer data
In this section we have all the checks you would need to do to check this page an its behaviour.

You can access to the guide [here](./customerdata/testsdescription.md).

## Filling the second step: Payment data
In this section we have all the checks you would need to do to check this page an its behaviour.

You can access to the guide [here](./paymentdata/testsdescription.md).

## Retry process

Sometimes we could have some problems to connect to holded or moodle. If the system has problems to connect to paycomet, then it will send an error and the payment cannot be started, so this last case is not inclided in this section.

The system should recover the data and finish the payment process in spite to have had problems to connect to one of them. 

You can access to the guide [here](./paymentretry/testsdescription.md).


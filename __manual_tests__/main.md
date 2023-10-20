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

# Requirements to be included in the tests

There are some business rules you need to have into account. They are mostly related to certain business rules with the contacts and holded

The business rules that are not implemented **are not checked**.

## 1. Fields for the form
- [x] Rule 1: The user will select whether it is NIF or CIF. Depending on this selection, the user can fill in the name field and the last name field, or directly the company name. Fields that you do not have to fill in, if applicable, will not be displayed. For example: if it is a company, you will only need to view and fill in the company.
- [x] Rule 2: Other necessary text fields are: Telephone, address, postal code, City, Province. These fields will initially be free text
- [x] The country field will be necessary and must also match the countries that are selected in holded. That's why it will be a fixed selector with the same thing that appears in held.

## 2. Fields and rules to create a holded contact.
- [x] The contact type will always be "Customer".
- [ ] The VAT number
  - [ ] When is Spain we need to fill the NIF and the VAT number
  - [ ] Outside of Spain, we need to fill the VAT number. The VAT number usually has the contry code as a prefix. for example for Spain NIF could be "B64401482" and the VAT is "ESB64401482"
  - [ ] When a company is from the European Union, the VAT number is needed and it must be filled with the country code as a prefix. For the rest of countries we must fill the id number because each country could have their own code. for example, EEUU is the EIN, Peru is the RUC and Colombia is NIT, etc.

- [ ] The sales account will always be 70500000. We will enter this data as data that can be modified at the configuration level. It's something that will practically never change. (field found in Preferences -> sales accounts)
- [ ] Payment method: cash ("al contado") (field found in Preferences -> sales accounts)
- [ ] Overdue (Vencido): due on the same day (field found in Preferences -> Sales Accounts)
- [ ] In the "Accounting" section -> Sales tax
  - [ ] If the country is "Spain" it must be entered in VAT21%
  - [ ] If it is not Spain but it is a country of the European Union it would be "Intra-community VAT Service"
  - [ ] otherwise => it would be the value "not subject"
- [ ] In the Client/debtor account section
  - [ ] add the type 430000XX where we add a new one and the XX increments. Entering the full name of the person or the name of the company if applicable
  - [ ] 430000XX is the type of clients
  - [x] In general, all fields must be filled in capital letters except for the email.
- [x] Invoice
  - [x] Data is filled by default
  - [x] The units will be 1 by default
  - [x] The price will be the one indicated for the course. In euros.
  - [x] The name will be the name of the course that will appear in Moodle
  - [x] We will not include any description for now. The name of the course is enough.


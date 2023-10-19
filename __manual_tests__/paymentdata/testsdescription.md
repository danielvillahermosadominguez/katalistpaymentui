# Filling the second step: Payment data
In this section we have all the checks you would need to do to check this page an its behaviour.


## Click the button without to fill some field

A message is showed in red in the page. This is a message from Paycomet. 

You shouldn't call to the service and you should fill correctly the fields.

The cases are:
- [ ] Fields are not filled and you click the button
- [ ] Name filled but not the rest and you click de button
- [ ] Name filled and card name but not the rest
- [ ] Month and year not selected
- [ ] etc

## Errors with the cards

``` To be developed ```

You have here the error codes:
https://docs.paycomet.com/en/recursos/codigos-de-error

And the cards to force an error:
https://docs.paycomet.com/en/recursos/testcards


## Everything is fine with the fields and connect to the service
In this case, you click in the button to confirm the payment and connect with the server. You have several cases of response

### The customer is redirected to the challenge url (happy path) and Accept

You need to have into account when you have received the challenge URL, you should see the following effects before clicking "Accept":
- [ ] There is not a contact with your data in holded
- [ ] You haven't received an email with the invoice
- [ ] There is not a user with your data in moodle
- [ ] In paycomet the payment is pending
- [ ] The database, the payment_transaction table and the purchase has your data

When you accept, you need to check the following after clicking "Accept":
- [ ] Your contact has been created in holded with uppercase
  - [ ] If it was a person, in holded you see the name and surname and the NIF
  - [ ] If it was a company, in holded you see the company name and the VAT name
  - [ ] You will have a customId in preferences, it is a hash which is the result to join the name and the email with a SHA-256
- [ ] Your contact has been created in moodle
  - [ ] the username is the username of the email without aphabetical characters. If other usename matchs with yours, your username will have a number with the number of matches. For example: daniel.villahermosa@codurance.com, the username will be "danielvillahermosa" and if exists "danielvillahermosa" and "danielvillahermosa1" users, your user will be: "danielvillahemrosa2"
  - [ ] If you are a company the name and the surname will be the name of the company
  - [ ] If you are a person, the name and the surname will be the name and surname of the person
  - [ ] You should receive in your email an invoice and the subscription to access to moodle.
  - [ ] In the database, the payment transaction is Done

### The customer is redirected to the challenge url (happy path) and Cancel
You need to have into account when you have received the challenge URL, you should see the following effects before clicking "Accept":
- [ ] There is not a contact with your data in holded
- [ ] You haven't received an email with the invoice
- [ ] There is not a user with your data in moodle
- [ ] In paycomet the payment is pending
- [ ] The database, the payment_transaction table and the purchase has your data. The payment transaction is Cancelled

When you have cancelled with the challenge url then the effect would be:
- [ ] There is not a contact with your data in holded
- [ ] You haven't received an email with the invoice
- [ ] There is not a user with your data in moodle
- [ ] In paycomet the payment is pending
- [ ] The database, the payment_transaction table and the purchase has your data. The payment transaction is Cancelled

### The customer receive an error
In this case you can have an error when you send the the confirmation.

You don't receive a challenge url to accept or cancel the payment, but you will receive a message with the error.

- [ ] For example if you are already enrolled in the course, the payment is not going to be done and nothing should happen in the system. You receive a error message.
- [ ] If during the process, someone remove the course or remove the price or something similar, the payment should not be done.
 - [ ] It the payment system (paycomet) don't respond, you will receive other error. You can reproduce this error if you change the api key of paycomet in your environment variables. In this case it is not to save any data because the payment cannot be done.




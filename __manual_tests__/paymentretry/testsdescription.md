# Retry process

Sometimes we could have some problems to connect to holded or moodle. If the system has problems to connect to paycomet, then it will send an error and the payment cannot be started, so this last case is not inclided in this section.

The system should recover the data and finish the payment process in spite to have had problems to connect to one of them. 

## Holded fails during when the user accept the payment

You can emulate the fail of Holded with the apiKey. You can put a wrong api key and do the payment. 

The user will not receive any error message but the invoice and the user will be receive when the system recovers itself.

To reproduce this fail follow the following steps:
1. Change the api key for holded and put a wrong one.
2. Start the service and follow the steps to confirm a payment
3. After accepting the payment, the service should show it has been a problem to connect to the finantial platform

The effect are the following:
- [ ] No users has been created in moodle
- [ ] No contact has been created in holded
- [ ] In the database, the payment transaction is with the state "RETRY"
- [ ] In the logs you can see the retry process recovering the payment and failing for the same reason.

Once you have review it, try to stop the service and put a correct api key for holded. Start the service and you will see the following effects:
- [ ] In the logs you can see how the retry process recover the payment transaction and put it in done
- [ ] In the database, the payment transaction is in state done and the purchase has the steps of financial and learning with true
- [ ] You have your user in moodle and you have received a mail to connect
- [ ] You have your contacts in holded and you have received a mail with the invoice

## Moodle fails during when the user accept the payment

It is the same test than the test when fail holded. The differences are:
- You could have finished the finantial process and have the contacts in holded. The payment process could have partially finished. It is normal.
- You will see it in the purchase table, where you can see the financial step in true but the learning step in false
- To reproduce this problem, you need to have the moodle working at the beginning because the courses and prices are in moodle.
- Just before the user is going to accept the payment, you should disable the rest protocol in moodle. And then, to accept the payment.

To reproduce this problem you can follow the following steps:
1. Follow the tipical steps to subscribe and pay a course.
2. Don't accept yet the payment and wait to the following steps
3. In moodle you need to go to the administration and to disable the rest protocol. In this way, moodle will not respond to the requests
4. Now accept the payment

The effect are the following:
- [ ] No users has been created in moodle
- [ ] You have contacts in holded, because holded didn't fail
- [ ] In the database, the payment transaction is with the state "RETRY"
- [ ] In the logs you can see the retry process recovering the payment and failing for the same reason.

Once you have review it, try to enable the REST protocol again and you will see:
- [ ] In the logs you can see how the retry process recover the payment transaction and put it in done
- [ ] In the database, the payment transaction is in state done and the purchase has the steps of financial and learning with true
- [ ] You have your user in moodle and you have received a mail to connect
- [ ] You have your contacts in holded and you don't receive any mail with the invoice, because you received it before.
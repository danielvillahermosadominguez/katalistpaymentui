# Check the language of the pages
Open the integration.html and choose "Please click here to suscribe to this course in english". You need to repeat it with spanish and portuguese

The following guides could help you:
## Happy path pages

- Check all the texts are in the selected language. Some ideas:
  - [ ] Review all the labels and buttons of both two steps: subscription and payment
  - [ ] Review the countries in the countries selector. In addition, the should be sorted in alphabetical order depending on the selected language
  - [ ] Review the text "N/A - Not applicable" in the company field when you have selected VAT type = NIF
  - [ ] Review the text "N/A - Not applicable" in the fields Name and Surname when you have selected VAT type = CIF
  - [ ] Review the title, course, prices and labels in the payment step.
  - [ ] Don't fill a field and click on the subscribe now button. You should see a message from the validation for each field: email, phone, VAT, Company, Name, etc.
  - [ ] Review the expiration month and year
  - [ ] Review the errors when you introduce a wrong cardnumber or you don't choose a expiration date when click the confirm purchase button
## Error pages

  - [ ] Call to the index page with a no valid course number. "index.html?lang=es&course=10" where 10 is the course id which doesn't exists in moodle. The message should be in the choosen language
  - [ ] Call to the index page with a no valid course string. For example index.html?lang=es&course=dajdakjdalkjdlas. The message should be in the choosen language

## Backend error messages

When you finish the payment and click in the button "confirm purchase", if the backend has an error it is received and showed by the client in the selected language. 

The typical errors to reproduce will be:
- The customer is already enrolled in the course
- Course ID doesn't exist
- The course has not a price
- Learning platform is not available 
- Financial platform is not available 
- Payment platform is not available 
- TPV Token is not correct 
- Credit card not valid

# Filling the first step: Customer data
In this section we have all the checks you would need to do to check this page an its behaviour.

## Cannot continue if the fields are empty: Message the mail should be filled
Review that if the fields are empty and you click in "subscribe now button" you cannot continue and you should see a message. You should check:
- [ ] correct and not empty email field
- [ ] not empty phone field
- [ ] not empty NIF/CIF
- [ ] not empty company name field
- [ ] not empty address field
- [ ] not empty post code field
- [ ] not empty city field
- [ ] not empty region field

## Changing the fields to fill when choose NIF or CIF

- [ ] When you select NIF, you only should be able to write in the name and surname fields. You should be able to write in the company name and also, in this field is showed the text "N/A - Not applicable"

- [ ] When you select CIF, you only should be able to write in the company name. You should be able to write in the name and surname, and also, in this fields are showed the text "N/A - Not applicable

## Order of the Country field depending on the language

In the country selector is shown the countries. Depending on the language you should see a different order in the countries. Alphabetical depending on the language.


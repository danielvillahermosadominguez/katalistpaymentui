import path from 'path'
import fs from 'fs'

describe("index.html should", () => {
  let fetchs;
  let dom;
  beforeEach(async () => {
    const rootElm = document.documentElement;
    const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
    rootElm.innerHTML = html
    await jest.resetModules()
    const config = await import('../src/js/config.js')
    config.setLocationModule('../../__tests__/doubles/locationfake.js')
    fetchs = await import('../src/js/fetchs.js')
    fetchs.getCourse = jest.fn(() => {
      return {
        error: false,
        code: 0,
        item: {
          id: 10,
          name: 'fake name',
          price: 100.5
        }
      }
    })
    dom = await import('../src/js/dom.js')
    dom.locationReplace = jest.fn()
    delete window.location;
    window.location = { search: '?lang=en&course=10', href: '?lang=en&course=10' };
    require("../src/js/index.js")
    await new Promise(process.nextTick);
  });

  fillAllFields = () => {
    const email = document.getElementById('email')
    email.value = "john@doe.com"
    const phoneNumber = document.getElementById('phoneNumber')
    phoneNumber.value = "9163636636"
    const name = document.getElementById('name')
    name.value = "John"
    const surname = document.getElementById('surname')
    surname.value = "Doe"
    const nifCif = document.getElementById('dnicif')
    nifCif.value = "46842041C"
    const address = document.getElementById('address')
    address.value = "RANDOM ADDRESS"
    const postalCode = document.getElementById('postalCode')
    postalCode.value = "28080"
    const city = document.getElementById('city')
    city.value = "Boadilla del monte"
    const region = document.getElementById('region')
    region.value = "Madrid"
    const country = document.getElementById('country')
    country.value = "Spain"
  }

  describe("render button and fields", () => {
    beforeEach(() => {
      const rootElm = document.documentElement;
      const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
      rootElm.innerHTML = html
    });

    it.each([
      ["email"],
      ["phoneNumber"],
      ["name"],
      ["surname"],
      ["dnicif"],
      ["company"],
      ["address"],
      ["postalCode"],
      ["city"],
      ["region"],
      ["country"]
    ])
      ("render a html input not hidden with the id '%s'", (id) => {
        const htmlElement = document.getElementById(id)

        expect(htmlElement).not.toBeNull()
        expect(htmlElement.hidden).toBe(false)
      })

    it("render a subscrition button", () => {
      const buttonSubscribeNow = document.getElementById('button_subscribe_now')

      expect(buttonSubscribeNow).not.toBeNull()
      expect(buttonSubscribeNow.hidden).toBe(false)
    })

    it("render a selector with NIF by default and CIF", async () => {
      const isCompany = document.getElementById('isCompany')
      const optionCif = document.getElementById('option_cif')
      const optionNif = document.getElementById('option_nif')

      expect(isCompany).not.toBeNull()
      expect(isCompany.hidden).toBe(false)
      expect(optionCif).not.toBeNull()
      expect(optionNif).not.toBeNull()
      expect(optionNif.selected).toBe(true)

    })
  })

  describe("set the course information and the language at the beginning", () => {
    it("set the language from the URL", async () => {
      expect(String.locale).toBe("en")
    })

    it("show the price of the course", async () => {
      const price = document.getElementById('course_price')

      await new Promise(process.nextTick);

      expect(price.innerHTML).toBe("100.5")
    })

    it("fill the hidden input with identifier of the course", async () => {
      const courseId = document.getElementById('courseId')

      await new Promise(process.nextTick);

      expect(courseId.value).toBe("10")
    })

    it("show the name of the course", async () => {
      const courseName = document.getElementById('courseName')

      await new Promise(process.nextTick);

      expect(courseName.innerHTML).toBe("fake name")
    })
  })

  describe("validate the fields and not allow to continue", () => {
    it("not allow to continue if the email is not filled with the correct format", async () => {
      const email = document.getElementById('email')
      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(email.validationMessage).toBe('[mail_is_mandatory]')
    })

    it("not allow to continue if the email is filled but with not correct format", async () => {      
      const email = document.getElementById('email')
      email.value = "NO CORRECT FORMAT"
      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(email.validationMessage).toBe('Constraints not satisfied')
    })

    it("not allow to continue if the phone is empty", async () => {
      fillAllFields()                  
      const phoneNumber = document.getElementById('phoneNumber')
      phoneNumber.value = ""
      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(phoneNumber.validationMessage).toBe('[phone_is_mandatory]')
    })

    it("not allow to continue if the name is empty", async () => {
      fillAllFields()            
      const name = document.getElementById('name')
      name.value = ""
      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(name.validationMessage).toBe('[name_is_mandatory]')
    })

    it("not allow to continue if the surname is empty", async () => {
      fillAllFields()
      const surname = document.getElementById('surname')
      surname.value = ""
      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(surname.validationMessage).toBe('[surname_is_mandatory]')
    })

    it("not allow to continue if the NIF/CIF is empty", async () => {
      fillAllFields()
      const nifCif = document.getElementById('dnicif')
      nifCif.value = ""
      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(nifCif.validationMessage).toBe('[nifcif_is_mandatory]')
    })

    it("not allow to continue if the company field is empty", async () => {
      fillAllFields()
      const optionCif = window.document.getElementById('option_cif')
      optionCif.selected = true
      isCompany.dispatchEvent(new Event('change'));

      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(company.validationMessage).toBe('[company_is_mandatory]')
    })

    it("not allow to continue if the address is empty", async () => {
      fillAllFields()
      const address = document.getElementById('address')
      address.value = ""
      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(address.validationMessage).toBe('[address_is_mandatory]')
    })

    it("not allow to continue if the postalCode is empty", async () => {
      fillAllFields()
      const postalCode = document.getElementById('postalCode')
      postalCode.value = ""

      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(postalCode.validationMessage).toBe('[postal_is_mandatory]')
    })

    it("not allow to continue if the city is empty", async () => {
      fillAllFields()
      const city = document.getElementById('city')
      city.value = ""
      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(city.validationMessage).toBe('[city_is_mandatory]')
    })

    it("not allow to continue if the region is empty", async () => {
      fillAllFields()
      const region = document.getElementById('region')
      region.value = ""

      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(region.validationMessage).toBe('[region_is_mandatory]')
    })

    it("not allow to continue if the country is empty", async () => {
      fillAllFields()
      const country = document.getElementById('country')
      country.value = ""

      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(dom.locationReplace.mock.calls).toHaveLength(0)
      expect(country.validationMessage).toBe('[country_is_mandatory]')
    })
  })

  describe("show and hidden fields depending on CIF and NIF selection", () => {
    it("render a company input enabled if CIF is selected", async () => {
      const isCompany = window.document.getElementById('isCompany')
      const optionCif = window.document.getElementById('option_cif')
      const company = window.document.getElementById('company')

      optionCif.selected = true
      isCompany.dispatchEvent(new Event('change'));


      await new Promise(process.nextTick);

      expect(company.disabled).toBe(false)
      expect(company.value).toBe('')

    })

    it("render a company input enabled if NIF is selected", async () => {
      const isCompany = window.document.getElementById('isCompany')
      const optionNif = document.getElementById('option_nif')
      const company = window.document.getElementById('company')

      optionNif.selected = true
      isCompany.dispatchEvent(new Event('change'));

      await new Promise(process.nextTick);

      expect(company.disabled).toBe(true)
      expect(company.value).toBe('[no_aplicable_value]')
    })
  })

  describe("go to the payment page", () => {
    it("clean the session storage when load the application", async () => {                
      expect(sessionStorage.getItem('courseId')).toBeNull()
      expect(sessionStorage.getItem('email')).toBeNull()
      expect(sessionStorage.getItem('phoneNumber')).toBeNull()
      expect(sessionStorage.getItem('name')).toBeNull()
      expect(sessionStorage.getItem('surname')).toBeNull()
      expect(sessionStorage.getItem('dnicif')).toBeNull() //TODO: change dnicif for nifCif in all the application
      expect(sessionStorage.getItem('address')).toBeNull()
      expect(sessionStorage.getItem('postalCode')).toBeNull()
      expect(sessionStorage.getItem('city')).toBeNull()
      expect(sessionStorage.getItem('region')).toBeNull()
      expect(sessionStorage.getItem('country')).toBeNull()
      expect(sessionStorage.getItem('isCompany')).toBeNull()
    })

    it("save the information in the browser session storage when all the fields are filled", async () => {
      fillAllFields()
      const courseId = document.getElementById('courseId')
      const email = document.getElementById('email')
      const phoneNumber = document.getElementById('phoneNumber')
      const name = document.getElementById('name')
      const surname = document.getElementById('surname')
      const nifCif = document.getElementById('dnicif')
      const address = document.getElementById('address')
      const postalCode = document.getElementById('postalCode')
      const city = document.getElementById('city')
      const region = document.getElementById('region')
      const country = document.getElementById('country')
      const isCompany = document.getElementById('isCompany')
      const button = document.getElementById('button_subscribe_now')
      button.click()

      expect(sessionStorage.getItem('courseId')).toBe(courseId.value)
      expect(sessionStorage.getItem('email')).toBe(email.value)
      expect(sessionStorage.getItem('phoneNumber')).toBe(phoneNumber.value)
      expect(sessionStorage.getItem('name')).toBe(name.value)
      expect(sessionStorage.getItem('surname')).toBe(surname.value)
      expect(sessionStorage.getItem('dnicif')).toBe(nifCif.value) //TODO: change dnicif for nifCif in all the application
      expect(sessionStorage.getItem('address')).toBe(address.value)
      expect(sessionStorage.getItem('postalCode')).toBe(postalCode.value)
      expect(sessionStorage.getItem('city')).toBe(city.value)
      expect(sessionStorage.getItem('region')).toBe(region.value)
      expect(sessionStorage.getItem('country')).toBe(country.value)
      expect(sessionStorage.getItem('isCompany')).toBe(isCompany.value)
    })

    it("allow to go to the payment page if all the fields are filled", async () => {
      fillAllFields()
      const email = document.getElementById('email')
      const phoneNumber = document.getElementById('phoneNumber')
      const name = document.getElementById('name')
      const surname = document.getElementById('surname')
      const nifCif = document.getElementById('dnicif')
      const address = document.getElementById('address')
      const postalCode = document.getElementById('postalCode')
      const city = document.getElementById('city')
      const region = document.getElementById('region')
      const country = document.getElementById('country')
      const button = document.getElementById('button_subscribe_now')

      button.click()

      await new Promise(process.nextTick);
      expect(email.validationMessage).toBe('')
      expect(phoneNumber.validationMessage).toBe('')
      expect(name.validationMessage).toBe('')
      expect(surname.validationMessage).toBe('')
      expect(nifCif.validationMessage).toBe('')
      expect(company.validationMessage).toBe('')
      expect(address.validationMessage).toBe('')
      expect(postalCode.validationMessage).toBe('')
      expect(city.validationMessage).toBe('')
      expect(region.validationMessage).toBe('')
      expect(country.validationMessage).toBe('')
      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe('./payment.html?lang=en')
    })
  })
})
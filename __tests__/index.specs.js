import path from 'path'
import fs from 'fs'


const MOCK_GET_COURSE = jest.fn()
jest.mock("../src/js/services/fetchs.js", () => ({
  getCourse: MOCK_GET_COURSE
}))

const MOCK_TRANSLATE_ALL_THE_PAGE = jest.fn()
const MOCK_LOCALIZE_HTML_TAG = jest.fn()
const MOCK_LOCALIZE_VALUE_TAG = jest.fn()
const MOCK_T = jest.fn()
const MOCK_LOCALIZE_HTML_TAG_FOR_ALL_OPTIONS_IN_SELECTOR = jest.fn()

jest.mock("../src/js/location/location.js", () => ({
  translateAllThePage: MOCK_TRANSLATE_ALL_THE_PAGE,
  localizeHTMLTag: MOCK_LOCALIZE_HTML_TAG,
  localizeValueTag: MOCK_LOCALIZE_VALUE_TAG,
  localizeHTMLTagForAllOptionsInSelector: MOCK_LOCALIZE_HTML_TAG_FOR_ALL_OPTIONS_IN_SELECTOR,
  t: MOCK_T
}))

describe("The form with customer data (Step 1) should", () => {
  const ERROR_IS_NOT_VALID = "./views/errors/isnotavalidcourselected.html"
  const ERROR_GENERIC = "./views/errors/error.html"
  let dom;
  beforeEach(async () => {

    await jest.resetModules()
    //const config = await import('../src/js/config/config.js')
    //config.setLocationModule('@../__tests__/doubles/locationfake.js')

    MOCK_GET_COURSE.mockReturnValue({
      error: false,
      code: 0,
      item: {
        id: 10,
        name: 'fake name',
        price: 100.5
      }
    })

    MOCK_T.mockImplementation(param => `[${param}]`)
    MOCK_LOCALIZE_HTML_TAG.mockImplementation(tagId => {
      var tag = document.getElementById(tagId);
      if (tag !== null) {
        tag.innerHTML = `[${tagId}]`
      }
    })

    MOCK_LOCALIZE_VALUE_TAG.mockImplementation(tagId => {
      var tag = document.getElementById(tagId);
      if (tag !== null) {
        tag.value = `[${tagId}]`
      }
    })

    MOCK_LOCALIZE_HTML_TAG_FOR_ALL_OPTIONS_IN_SELECTOR.mockImplementation((selectorId, optionIdPrefix, sortByText) => {
      const selector = document.getElementById(selectorId)
      for (let i = 0; i < selector.length; i++) {
        let option = selector.options[i]
        let value = option.value
        option.innerHTML = `[${optionIdPrefix + value.toLowerCase()}]`
      }
    })

    String.locale = "en"


    await renderOnlyHtml()
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
    country.selectedIndex = 0
  }

  renderOnlyHtml = async () => {
    const rootElm = document.documentElement;
    const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
    rootElm.innerHTML = html
    dom = await import('../src/js/dom/dom.js')
    dom.locationReplace = jest.fn()
  }

  setHref = (urlParam) => {
    delete window.location;
    window.location = { search: urlParam, href: urlParam };
  }

  loadJs = async () => {
    require("../src/js/pages/index.js")
    await new Promise(process.nextTick);
  }

  describe("show button and fields", () => {
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
      ("show an input not hidden with the id '%s'", (id) => {
        const htmlElement = document.getElementById(id)

        expect(htmlElement).not.toBeNull()
        expect(htmlElement.hidden).toBe(false)
      })

    it("show a subscrition button", () => {
      const buttonSubscribeNow = document.getElementById('button_subscribe_now')

      expect(buttonSubscribeNow).not.toBeNull()
      expect(buttonSubscribeNow.hidden).toBe(false)
    })

    it("show a selector with NIF by default and CIF", async () => {
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

  describe("allow to choose a country", () => {
    beforeEach(async () => {
      setHref('?lang=en&course=10')
      await loadJs()
    });

    it("show by default Spain selected", async () => {
      const country = document.getElementById("country")
      var selectedOption = country.options[country.selectedIndex]
      var selectedCountry = selectedOption.innerHTML

      expect(country.value).toBe("ES")
      expect(selectedCountry).toBe("[option_country_es]")
    })
    it.each([
      ["Åland Islands", "AX"],
      ["Albania", "AL"],
      ["Algeria", "DZ"],
      ["American Samoa", "AS"],
      ["Andorra", "AD"],
      ["Angola", "AO"],
      ["Anguilla", "AI"],
      ["Antarctica", "AQ"],
      ["Antigua and Barbuda", "AG"],
      ["Argentina", "AR"],
      ["Armenia", "AM"],
      ["Aruba", "AW"],
      ["Australia", "AU"],
      ["Austria", "AT"],
      ["Azerbaijan", "AZ"],
      ["Bahamas", "BS"],
      ["Bahrain", "BH"],
      ["Bangladesh", "BD"],
      ["Barbados", "BB"],
      ["Belarus", "BY"],
      ["Belgium", "BE"],
      ["Belize", "BZ"],
      ["Benin", "BJ"],
      ["Bermuda", "BM"],
      ["Bhutan", "BT"],
      ["Bolivia", "BO"],
      ["Bosnia and Herzegovina", "BA"],
      ["Botswana", "BW"],
      ["Bouvet Island", "BV"],
      ["Brazil", "BR"],
      ["British Indian Ocean Territory", "IO"],
      ["British Virgin Islands", "VG"],
      ["Brunei", "BN"],
      ["Bulgaria", "BG"],
      ["Burkina Faso", "BF"],
      ["Burundi", "BI"],
      ["Cambodia", "KH"],
      ["Cameroon", "CM"],
      ["Canada", "CA"],
      ["Cape Verde", "CV"],
      ["Caribbean Netherlands", "BQ"],
      ["Cayman Islands", "KY"],
      ["Central African Republic", "CF"],
      ["Chad", "TD"],
      ["Chile", "CL"],
      ["China", "CN"],
      ["Christmas Island", "CX"],
      ["Cocos (Keeling) Islands", "CC"],
      ["Colombia", "CO"],
      ["Comoros", "KM"],
      ["Cook Islands", "CK"],
      ["Costa Rica", "CR"],
      ["Croatia", "HR"],
      ["Cuba", "CU"],
      ["Curacao", "CW"],
      ["Cyprus", "CY"],
      ["Czechia", "CZ"],
      ["Democratic Republic of the Congo", "CD"],
      ["Denmark", "DK"],
      ["Djibouti", "DJ"],
      ["Dominica", "DM"],
      ["Dominican Republic", "DO"],
      ["East Timor", "TL"],
      ["Ecuador", "EC"],
      ["Egypt", "EG"],
      ["El Salvador", "SV"],
      ["Equatorial Guinea", "GQ"],
      ["Eritrea", "ER"],
      ["Estonia", "EE"],
      ["Eswatini", "SZ"],
      ["Ethiopia", "ET"],
      ["Falkland Islands", "FK"],
      ["Faroe Islands", "FO"],
      ["Federated States of Micronesia", "FM"],
      ["Fiji", "FJ"],
      ["Finland", "FI"],
      ["France", "FR"],
      ["French Guiana", "GF"],
      ["French Polynesia", "PF"],
      ["French Southern and Antarctic Lands", "TF"],
      ["Gabon", "GA"],
      ["Gambia", "GM"],
      ["Georgia", "GE"],
      ["Germany", "DE"],
      ["Ghana", "GH"],
      ["Gibraltar", "GI"],
      ["Greece", "GR"],
      ["Greenland", "GL"],
      ["Grenada", "GD"],
      ["Guadeloupe", "GP"],
      ["Guam", "GU"],
      ["Guatemala", "GT"],
      ["Guernsey", "GG"],
      ["Guinea", "GN"],
      ["Guinea-Bissau", "GW"],
      ["Guyana", "GY"],
      ["Haiti", "HT"],
      ["Heard Island and McDonald Islands", "HM"],
      ["Honduras", "HN"],
      ["Hong Kong", "HK"],
      ["Hungary", "HU"],
      ["Iceland", "IS"],
      ["India", "IN"],
      ["Indonesia", "ID"],
      ["Iran", "IR"],
      ["Iraq", "IQ"],
      ["Ireland", "IE"],
      ["Isle of Man", "IM"],
      ["Israel", "IL"],
      ["Italy", "IT"],
      ["Ivory Coast", "CI"],
      ["Jamaica", "JM"],
      ["Japan", "JP"],
      ["Jersey", "JE"],
      ["Jordan", "JO"],
      ["Kazakhstan", "KZ"],
      ["Kenya", "KE"],
      ["Kiribati", "KI"],      
      ["Kuwait", "KW"],
      ["Kyrgyzstan", "KG"],
      ["Laos", "LA"],
      ["Latvia", "LV"],
      ["Lebanon", "LB"],
      ["Lesotho", "LS"],
      ["Liberia", "LR"],
      ["Libya", "LY"],
      ["Liechtenstein", "LI"],
      ["Lithuania", "LT"],
      ["Luxembourg", "LU"],
      ["Macao", "MO"],
      ["Madagascar", "MG"],
      ["Malawi", "MW"],
      ["Malaysia", "MY"],
      ["Maldives", "MV"],
      ["Mali", "ML"],
      ["Malta", "MT"],
      ["Marshall Islands", "MH"],
      ["Martinique", "MQ"],
      ["Mauritania", "MR"],
      ["Mauritius", "MU"],
      ["Mayotte", "YT"],
      ["Mexico", "MX"],
      ["Moldova", "MD"],
      ["Mongolia", "MN"],
      ["Montenegro", "ME"],
      ["Montserrat", "MS"],
      ["Morocco", "MA"],
      ["Mozambique", "MZ"],
      ["Myanmar", "MM"],
      ["Namibia", "NA"],
      ["Nauru", "NR"],
      ["Nepal", "NP"],
      ["Netherlands", "NL"],
      ["New Caledonia", "NC"],
      ["New Zealand", "NZ"],
      ["Nicaragua", "NI"],
      ["Niger", "NE"],
      ["Nigeria", "NG"],
      ["Niue", "NU"],
      ["Norfolk Island", "NF"],
      ["North Korea", "KP"],
      ["North Macedonia", "MK"],
      ["Northern Mariana Islands", "MP"],
      ["Norway", "NO"],
      ["Oman", "OM"],
      ["Pakistan", "PK"],
      ["Palau", "PW"],
      ["Palestine", "PS"],
      ["Panama", "PA"],
      ["Papua New Guinea", "PG"],
      ["Paraguay", "PY"],
      ["Peru", "PE"],
      ["Philippines", "PH"],
      ["Pitcairn Islands", "PN"],
      ["Poland", "PL"],
      ["Portugal", "PT"],
      ["Principality of Monaco", "MC"],
      ["Puerto Rico", "PR"],
      ["Qatar", "QA"],
      ["Republic of the Congo", "CG"],
      ["Reunion", "RE"],
      ["Romania", "RO"],
      ["Russia", "RU"],
      ["Rwanda", "RW"],
      ["Saint Barthelemy", "BL"],
      ["Saint Helena, Ascension and Tristan da Cunha", "SH"],
      ["Saint Kitts and Nevis", "KN"],
      ["Saint Lucia", "LC"],
      ["Saint Martin", "MF"],
      ["Saint Pierre and Miquelon", "PM"],
      ["Saint Vincent and the Grenadines", "VC"],
      ["Samoa", "WS"],
      ["San Marino", "SM"],
      ["Sao Tome and Principe", "ST"],
      ["Saudi Arabia", "SA"],
      ["Senegal", "SN"],
      ["Serbia", "RS"],
      ["Seychelles", "SC"],
      ["Sierra Leone", "SL"],
      ["Singapore", "SG"],
      ["Sint Maarten", "SX"],
      ["Slovakia", "SK"],
      ["Slovenia", "SI"],
      ["Solomon Islands", "SB"],
      ["Somalia", "SO"],
      ["South Africa", "ZA"],
      ["South Georgia and South Sandwich Islands", "GS"],
      ["South Korea", "KR"],
      ["South Sudan", "SS"],
      ["Spain", "ES"],
      ["Sri Lanka", "LK"],
      ["Sudan", "SD"],
      ["Suriname", "SR"],
      ["Svalbard", "SJ"],
      ["Sweden", "SE"],
      ["Switzerland", "CH"],
      ["Syria", "SY"],
      ["Taiwan", "TW"],
      ["Tajikistan", "TJ"],
      ["Tanzania", "TZ"],
      ["Thailand", "TH"],
      ["Togo", "TG"],
      ["Tokelau", "TK"],
      ["Tonga", "TO"],
      ["Trinidad and Tobago", "TT"],
      ["Tunisia", "TN"],
      ["Turkey", "TR"],
      ["Turkmenistan", "TM"],
      ["Turks and Caicos Islands", "TC"],
      ["Tuvalu", "TV"],
      ["Uganda", "UG"],
      ["Ukraine", "UA"],
      ["United Arab Emirates", "AE"],
      ["United Kingdom", "GB"],
      ["United States Minor Outlying Islands", "UM"],
      ["United States of America", "US"],
      ["Uruguay", "UY"],
      ["Uzbekistan", "UZ"],
      ["Vanuatu", "VU"],
      ["Vatican City", "VA"],
      ["Venezuela", "VE"],
      ["Vietnam", "VN"],
      ["Virgin Islands", "VI"],
      ["Wallis and Futuna", "WF"],
      ["Western Sahara", "EH"],
      ["Yemen", "YE"],
      ["Zambia", "ZM"],
      ["Zimbabwe", "ZW"]
    ])
      ("select and show the country '%s' with the iso code '%s'", async (_, isoCode) => {
        const isoCodeLC = isoCode.toLowerCase();
        const country = document.getElementById("country")
        const option = document.getElementById("option_country_" + isoCodeLC)

        option.selected = true
        country.dispatchEvent(new Event('change'));


        await new Promise(process.nextTick);
        var selectedOption = country.options[country.selectedIndex]
        var selectedCountry = selectedOption.innerHTML
        expect(country.value).toBe(isoCode)
        expect(selectedCountry).toBe("[option_country_" + isoCodeLC + "]")
      })

  })

  describe("show the course information and the language when the page is loaded", () => {
    beforeEach(async () => {
      setHref('?lang=en&course=10')
      await loadJs()
    });

    it("have the language according to the url parameter", async () => {
      expect(MOCK_TRANSLATE_ALL_THE_PAGE).toBeCalled()
    })

    it("show the price of the course", async () => {
      const price = document.getElementById('course_price')

      await new Promise(process.nextTick);

      expect(price.innerHTML).toBe("100.5")
    })

    it("have a hidden input with identifier of the course", async () => {
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

  describe("validate the fields and not allow to continue when click the suscription button", () => {
    beforeEach(async () => {
      setHref('?lang=en&course=10')
      await loadJs()
    });

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

    it("reset all validations when a not valid field has changed", async () => {
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
      fillAllFields()
      country.value = ""
      email.dispatchEvent(new Event('change'));
      button.click()
      await new Promise(process.nextTick);

      expect(email.validationMessage).toBe('')
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
      expect(country.validationMessage).toBe('[country_is_mandatory]')
    })
  })

  describe("show and hidden fields depending on CIF and NIF selection", () => {

    beforeEach(async () => {
      setHref('?lang=en&course=10')
      await loadJs()
    })

    it("render a company input enabled if CIF is selected", async () => {
      const isCompany = window.document.getElementById('isCompany')
      const optionCif = window.document.getElementById('option_cif')
      const company = window.document.getElementById('company')
      const name = window.document.getElementById('name')
      const surname = window.document.getElementById('surname')

      optionCif.selected = true
      isCompany.dispatchEvent(new Event('change'));


      await new Promise(process.nextTick);

      expect(company.disabled).toBe(false)
      expect(company.value).toBe('')
      expect(name.value).toBe('[no_aplicable_value]')
      expect(name.disabled).toBe(true)
      expect(surname.value).toBe('[no_aplicable_value]')
      expect(surname.disabled).toBe(true)
    })

    it("render a company input enabled if NIF is selected", async () => {
      const isCompany = window.document.getElementById('isCompany')
      const optionNif = document.getElementById('option_nif')
      const company = window.document.getElementById('company')
      const name = window.document.getElementById('name')
      const surname = window.document.getElementById('surname')

      optionNif.selected = true
      isCompany.dispatchEvent(new Event('change'));

      await new Promise(process.nextTick);

      expect(company.disabled).toBe(true)
      expect(company.value).toBe('[no_aplicable_value]')
      expect(name.value).toBe('')
      expect(name.disabled).toBe(false)
      expect(surname.value).toBe('')
      expect(surname.disabled).toBe(false)
    })
  })

  describe("store and clean the data in the session storage", () => {

    beforeEach(async () => {
      setHref('?lang=en&course=10')
      await loadJs()
    })

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
  })

  describe("go to the payment page when the data is valid and the user click the subscription button", () => {
    beforeEach(async () => {
      setHref('?lang=en&course=10')
      await loadJs()
    });
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
      expect(dom.locationReplace.mock.calls[0][0]).toBe('./views/payment/payment.html?lang=en')
    })
  });

  describe("show the error page in case of", () => {
    it("there is not an url param called 'courseId'", async () => {
      setHref('?lang=en')
      await loadJs()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_IS_NOT_VALID + '?lang=en')
    })

    it("there is not a valid course in the 'courseId' url parameter", async () => {
      setHref('?lang=en&courseId=hello')
      await loadJs()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_IS_NOT_VALID + '?lang=en')
    })

    it("the course doesn't exist", async () => {
      MOCK_GET_COURSE.mockReturnValue({
        error: true,
        code: 1,
        item: null
      })
      setHref('?lang=en&course=1')
      await loadJs()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_GENERIC + '?lang=en&message=[backend_error_code_1]')
    })

    it("there is not communication with the service", async () => {
      MOCK_GET_COURSE.mockReturnValue({
        error: true,
        code: -2,
        item: null
      })
      setHref('?lang=en&course=1')
      await loadJs()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_GENERIC + '?lang=en&message=[there_is_not_connection]')
    })

    it("This course has not an assigned price. It is not possible to start a subscription", async () => {
      MOCK_GET_COURSE.mockReturnValue({
        error: true,
        code: 4,
        item: null
      })
      setHref('?lang=en&course=1')
      await loadJs()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_GENERIC + '?lang=en&message=[backend_error_code_4]')
    })
  })
})
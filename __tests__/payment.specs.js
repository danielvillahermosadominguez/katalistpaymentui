import path from 'path'
import fs from 'fs'

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

describe("The form with the payment data (Step 2) should", () => {
  let fetchs;
  let dom;  
  const ERROR_GENERIC =  "../errors/error.html"
  
  beforeEach(async () => {    
    await jest.resetModules()        
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
    ip = await import('../src/js/services/ip.js')
    ip.getMyExternalIp = jest.fn(() => {
      return {
        ip: "88.99.22.22",
      }
    })
  });

  fillAllFields = () => {
  }

  renderOnlyHtml = async () => {
    const rootElm = document.documentElement;
    const html = fs.readFileSync(path.resolve(__dirname, '../src/views/payment/payment.html'), 'utf8');
    rootElm.innerHTML = html
    dom = await import('../src/js/dom/dom.js')
    dom.locationReplace = jest.fn()
  }

  setHref = (urlParam) => {
    delete window.location;
    window.location = { search: urlParam, href: urlParam };
  }

  loadJs = async () => {
    require("../src/js/pages/payment.js")
    await new Promise(process.nextTick);
  }

  describe("show several fields and buttons in the form", () => {

    it.each([
      ["ip"],
      ["input_courseId"],
      ["input_coursePrice"],
      ["email"],
      ["phoneNumber"],
      ["name"],
      ["surname"],
      ["dnicif"],
      ["isCompany"],
      ["company"],
      ["address"],
      ["postalCode"],
      ["city"],
      ["region"],
      ["country"],
    ])
      ("have a html input hidden with the id '%s'", (id) => {
        const htmlElement = document.getElementById(id)

        expect(htmlElement).not.toBeNull()
        expect(htmlElement.type).toBe("hidden")
      })

    it("show the confirm purchase button", () => {
      const buttonConfirmPurchase = document.getElementById('button_confirm_purchase')

      expect(buttonConfirmPurchase).not.toBeNull()
      expect(buttonConfirmPurchase.hidden).toBe(false)
    })
  })

  describe("recover information and load data when the page is loaded", () => {
    beforeEach(async () => {
      setHref('?lang=en')
      sessionStorage.setItem('courseId', 10)
      sessionStorage.setItem('coursePrice', 70)
      sessionStorage.setItem('courseName', "TDD in depth")
      sessionStorage.setItem('email', "john.doe@email.com")
      sessionStorage.setItem('phoneNumber', "636638494")
      sessionStorage.setItem('name', "John")
      sessionStorage.setItem('surname', "Doe")
      sessionStorage.setItem('dnicif', "46842041C") //TODO: change dnicif for nifCif in all the application
      sessionStorage.setItem('address', "Avd. de los poblados, 51")
      sessionStorage.setItem('postalCode', "28080")
      sessionStorage.setItem('city', "Boadilla del Monte")
      sessionStorage.setItem('region', "Madrid")
      sessionStorage.setItem('country', "Spain")
      sessionStorage.setItem('isCompany', "false")
      sessionStorage.setItem('company', "No company")

      await loadJs()
    });

    it("have the language according to the url parameter", async () => {
      expect(String.locale).toBe("en")
    })

    it("show the course price", async () => {
      const coursePrice = document.getElementById('coursePrice')

      expect(coursePrice).not.toBeNull()
      expect(coursePrice.innerHTML).toBe("70")
    })

    it("show the course name", async () => {
      const courseName = document.getElementById('courseName')

      expect(courseName).not.toBeNull()
      expect(courseName.innerHTML).toBe("TDD in depth")
    })

    it("insert the price in a hidden input", async () => {
      const inputCoursePrice = document.getElementById('input_coursePrice')

      expect(inputCoursePrice).not.toBeNull()
      expect(inputCoursePrice.value).toBe("70")
    })

    it("insert the course id in a hidden input", async () => {
      const inputCourseId = document.getElementById('input_courseId')

      expect(inputCourseId).not.toBeNull()
      expect(inputCourseId.value).toBe("10")
    })

    it.each([
      ["course identifer", "courseId", "input_courseId"],
      ["course price", "coursePrice", "input_coursePrice"],
      ["email", "email", "email"],
      ["phone number", "phoneNumber", "phoneNumber"],
      ["first name", "name", "name"],
      ["surname", "surname", "surname"],
      ["NIF/CIF", "dnicif", "dnicif"],
      ["is a company", "isCompany", "isCompany"],
      ["company name", "company", "company"],
      ["address", "address", "address"],
      ["postal code", "postalCode", "postalCode"],
      ["city", "city", "city"],
      ["region", "region", "region"],
      ["country", "country", "country"],
    ])
      ("copy '%s' stored the hidden input field", (_, storageKey, id) => {
        const htmlElement = document.getElementById(id)
        const value = sessionStorage.getItem(storageKey)
        expect(htmlElement).not.toBeNull()
        expect(htmlElement.value).toBe(value)
      })
  })

  describe("prepare an integration with paycomets", () => {
    it("the JetID must be present for the integration with the correct value", () => {
      const htmlElement = document.getElementById('jetID')

      expect(htmlElement).not.toBeNull()
      expect(htmlElement.type).toBe("hidden")
      expect(htmlElement.value).toBe("egQ3RpfFDCzYtj0I7Lv8u9GEVknbAJqs")
    })

    it("the JetID must be present for the integration with the correct value", () => {
      const htmlElement = document.getElementById('jetID')

      expect(htmlElement).not.toBeNull()
      expect(htmlElement.type).toBe("hidden")
      expect(htmlElement.value).toBe("egQ3RpfFDCzYtj0I7Lv8u9GEVknbAJqs")
    })

    it("the cardHolderName must be present for the integration and it is empty", () => {
      const htmlElement = document.getElementById('username')

      expect(htmlElement).not.toBeNull()
      expect(htmlElement.value).toBe("")
      expect(htmlElement.getAttribute("data-paycomet")).toBe("cardHolderName")
    })

    it("the number of credit/debit card must be present for the integration", () => {
      const div = document.getElementById('paycomet-pan')
      const cardNumber = document.getElementById('cardnumber')

      expect(div).not.toBeNull()
      expect(cardNumber).not.toBeNull()
      expect(cardNumber.getAttribute("paycomet-name")).toBe("pan")
      expect(cardNumber.getAttribute("paycomet-placeholder")).toBe("0000 0000 0000 0000 0000")
    })

    it("the CVV2 must be present for the integration", () => {
      const div = document.getElementById('paycomet-cvc2')
      const cvv2 = document.getElementById('cvv2')

      expect(div).not.toBeNull()
      expect(cvv2).not.toBeNull()
      expect(cvv2.getAttribute("paycomet-name")).toBe("cvc2")
      expect(cvv2.getAttribute("paycomet-placeholder")).toBe("CVV2")
    })

    it("the expiration date must be present for the integration", () => {
      const month = document.getElementById('select-month')
      const year = document.getElementById('select-year')

      expect(month).not.toBeNull()
      expect(year).not.toBeNull()
      expect(month.getAttribute("data-paycomet")).toBe("dateMonth")
      expect(year.getAttribute("data-paycomet")).toBe("dateYear")
    })
  })

  describe("subscribe and pay", () => {
    let paymentJs;
    beforeEach(async () => {
      setHref('?lang=en')
      sessionStorage.setItem('courseId', 10)
      sessionStorage.setItem('coursePrice', 70)
      sessionStorage.setItem('courseName', "TDD in depth")
      sessionStorage.setItem('email', "john.doe@email.com")
      sessionStorage.setItem('phoneNumber', "636638494")
      sessionStorage.setItem('name', "John")
      sessionStorage.setItem('surname', "Doe")
      sessionStorage.setItem('dnicif', "46842041C") //TODO: change dnicif for nifCif in all the application
      sessionStorage.setItem('address', "Avd. de los poblados, 51")
      sessionStorage.setItem('postalCode', "28080")
      sessionStorage.setItem('city', "Boadilla del Monte")
      sessionStorage.setItem('region', "Madrid")
      sessionStorage.setItem('country', "Spain")
      sessionStorage.setItem('isCompany', "false")
      sessionStorage.setItem('company', "No company")
      
    });
    it("have success and redirect to challenge URL", async () => {
      fetchs = await import('../src/js/services/fetchs.js')
      fetchs.executeSubscription = jest.fn(() => {
        return {
          error: false,
          code: -1,
          item: {
            errorCode: 0,
            amount: 1000,
            currency: "EUR",
            order: "RANDOM ORDER",
            challengeUrl: "RANDOM CHALLENGE URL"
          }
        }
      })        

      paymentJs = await import("../src/js/pages/payment.js")
      await new Promise(process.nextTick);

      await paymentJs.submitForm()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe('RANDOM CHALLENGE URL')
    })

    it("show an error when not connect with service", async () => {
      fetchs = await import('../src/js/services/fetchs.js')
      fetchs.executeSubscription = jest.fn(() => {
        return {
          error: true,
          code: -2,
          item: {
            code: 0,
            message: "RANDOM MESSAGE",            
          }
        }
      })        

      paymentJs = await import("../src/js/pages/payment.js")
      await new Promise(process.nextTick);

      await paymentJs.submitForm()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_GENERIC+'?lang=en&message=[there_is_not_connection]')
    })

    it("show an error when the course doesn't exist", async () => {
      fetchs = await import('../src/js/services/fetchs.js')
      fetchs.executeSubscription = jest.fn(() => {
        return {
          error: true,
          code: 1,
          item: null
        }
      })        

      paymentJs = await import("../src/js/pages/payment.js")
      await new Promise(process.nextTick);

      await paymentJs.submitForm()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_GENERIC+'?lang=en&message=[backend_error_code_1]')
    })

    it("show an error when the user has already a subscription to this course", async () => {
      fetchs = await import('../src/js/services/fetchs.js')
      fetchs.executeSubscription = jest.fn(() => {
        return {
          error: true,
          code: 2,
          item: null
        }
      })        

      paymentJs = await import("../src/js/pages/payment.js")
      await new Promise(process.nextTick);

      await paymentJs.submitForm()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_GENERIC+'?lang=en&message=[backend_error_code_2]')
    })

    it("show an error when there is a general error in the subscription", async () => {
      fetchs = await import('../src/js/services/fetchs.js')
      fetchs.executeSubscription = jest.fn(() => {
        return {
          error: true,
          code: 3,
          item: null
        }
      })        

      paymentJs = await import("../src/js/pages/payment.js")
      await new Promise(process.nextTick);

      await paymentJs.submitForm()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_GENERIC+'?lang=en&message=[backend_error_code_3]')
    })

    it("show an error when the price for this course is not found", async () => {
      fetchs = await import('../src/js/services/fetchs.js')
      fetchs.executeSubscription = jest.fn(() => {
        return {
          error: true,
          code: 4,
          item: null
        }
      })        

      paymentJs = await import("../src/js/pages/payment.js")
      await new Promise(process.nextTick);

      await paymentJs.submitForm()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_GENERIC+'?lang=en&message=[backend_error_code_4]')
    })

    it("show an error when the url challenge empty", async () => {
      fetchs = await import('../src/js/services/fetchs.js')
      fetchs.executeSubscription = jest.fn(() => {
        return {
          error: false,
          code: -1,
          item: {
            errorCode: 0,
            amount: 1000,
            currency: "EUR",
            order: "RANDOM ORDER",
            challengeUrl: ""
          }
        }
      })          

      paymentJs = await import("../src/js/pages/payment.js")
      await new Promise(process.nextTick);

      await paymentJs.submitForm()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_GENERIC+'?lang=en&message=[problem_with_payment]')
    })

    it("show an error when the url challenge is null", async () => {
      fetchs = await import('../src/js/services/fetchs.js')
      fetchs.executeSubscription = jest.fn(() => {
        return {
          error: false,
          code: -1,
          item: {
            errorCode: 0,
            amount: 1000,
            currency: "EUR",
            order: "RANDOM ORDER",
            challengeUrl: null
          }
        }
      })          

      paymentJs = await import("../src/js/pages/payment.js")
      await new Promise(process.nextTick);

      await paymentJs.submitForm()

      expect(dom.locationReplace.mock.calls).toHaveLength(1)
      expect(dom.locationReplace.mock.calls[0][0]).toBe(ERROR_GENERIC+'?lang=en&message=[problem_with_payment]')
    })
  })
})
import path from 'path'
import fs from 'fs'

describe("The form with the payment data (Step 2) should", () => {
    let fetchs;
    let dom;
    beforeEach(async () => {

        await jest.resetModules()
        const config = await import('../src/js/config.js')
        config.setLocationModule('../../__tests__/doubles/locationfake.js')
        await renderOnlyHtml()
    });

    fillAllFields = () => {
    }

    renderOnlyHtml = async () => {
        const rootElm = document.documentElement;
        const html = fs.readFileSync(path.resolve(__dirname, '../src/payment.html'), 'utf8');
        rootElm.innerHTML = html
        dom = await import('../src/js/dom.js')
        dom.locationReplace = jest.fn()
    }

    setHref = (urlParam) => {
        delete window.location;
        window.location = { search: urlParam, href: urlParam };
    }

    loadJs = async () => {
        require("../src/js/payment.js")
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

    describe("have an integration with paycomets", () => {       
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
})
import path from 'path'
import fs from 'fs'
import { setFetchsModule, setLocationModule } from '../src/js/config.js'
import { waitFor } from '@testing-library/dom'
import { JSDOM } from 'jsdom'
setLocationModule("../../__tests__/doubles/locationfake.js")
setFetchsModule("../../__tests__/doubles/fetchsfake.js")

describe("index.html should", () => {    
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
            const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
            const dom = new JSDOM(html, { runScripts: 'dangerously' })
            const document = dom.window.document

            let htmlElement = document.getElementById(id)
            expect(htmlElement).not.toBeNull()
            expect(htmlElement.hidden).toBe(false)
        })

    it("render a subscrition button", () => {
        const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
        const dom = new JSDOM(html, { runScripts: 'dangerously' })

        const document = dom.window.document

        document.body.innerHTML = html

        let buttonSubscribeNow = document.getElementById('button_subscribe_now')
        expect(buttonSubscribeNow).not.toBeNull()
        expect(buttonSubscribeNow.hidden).toBe(false)
    })

    it("render a selector with NIF by default and CIF", () => {
        const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
        const dom = new JSDOM(html, { runScripts: 'dangerously' })
        const document = dom.window.document

        const isCompany = document.getElementById('isCompany')
        const optionCif = document.getElementById('option_cif')
        const optionNif = document.getElementById('option_nif')
        expect(isCompany).not.toBeNull()
        expect(isCompany.hidden).toBe(false)
        expect(optionCif).not.toBeNull()
        expect(optionNif).not.toBeNull()
        expect(optionNif.selected).toBe(true)
    })


    it("render a company input enabled if NIF is selected", async () => {        
        const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
        const document = window.document
        document.body.innerHTML = html
        import("../src/js/index.js")
        const optionNif = document.getElementById('option_nif')
        const optionCif = document.getElementById('option_cif')
        let company = document.getElementById('company')
        optionNif.selected = true        
        
        await new Promise(process.nextTick);

        expect(company.disabled).toBe(true)
        expect(company.value).toBe('[no_aplicable_value]')
    })

    it("render a company input enabled if CIF is selected", async () => {        
        const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
        const document = window.document
        document.body.innerHTML = html
        import("../src/js/index.js")        
        const optionCif = document.getElementById('option_cif')
        let company = document.getElementById('company')
        optionCif.selected = true        
        
        await new Promise(process.nextTick);

        expect(company.disabled).toBe(false)
        expect(company.value).toBe('')        
    })     

    it("show the price of the course", async () => {        
        const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
        const dom = new JSDOM(html, { runScripts: 'dangerously' })
        const document = dom.window.document        
        document.body.innerHTML = html
        
        const price = document.getElementById('course_price')
  
        await waitFor(()=> {
            expect(price.innerHTML).toBe("100.5")                                
        }, {
            container:dom.window.body
        })
    })
})
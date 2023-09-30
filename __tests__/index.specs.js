import path from 'path'
import fs from 'fs'
import { setFetchsModule, setLocationModule, setDomModule } from '../src/js/config.js'
import { waitFor } from '@testing-library/dom'
import { JSDOM } from 'jsdom'
setLocationModule("../../__tests__/doubles/locationfake.js")
setFetchsModule("../../__tests__/doubles/fetchsfake.js")
setDomModule("../../__tests__/doubles/domfake.js")

describe("index.html should", () => {

  describe("contain field and data components", () => {
    beforeEach(() => {
      const rootElm = document.documentElement;
      // Restore base elements
      rootElm.innerHTML = '<head></head><body></body>';

      //dom = await JSDOM.fromFile("./src/index.html", { runScripts: 'dangerously' })                ç
      //window = dom.window    
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
        console.log("[START]Test - 1 - " + id)
        const document = window.document
        let htmlElement = document.getElementById(id)
        expect(htmlElement).not.toBeNull()
        expect(htmlElement.hidden).toBe(false)
        console.log("[END]Test - 1 - " + id)
      })

    it("render a subscrition button", () => {
      console.log("[START]Test - 2 - button ")
      const document = window.document

      let buttonSubscribeNow = document.getElementById('button_subscribe_now')
      expect(buttonSubscribeNow).not.toBeNull()
      expect(buttonSubscribeNow.hidden).toBe(false)
      console.log("[END]Test - 2 - button ")
    })

  })

  describe("follow this behaviour", () => {
    let dom
    const sideEffects = {
      document: {
        addEventListener: {
          fn: document.addEventListener,
          refs: [],
        },
        keys: Object.keys(document),
      },
      window: {
        addEventListener: {
          fn: window.addEventListener,
          refs: [],
        },
        keys: Object.keys(window),
      },
    };

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------
    beforeAll(async () => {
      // Spy addEventListener
          ['document', 'window'].forEach(obj => {
            const fn = sideEffects[obj].addEventListener.fn;
            const refs = sideEffects[obj].addEventListener.refs;
        
            function addEventListenerSpy(type, listener, options) {
              // Store listener reference so it can be removed during reset
              refs.push({ type, listener, options });
              // Call original window.addEventListener
              fn(type, listener, options);
            }
        
            // Add to default key array to prevent removal during reset
            sideEffects[obj].keys.push('addEventListener');
        
            // Replace addEventListener with mock
            global[obj].addEventListener = addEventListenerSpy;
          });
    });

    // Reset JSDOM. This attempts to remove side effects from tests, however it does
    // not reset all changes made to globals like the window and document
    // objects. Tests requiring a full JSDOM reset should be stored in separate
    // files, which is only way to do a complete JSDOM reset with Jest.
    beforeEach(async () => {
      const rootElm = document.documentElement;

      // Remove attributes on root element
      [...rootElm.attributes].forEach(attr => rootElm.removeAttribute(attr.name));
    
      // Remove elements (faster than setting innerHTML)
      while (rootElm.firstChild) {
        rootElm.removeChild(rootElm.firstChild);
      }
    
      // Remove global listeners and keys
      ['document', 'window'].forEach(obj => {
        const refs = sideEffects[obj].addEventListener.refs;
    
        // Listeners
        while (refs.length) {
          const { type, listener, options } = refs.pop();
          global[obj].removeEventListener(type, listener, options);
        }
    
        // Keys
        Object.keys(global[obj])
          .filter(key => !sideEffects[obj].keys.includes(key))
          .forEach(key => {
            delete global[obj][key];
          });            
      });

      // Restore base elements
      rootElm.innerHTML = '<head></head><body></body>';

      //dom = await JSDOM.fromFile("./src/index.html", { runScripts: 'dangerously' })                ç
      //window = dom.window          
      const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
      rootElm.innerHTML = html

    });

    it("render a selector with NIF by default and CIF", async () => {
      console.log("[START]Test - 3 - selector ")
      const document = window.document

      const isCompany = document.getElementById('isCompany')
      const optionCif = document.getElementById('option_cif')
      const optionNif = document.getElementById('option_nif')
      expect(isCompany).not.toBeNull()
      expect(isCompany.hidden).toBe(false)
      expect(optionCif).not.toBeNull()
      expect(optionNif).not.toBeNull()
      expect(optionNif.selected).toBe(true)
      console.log("[END]Test - 3 - selector ")
    })

    it("render a company input enabled if CIF is selected", async () => {
      console.log("[START]Test - 4 - el peligroso ")
      const document = window.document      
      require("../src/js/index.js")
      const optionCif = document.getElementById('option_cif')
      const selector = document.getElementById('isCompany')
      let company = document.getElementById('company')
      optionCif.selected = true

      await new Promise(process.nextTick);
      await new Promise(process.nextTick);

      expect(company.disabled).toBe(false)
      expect(company.value).toBe('')
      console.log("[END]Test - 4 - el peligroso ")
    })

    it("render a company input enabled if NIF is selected", async () => {
      console.log("[START]Test - 5 - el peligroso ")      
      //window.document.querySelector('body').removeEventListener('')  
      
      await jest.resetModules()      
      let config = await import( '../src/js/config.js')
      config.setLocationModule('../../__tests__/doubles/locationfake.js')
      setFetchsModule("../../__tests__/doubles/fetchsfake.js")
      setDomModule("../../__tests__/doubles/domfake.js")      
      //jest.spyOn(config, 'getLocationModule').mockReturnValue('../../__tests__/doubles/locationfake.js')            
      console.log("Config mock devuelve: " + config.getLocationModule())
      require("../src/js/index.js")
      console.log("CARGADO INDEX.JS")
      const optionNif = document.getElementById('option_nif')
      const selector = document.getElementById('isCompany')
      let company = document.getElementById('company')
      optionNif.selected = true

      await new Promise(process.nextTick);
      console.log("company disabled =" + company.disabled)
      console.log("company value =" + company.value)

      expect(company.disabled).toBe(true)
      await new Promise(process.nextTick);
      expect(company.value).toBe('[no_aplicable_value]')

      expect(true).toBe(true)
      console.log("[END]Test - 5 - el peligroso ")      
    })

    it("dummy test", async () => {
      console.log("Otro test ")
      expect(true).toBe(true)
    })
    /*    it("render a company input enabled if NIF is selected", async () => {        
        
            const dom = await JSDOM.fromFile("./src/index.html", { runScripts: 'dangerously' ,resources: "usable"})        
            const jsmodule = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');        
    
            const document = dom.window.document      
            let scriptElement = document.createElement('script');
    
            //import("../src/js/index.js")
            const optionNif = document.getElementById('option_nif')        
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
            const document = window.document
            document.body.innerHTML = html
            import("../src/js/index.js") 
            const price = document.getElementById('course_price')
      
            await new Promise(process.nextTick);
            await new Promise(process.nextTick);
            console.log(price.innerHTML)
            expect(price.innerHTML).toBe("100.5")                    
        })*/
  })
})
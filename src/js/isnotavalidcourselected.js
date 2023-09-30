import { getLocationModule } from './config.js'


let translateAllThePage
let localizeHTMLTag

let locationModPath = getLocationModule()

export async function init() {
    const locationMod = await import(locationModPath)
    translateAllThePage = locationMod.translateAllThePage
    localizeHTMLTag = locationMod.localizeHTMLTag
    translateAllThePage();
    localizeHTMLTag("form_not_properly_called");
    localizeHTMLTag("try_to_subscribe_the_course_from");
}

window.document.querySelector('body').addEventListener('load', init())

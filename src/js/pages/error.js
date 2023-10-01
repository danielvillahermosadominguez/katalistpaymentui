import { getLocationModule } from '../config/config.js'
import { relativePathTo } from "../utils/relativepath.js"

let translateAllThePage
let localizeHTMLTag

let locationModPath =  relativePathTo("@js/pages",getLocationModule())


export async function init() {
    const locationMod = await import(locationModPath)
    translateAllThePage = locationMod.translateAllThePage
    localizeHTMLTag = locationMod.localizeHTMLTag
    translateAllThePage();
    localizeHTMLTag("subscription_has_not_be_made");
    localizeHTMLTag("try_to_subscribe_the_course_from");
    localizeHTMLTag("this_website");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const message = urlParams.get('message');
    document.getElementById('message').innerHTML = message;
}

window.document.querySelector('body').addEventListener('load', init())

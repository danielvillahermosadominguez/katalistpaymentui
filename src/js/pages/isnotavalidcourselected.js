import {translateAllThePage, localizeHTMLTag } from "../location/location.js"


export async function init() {
    translateAllThePage();
    localizeHTMLTag("form_not_properly_called");
    localizeHTMLTag("try_to_subscribe_the_course_from");
}

window.document.querySelector('body').addEventListener('load', init())

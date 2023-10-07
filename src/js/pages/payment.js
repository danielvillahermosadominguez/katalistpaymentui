import { getLocationModule, getFetchsModule,  getIpModule } from '../config/config.js'
import { locationReplace } from "../dom/dom.js"
import { getErrorMessage , NO_SERVER_CONNECTION} from '../services/errors.js'
import { relativePathTo } from "../utils/relativepath.js"
const ERROR_FOLDER = "../errors/"

let t
let translateAllThePage
let localizeHTMLTag
let getMyExternalIp
let executeSubscription
let locationModPath = relativePathTo("@js/pages",getLocationModule())
let fetchsModPath = relativePathTo("@js/pages",getFetchsModule())
let ipModPath = relativePathTo("@js/pages",getIpModule()) 

export async function init() {
    const locationMod = await import(locationModPath)
    t = locationMod.t
    translateAllThePage = locationMod.translateAllThePage
    localizeHTMLTag = locationMod.localizeHTMLTag
    const fetchsMod = await import(fetchsModPath)
    executeSubscription = fetchsMod.executeSubscription
    
    const ipMod = await import(ipModPath);
    getMyExternalIp = ipMod.getMyExternalIp

    loadEvents()
    loadBody()
}
window.document.querySelector('body').addEventListener('load', init())

function loadEvents() {

}

async function loadBody() {
    loadDataFromStorage()
    translateAllThePage();
    localizeHTMLTag("label_price");
    localizeHTMLTag("label_course");
    localizeHTMLTag("purchaseSummary");
    localizeHTMLTag("label_username");
    localizeHTMLTag("label_card_number");
    localizeHTMLTag("label_expiration");
    localizeHTMLTag("button_confirm_purchase");
    const ipfield = document.getElementById("ip")
    const data = await getMyExternalIp()
    ipfield.value = data.ip
}

function loadDataFromStorage() {
    let courseId = sessionStorage.getItem('courseId');
    document.getElementById('input_courseId').value = courseId;
    let courseName = sessionStorage.getItem('courseName');
    document.getElementById('courseName').innerHTML = courseName;
    let coursePrice = sessionStorage.getItem('coursePrice');
    document.getElementById('input_coursePrice').value = coursePrice;
    document.getElementById('coursePrice').innerHTML = coursePrice;
    let email = sessionStorage.getItem('email');
    document.getElementById("email").value = email;
    let phoneNumber = sessionStorage.getItem('phoneNumber');
    document.getElementById("phoneNumber").value = phoneNumber;
    let name = sessionStorage.getItem('name');
    document.getElementById("name").value = name;
    let surname = sessionStorage.getItem('surname');
    document.getElementById("surname").value = surname;
    let dnicif = sessionStorage.getItem('dnicif');
    document.getElementById("dnicif").value = dnicif;
    let isCompany = sessionStorage.getItem('isCompany');
    document.getElementById("isCompany").value = isCompany;
    let company = sessionStorage.getItem('company');
    document.getElementById("company").value = company;
    let address = sessionStorage.getItem('address');
    document.getElementById("address").value = address;
    let postalCode = sessionStorage.getItem('postalCode');
    document.getElementById("postalCode").value = postalCode;
    let city = sessionStorage.getItem('city');
    document.getElementById("city").value = city;
    let region = sessionStorage.getItem('region');
    document.getElementById("region").value = region;
    let country = sessionStorage.getItem('country');
    document.getElementById("country").value = country;
}

export async function submitForm() {
    let formData = new FormData(document.getElementById('paycometPaymentForm'))
    let json = JSON.stringify(Object.fromEntries(formData))
    const data = await executeSubscription(json)
    if (data.error) {
        if (data.code == NO_SERVER_CONNECTION) {
            locationReplace(ERROR_FOLDER +"error.html?lang=" + String.locale + "&message=" + t("there_is_not_connection"))
            return
        }
        const courseId = document.getElementById('input_courseId').value;
        const message = getErrorMessage(data.code, courseId, t);
        locationReplace(ERROR_FOLDER+"error.html?lang=" + String.locale + "&message=" + message);
        return;
    }

    let paymentStatus = data.item
    if (paymentStatus.challengeUrl === null || paymentStatus.challengeUrl === "") {
        let message = t("problem_with_payment")
        message = message.replace("{1}", paymentStatus.errorCode);
        locationReplace(ERROR_FOLDER+"error.html?lang=" + String.locale + "&message=" + message);
        return;
    }

    locationReplace(paymentStatus.challengeUrl);
}

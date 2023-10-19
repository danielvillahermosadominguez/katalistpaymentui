import { locationReplace } from "../dom/dom.js"
import { getErrorMessage , NO_SERVER_CONNECTION} from '../services/errors.js'
import {t, translateAllThePage, localizeHTMLTag,localizeHTMLTagForAllOptionsInSelector } from "../location/location.js"
import {executeSubscription} from "../services/fetchs.js"
const ERROR_FOLDER = "../errors/"

export async function init() {            
    loadBody()
}
window.document.querySelector('body').addEventListener('load', init())

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
    localizeHTMLTagForAllOptionsInSelector("select-month", "option_month_", false)    
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

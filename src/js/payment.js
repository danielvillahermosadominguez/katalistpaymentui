import { getLocationModule, getFetchsModule, getDomModule } from '../js/config.js'

let t
let translateAllThePage
let localizeHTMLTag
let getCourse
let locationReplace


let locationModPath = getLocationModule()
let fetchsModPath = getFetchsModule()
let domModPath = getDomModule()

export async function init() {
    await import("https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js")
    const locationMod = await import(locationModPath)
    t = locationMod.t
    translateAllThePage = locationMod.translateAllThePage
    localizeHTMLTag = locationMod.localizeHTMLTag
    const fetchsMod = await import(fetchsModPath)
    getCourse = fetchsMod.getCourse

    const domsMod = await import(domModPath)
    locationReplace = domsMod.locationReplace
    loadEvents()
    loadBody()
}
window.document.querySelector('body').addEventListener('load', init())

function loadEvents() {

}

function loadBody() {
    loadDataFromStorage()
    translateAllThePage();
    localizeHTMLTag("label_price");
    localizeHTMLTag("label_course");
    localizeHTMLTag("purchaseSummary");
    localizeHTMLTag("label_username");
    localizeHTMLTag("label_card_number");
    localizeHTMLTag("label_expiration");
    localizeHTMLTag("button_confirm_purchase");
    $.getJSON("https://api.ipify.org?format=json", function (data) {
        $("#ip").val(data.ip);
    })
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

const urlBaseLocal = "https://katalistpaymentservice.azurewebsites.net";
const urlBase = "http://localhost:8080";
export async function submitForm() {
    let formData = new FormData(document.getElementById('paycometPaymentForm'))
    let json = JSON.stringify(Object.fromEntries(formData))
    let url = urlBase + "/subscription"
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: json
        })
        if (!response.ok) {
            let status = await response.status
            if (status !== 200) {
                let body = await response.json();
                location.replace("./errors/error.html?lang=" + String.locale + "&message=" + body.message);
                return;
            }
        } else {
            //const courseName = document.getElementById('courseName').innerHTML;
            //const price = document.getElementById('coursePrice').innerHTML;
            //location.replace("./success/subscribed.html?lang" + String.locale + "&course=" + courseName + "&price=" + price)
            let paymentStatus = await response.json();
            if (paymentStatus.challengeUrl === null || paymentStatus.challengeUrl === "") {
                location.replace("./errors/error.html?lang=" + String.locale + "&message=" + "Problem with the payment. Paycomet error = " + paymentStatus.errorCode);
                return;
            }

            location.replace(paymentStatus.challengeUrl);
        }

    } catch (error) {
        location.replace("./errors/error.html?lang=" + String.locale + "&message=" + t("there_is_not_connection"));
    }
}



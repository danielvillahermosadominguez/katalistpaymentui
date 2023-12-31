
import { getErrorMessage } from '../services/errors.js'
import { locationReplace } from "../dom/dom.js"
import { getCourse } from '../services/fetchs.js'
import { localizeHTMLTagForAllOptionsInSelector, translateAllThePage, localizeHTMLTag, t } from '../location/location.js'
const ERROR_FOLDER = "./views/errors/"
const PAYMENT_FOLDER = "./views/payment/"
export async function init() {
    hideBody()
    loadEvents()
    loadBody()
}


window.addEventListener('DOMContentLoaded', init(), false);

function showCompanyName() {
    const isCompany = document.getElementById("isCompany").value;
    const company = document.getElementById("company");
    const name = document.getElementById('name')
    const surname = document.getElementById('surname')
    if (isCompany == "true") {
        company.disabled = false;
        company.value = ""
        name.disabled = true
        name.value = t("no_aplicable_value");
        surname.disabled = true
        surname.value = t("no_aplicable_value");

    } else {
        company.disabled = true;
        company.value = t("no_aplicable_value");
        name.disabled = false
        name.value = "";
        surname.disabled = false
        surname.value = "";
    }
}

function addEventListenerToResetValidations(htmlElementId) {
    const htmlElement = document.getElementById(htmlElementId);
    htmlElement.addEventListener('change', e => {
        resetValidations(htmlElement);
    })
}
function loadEvents() {
    const button = document.getElementById("button_subscribe_now");
    button.addEventListener('click', e => {
        submitForm()
    })

    const isCompany = document.getElementById("isCompany");
    isCompany.addEventListener('change', e => {
        showCompanyName()
    })

    const inputFields = ["email",
        "phoneNumber",
        "name",
        "surname",
        "dnicif",
        "company",
        "address",
        "postalCode",
        "city",
        "region",
        "country"
    ]

    inputFields.forEach(addEventListenerToResetValidations)
}

function loadBody() {
    translateAllThePage();
    localizeHTMLTag("text_with_price");
    localizeHTMLTag("label_email");
    localizeHTMLTag("label_phone");
    localizeHTMLTag("label_name");
    localizeHTMLTag("label_surname");
    localizeHTMLTag("label_iscompany");
    localizeHTMLTag("label_dnicif");
    localizeHTMLTag("label_company");
    localizeHTMLTag("label_address");
    localizeHTMLTag("label_city");
    localizeHTMLTag("label_postalcode");
    localizeHTMLTag("label_region");
    localizeHTMLTag("label_country");
    localizeHTMLTag("option_only_subscription_to_moodle");
    localizeHTMLTag("option_only_invoice_with_holded");
    localizeHTMLTag("option_paycomet");
    localizeHTMLTag("button_subscribe_now");    
    localizeHTMLTagForAllOptionsInSelector("country", "option_country_", true)    
    loadParameters();
    showCompanyName();
}

function hideBody() {
    document.getElementsByTagName("BODY")[0].style.display = "none";
}
function showBody() {
    document.getElementsByTagName("BODY")[0].style.display = "";
}
async function loadParameters() {
    cleanDataInSessionStorage();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get('course')
    const courseId = Number(param)

    if (param === null || !Number.isInteger(courseId)) {
        locationReplace(ERROR_FOLDER + "isnotavalidcourselected.html?lang=" + String.locale)
    } else {
        document.getElementById('courseId').value = courseId
        const result = await getCourse(courseId);
        if (result.error) {
            const message = getErrorMessage(result.code, courseId, t);
            locationReplace(ERROR_FOLDER + "error.html?lang=" + String.locale + "&message=" + message);
            return;
        }

        const course = result.item;
        document.getElementById('courseName').innerHTML = course.name;
        document.getElementById("course_price").innerHTML = course.price;
        showBody()
    }
}

function showMessageInput(item, message) {
    item.setCustomValidity(message);
    item.reportValidity();
}

function resetValidations(item) {
    item.setCustomValidity("");
    item.reportValidity();
}

function validateForm() {
    let email = document.getElementById('email')
    if (email.value == "") {
        showMessageInput(email, t("mail_is_mandatory"));
        return false;
    }

    let phone = document.getElementById("phoneNumber");
    if (phone.value == "") {
        showMessageInput(phone, t("phone_is_mandatory"));
        return false;
    }

    let name = document.getElementById("name");
    if (name.value == "") {
        showMessageInput(name, t("name_is_mandatory"));
        return false;
    }

    let surname = document.getElementById("surname");
    if (surname.value == "") {
        showMessageInput(surname, t("surname_is_mandatory"));
        return false;
    }

    let dninif = document.getElementById("dnicif");
    if (dninif.value == "") {
        showMessageInput(dninif, t("nifcif_is_mandatory"));
        return false;
    }

    let company = document.getElementById("company");
    if (company.value == "") {
        showMessageInput(company, t("company_is_mandatory"));
        return false;
    }

    let address = document.getElementById("address");
    if (address.value == "") {
        showMessageInput(address, t("address_is_mandatory"));
        return false;
    }

    let postalCode = document.getElementById("postalCode");
    if (postalCode.value == "") {
        showMessageInput(postalCode, t("postal_is_mandatory"));
        return false;
    }

    let city = document.getElementById("city");
    if (city.value == "") {
        showMessageInput(city, t("city_is_mandatory"));
        return false;
    }

    let region = document.getElementById("region");
    if (region.value == "") {
        showMessageInput(region, t("region_is_mandatory"));
        return false;
    }

    let country = document.getElementById("country");
    if (country.value == "") {
        showMessageInput(country, t("country_is_mandatory"));
        return false;
    }

    return true
}

async function submitForm() {
    if (!validateForm()) {
        return
    }
    storeDataInSessionStorage();
    locationReplace(PAYMENT_FOLDER + "payment.html?lang=" + String.locale);
}

function cleanDataInSessionStorage() {
    sessionStorage.removeItem('isCompany');
    sessionStorage.removeItem('courseId');
    sessionStorage.removeItem('courseName');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('phoneNumber');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('surname');
    sessionStorage.removeItem('dnicif');
    sessionStorage.removeItem('company');
    sessionStorage.removeItem('address');
    sessionStorage.removeItem('postalCode');
    sessionStorage.removeItem('city');
    sessionStorage.removeItem('region');
    sessionStorage.removeItem('country');
}

function storeDataInSessionStorage() {
    cleanDataInSessionStorage();
    let courseId = document.getElementById("courseId").value;
    sessionStorage.setItem('courseId', courseId);
    let courseName = document.getElementById("courseName").innerHTML;
    sessionStorage.setItem('courseName', courseName);
    let coursePrice = document.getElementById("course_price").innerHTML;
    sessionStorage.setItem('coursePrice', coursePrice);
    let email = document.getElementById("email").value;
    sessionStorage.setItem('email', email);
    let phoneNumber = document.getElementById("phoneNumber").value;
    sessionStorage.setItem('phoneNumber', phoneNumber);
    let name = document.getElementById("name").value;
    sessionStorage.setItem('name', name);
    let surname = document.getElementById("surname").value;
    sessionStorage.setItem('surname', surname);
    let dnicif = document.getElementById("dnicif").value;
    sessionStorage.setItem('dnicif', dnicif);
    let company = document.getElementById("company").value;
    sessionStorage.setItem('company', company);
    let address = document.getElementById("address").value;
    sessionStorage.setItem('address', address);
    let postalCode = document.getElementById("postalCode").value;
    sessionStorage.setItem('postalCode', postalCode);
    let city = document.getElementById("city").value;
    sessionStorage.setItem('city', city);
    let region = document.getElementById("region").value;
    sessionStorage.setItem('region', region);    
    let country = document.getElementById("country").value;    
    sessionStorage.setItem('country', country);
    let isCompany = document.getElementById("isCompany").value;
    sessionStorage.setItem('isCompany', isCompany);
}


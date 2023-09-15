const urlBaseLocal =  "https://katalistpaymentservice.azurewebsites.net";
const urlBase =  "http://localhost:8080";

async function loadParameters() {
    translateAllThePage();
    localizeHTMLTag("label_name");
    localizeHTMLTag("text_with_price");
    localizeHTMLTag("label_email");
    localizeHTMLTag("label_surname");
    localizeHTMLTag("label_company");
    localizeHTMLTag("label_dnicif");
    localizeHTMLTag("option_only_subscription_to_moodle");
    localizeHTMLTag("option_only_invoice_with_holded");
    localizeHTMLTag("option_paycomet");
    localizeValueTag("button_subscribe_now");
    const a = document.getElementsByTagName("BODY")[0].style.display
    document.getElementsByTagName("BODY")[0].style.display = "none";
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get('course')
    const course = Number(param)

    if (param === null || !Number.isInteger(course)) {
        location.replace("./errors/isnotavalidcourselected.html?lang=" + String.locale)
    } else {                
        document.getElementById('courseId').value = course
        let url = urlBase +"/courses/" + course
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "GET",
            })
            if (!response.ok) {
                const body = await response.json()
                location.replace("./errors/error.html?lang=" + String.locale + "&message=" + body.message)
                return
            }
            const course = await response.json()
            document.getElementById('courseName').innerHTML = course.name
            let p = document.getElementById("course_price")
            document.getElementById("course_price").innerHTML = course.price
            document.getElementsByTagName("BODY")[0].style.display = ""
        } catch (error) {
            let url = "./errors/error.html?lang=" + String.locale + "&message=There is not connection to the server. Please try again."
            location.replace(url)        
        }
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
    let email = document.forms["form_submit"]["email"];

    if (email.value == "") {
        showMessageInput(email, _("mail_is_mandatory"));
        return false;
    } 

    let name = document.forms["form_submit"]["name"];
    if (name.value == "") {
        showMessageInput(name, _("name_is_mandatory"));
        return false;
    } 

    let surname = document.forms["form_submit"]["surname"];
    if (surname.value == "") {
        showMessageInput(surname, _("surname_is_mandatory"));
        return false;
    } 

    let company = document.forms["form_submit"]["company"];
    if (company.value == "") {
        showMessageInput(company, _("company_is_mandatory"));
        return false;
    } 

    let dninif = document.forms["form_submit"]["dnicif"];
    if (dninif.value == "") {
        showMessageInput(dninif, _("nifcif_is_mandatory"));
        return false;
    } 
    
    return true
}

async function submitForm() {
    if (!validateForm()) {
        return
    }
    let url = "";
    let selector = document.getElementById("paymentMethod")
    let payment_method = selector.value
    if (payment_method === 'Moodle') {        
        url = urlBase +"/freesubscription"
    } else if (payment_method === 'Holded') {
        url = urlBase +"/invoicing"        
    } else if (payment_method = 'Paycomet') {
        url = ""
    }

    let courseName = document.getElementById("courseName");
    let price = document.getElementById("course_price");
    let formData = new FormData(document.getElementById('form_submit'))
    let json = JSON.stringify(Object.fromEntries(formData))
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
                let body = await response.json()
                let url = "./errors/error.html?lang=" + String.locale + "&message=" + body.message
                location.replace(url)
            }
        } else {
            let url = "./success/subscribed.html?lang=" + String.locale + "&course=" + courseName.innerText + "&price=" + price.innerText
            location.replace(url)
        }
    } catch (error) {
        let url = "./errors/error.html?lang=" + String.locale + "&message="+ _("there_is_not_connection")
        location.replace(url)        
    }
}


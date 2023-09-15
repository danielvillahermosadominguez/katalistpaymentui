const urlBase =  "https://katalistpaymentservice.azurewebsites.net";
const urlBaseLocal =  "http://localhost:8080";
const NO_SERVER_CONNECTION = -2

async function getCourse(courseId) {
    let url = urlBase +"/courses/" + courseId
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
            return {
                error: true,
                code: body.code,
                item: null
            };
        }
        const course = await response.json()        
        
        return {
            error: false,
            code: -1,
            item: course
        };
    } catch (error) {
        return {
            error: true,
            code: -2,
            item: null
        };
    }

}

async function post(url, json){
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
                return {
                    error: true,
                    code: body.code,
                    item: null
                };                
            }
        } else {
            return {
                error: false,
                code: -1,
                item: null
            };
        }
    } catch (error) {
        return {
            error: true,
            code: -2,
            item: null
        };    
    }
}

function getErrorMessage(code, parameter) {
    let message = "";
    if(code == NO_SERVER_CONNECTION) {
        message = _("there_is_not_connection");
    } else {
        message = _("backend_error_code_"+ code);
        message = message.replace("{1}", parameter);
        message = _("backend_error_code_"+ code);
    }                    
     
    message = message.replace("{1}", courseId);
    return message;
}
async function loadParameters() {    
    const a = document.getElementsByTagName("BODY")[0].style.display
    document.getElementsByTagName("BODY")[0].style.display = "none";
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get('course')
    const courseId = Number(param)

    if (param === null || !Number.isInteger(courseId)) {
        location.replace("./errors/isnotavalidcourselected.html?lang=" + String.locale)
    } else {             
        document.getElementById('courseId').value = courseId
        const result = await getCourse( courseId);        
        if(result.error) { 
            const message = getErrorMessage(result.code, courseId);
            location.replace("./errors/error.html?lang=" + String.locale + "&message=" + message);
            return;
        }

        const course = result.item;
        document.getElementById('courseName').innerHTML = course.name;
        let p = document.getElementById("course_price");
        document.getElementById("course_price").innerHTML = course.price;
        document.getElementsByTagName("BODY")[0].style.display = "";
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
    const result = await post(url, json);
    if(result.error) { 
        const message = getErrorMessage(result.code, 0);
        location.replace("./errors/error.html?lang=" + String.locale + "&message=" + message);
        return;
    }
    
    location.replace("./success/subscribed.html?lang=" + String.locale + "&course=" + courseName.innerText + "&price=" + price.innerText)
}


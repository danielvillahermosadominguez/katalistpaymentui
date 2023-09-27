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
    cleanDataInSessionStorage();
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

    let phone = document.forms["form_submit"]["phoneNumber"];
    if (phone.value == "") {
        showMessageInput(phone, _("phone_is_mandatory"));
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

    let dninif = document.forms["form_submit"]["dnicif"];
    if (dninif.value == "") {
        showMessageInput(dninif, _("nifcif_is_mandatory"));
        return false;
    } 

    let company = document.forms["form_submit"]["company"];
    if (company.value == "") {
        showMessageInput(company, _("company_is_mandatory"));
        return false;
    } 

    let address = document.forms["form_submit"]["address"];
    if (address.value == "") {
        showMessageInput(address, _("address_is_mandatory"));
        return false;
    } 

    let postalCode = document.forms["form_submit"]["postalCode"];
    if (postalCode.value == "") {
        showMessageInput(postalCode, _("postal_is_mandatory"));
        return false;
    } 

    let city = document.forms["form_submit"]["city"];
    if (city.value == "") {
        showMessageInput(city, _("city_is_mandatory"));
        return false;
    } 

    let region = document.forms["form_submit"]["region"];
    if (region.value == "") {
        showMessageInput(region, _("region_is_mandatory"));
        return false;
    } 

    let country = document.forms["form_submit"]["country"];
    if (country.value == "") {
        showMessageInput(country, _("country_is_mandatory"));
        return false;
    } 
     
    return true
}

async function submitForm() {
    if (!validateForm()) {
        return
    }    
    storeDataInSessionStorage();
    location.replace("./payment.html?lang=" + String.locale);        
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
    let courseId = document.forms["form_submit"]["courseId"].value;    
    sessionStorage.setItem('courseId',courseId);    
    let courseName = document.getElementById("courseName").innerHTML;
    sessionStorage.setItem('courseName',courseName); 
    let coursePrice = document.getElementById("course_price").innerHTML;
    sessionStorage.setItem('coursePrice',coursePrice);                 
    let email =  document.getElementById("email").value;
    sessionStorage.setItem('email',email);                 
    let phoneNumber =  document.getElementById("phoneNumber").value;
    sessionStorage.setItem('phoneNumber',phoneNumber);                 
    let name =  document.getElementById("name").value;
    sessionStorage.setItem('name',name);                 
    let surname =  document.getElementById("surname").value;
    sessionStorage.setItem('surname',surname);                 
    let dnicif =  document.getElementById("dnicif").value;
    sessionStorage.setItem('dnicif',dnicif);                 
    let company =  document.getElementById("company").value;
    sessionStorage.setItem('company',company);                     
    let address =  document.getElementById("address").value;
    sessionStorage.setItem('address',address);                 
    let postalCode =  document.getElementById("postalCode").value;
    sessionStorage.setItem('postalCode',postalCode);                 
    let city =  document.getElementById("city").value;
    sessionStorage.setItem('city',city);                     
    let region =  document.getElementById("region").value;
    sessionStorage.setItem('region',region);                     
    let country  =  document.getElementById("country").value;
    sessionStorage.setItem('country',country);         
    let isCompany  =  document.getElementById("isCompany").value;
    sessionStorage.setItem('isCompany',isCompany);                 
}


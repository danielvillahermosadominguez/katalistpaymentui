export async function getMyExternalIp() {    
    await import("https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js")
    return $.getJSON("https://api.ipify.org?format=json")
}



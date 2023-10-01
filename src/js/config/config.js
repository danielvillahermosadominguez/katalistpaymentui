
let locationModule = "@js/location/location.js"
let fetchsModule = "@js/services/fetchs.js"
let ipModule = "@js/services/ip.js"

export function getLocationModule() {
    return locationModule
}

export function setLocationModule(path){
    locationModule = path
}

export function getFetchsModule() {
    return fetchsModule
}

export function setFetchsModule(path){
    fetchsModule = path
}

export function getIpModule() {
    return ipModule
}

export function setIpModule(path){
    ipModule = path
}

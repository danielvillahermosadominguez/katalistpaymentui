
let locationModule = "./location.js"
let fetchsModule = "./fetchs.js"
let domModule = "./dom.js"
let ipModule = "./ip.js"

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

export function getDomModule() {
    return domModule
}

export function setDomModule(path){
    domModule = path
}

export function getIpModule() {
    return ipModule
}

export function setIpModule(path){
    ipModule = path
}

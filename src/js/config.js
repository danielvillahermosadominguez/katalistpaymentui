
let locationModule = "./location.js"
let fetchsModule = "./fetchs.js"
let domModule = "./dom.js"

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
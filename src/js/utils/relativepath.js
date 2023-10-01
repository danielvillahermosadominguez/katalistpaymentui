const root = '@'
const slash = "/"
const folderBack = "../"
const folderSame = "./"
const empty = ""

function buildDependingOn(accumulator, value) {
    return accumulator != empty
        ? slash + value
        : value
}
export function getLongestCommonPath(yourAbsPath, theOtherAbsPath) {
    let prefix = empty
    let rest = empty
    const folderTheOther = theOtherAbsPath.split(slash);
    const folderYours = yourAbsPath.split(slash);
    for (let i = 0; i < folderTheOther.length; i++) {
        if (folderYours[i] == folderTheOther[i]) {
            prefix += buildDependingOn(prefix, folderTheOther[i])
            continue
        }
        rest += buildDependingOn(rest, folderTheOther[i])
    }

    return {
        prefix: prefix,
        rest: rest
    }
}

function checkFormat(value, customMessage) {
    if (value.charAt(0) != root) {
        throw new PathRelativeError(customMessage)
    }
}

function addRootIfEmpty(value) {
    if (value == empty) {
        return root
    }
    return value
}

function removeLastSlash(value) {
    if (value.slice(-1) == slash) {
        return value.substr(0, value.length - 1)
    }
    return value
}

function checkAndPrepareFormat(yourAbsPath, theOtherAbsPath) {
    let input = addRootIfEmpty(yourAbsPath)
    let mask = addRootIfEmpty(theOtherAbsPath)

    checkFormat(input, "Format not correct: no @ at the beginning in the param 'yourAbsPath'")

    checkFormat(mask, "Format not correct: no @ at the beginning in the param 'theOtherAbsPath'")

    input = removeLastSlash(input)

    mask = removeLastSlash(mask)
    
    /*let prefixFolderback = empty
    let index = mask.indexOf(folderBack, 0)
    while(index >= 0) {
        prefixFolderback+= folderBack      
        index = mask.indexOf(folderBack, index + folderBack.length)          
    }
    mask = mask.replace(prefixFolderback, empty)    
*/
    return {        
        input: input,
        mask: mask
    }
}

export function relativePathTo(yourAbsPath, theOtherAbsPath) {
    let { input, mask } = checkAndPrepareFormat(yourAbsPath, theOtherAbsPath)

    if (input == root) {
        return mask.replace(root, folderSame)
    }

    let { prefix, rest } = getLongestCommonPath(input, mask)

    const folder = input.replace(prefix, empty)

    let result = folderSame
    if (folder != empty) {
        const folders = folder.split(slash)
        result = folders.reduce((accumulator, currentValue) => {
            return currentValue !== empty
                ? accumulator + folderBack
                : accumulator + currentValue
        }
            ,
            empty
        )    
    }    
    
    return prefix != empty
        ? result + rest
        : rest.replace(root, result)
}

export function PathRelativeError(message) {
    return new Error(message)
}

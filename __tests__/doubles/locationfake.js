export function translateAllThePage() {

}

export function localizeHTMLTag(tagId) {
	var tag = document.getElementById(tagId);
	if(tag !== null) {
		tag.innerHTML  = t(tagId);
	}	
}

export function localizeValueTag(tagId) {
	tag = document.getElementById(tagId);
	if(tag !== null) {
		tag.value = t(tagId);
	}
}

export function t(tagId) {	
	console.log("Translate! ["+ tagId +"]" )
	return "[" + tagId +"]"	
}

export function translateAllThePage() {
	console.log("ENTRANDO EN EL TRADUCIR TODO!!!!")
	const lang = getParameterValue("lang");
	console.log("lenguaje igual a = " +lang)
	if (lang != "") String.locale = lang;
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
	return "[" + tagId +"]"	
}

function getParameterValue(parameter) {
	parameter = parameter.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + parameter + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);
	if (results == null)
		return "";
	else
		return results[1];
}

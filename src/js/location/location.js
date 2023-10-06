import './i18n.js'

export function translateAllThePage() {
	var lang = getParameterValue("lang");
	if (lang != "") String.locale = lang;
}

var _ = function (string) {
	return string.toLocaleString();
};

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
	return _(tagId)	
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

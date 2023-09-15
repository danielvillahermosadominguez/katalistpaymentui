function translateAllThePage() {
	var lang = getParameterValue("lang");
	if (lang != "") String.locale = lang;

	document.title = _(document.title);	
}

var _ = function (string) {
	return string.toLocaleString();
};

function localizeHTMLTag(tagId) {
	tag = document.getElementById(tagId);
	if(tag !== null) {
		tag.innerHTML  = _(tagId);
	}	
}

function localizeValueTag(tagId) {
	tag = document.getElementById(tagId);
	if(tag !== null) {
		tag.value = _(tagId);
	}
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
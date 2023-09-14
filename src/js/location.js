function translateAllThePage() {
	var lang = getParameterValue("lang");
	if (lang != "") String.locale = lang;

	document.title = _(document.title);

	localizeHTMLTag("label_name");
	localizeHTMLTag("text_with_price");
	localizeHTMLTag("label_email");
	localizeHTMLTag("label_surname");
	localizeHTMLTag("label_company");
	localizeHTMLTag("label_dnicif");
	localizeHTMLTag("option_only_subscription_to_moodle");	
	localizeHTMLTag("option_only_invoice_with_holded");	
	localizeHTMLTag("option_paycomet");	
	localizeHTMLTag("button_subscribe_now");
}

var _ = function (string) {
	return string.toLocaleString();
};

function localizeHTMLTag(tagId) {
	tag = document.getElementById(tagId);
	tag.innerHTML = _(tagId);
}

function localizeValueTag(tagId) {
	tag = document.getElementById(tagId);
	tag.value = _(tagId);
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
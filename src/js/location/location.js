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
		console.log("Traduciendo " + tagId + "...")
		tag.innerHTML  = t(tagId);
		console.log("Traduccion: " + tagId + " ...OK")              
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

export function localizeHTMLTagForAllOptionsInSelector(selectorId, optionIdPrefix, sortByText) {
    const selector = document.getElementById(selectorId) 
    for(let i=0;i< selector.length;i++) {
        let value = selector.options[i].value
        localizeHTMLTag(optionIdPrefix + value.toLowerCase());
    }
    if(sortByText) {
        conserveOrderAfterTranslation(selectorId)
    }
}

function conserveOrderAfterTranslation(selectorId) {
    //The algorithm can be improved. For example with jquery. 
    //First version
    var selector, i, switching, options, shouldSwitch;
    selector = document.getElementById(selectorId);
    switching = true;    
    while (switching) {      
      switching = false;
      options = selector.options      
      for (i = 0; i < (options.length - 1); i++) {        
        shouldSwitch = false;        
        if (options[i].innerHTML.toLowerCase() > options[i + 1].innerHTML.toLowerCase()) {          
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {        
        options[i].parentNode.insertBefore(options[i + 1], options[i]);
        switching = true;
      }
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

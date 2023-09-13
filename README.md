# Visual Studio Code and Live Server

You should use Visual Studio Code with the extension "Live Server". We have some script related to localization and you will need
to use this plugin which creates a little server to render the website.

From Visual Studio you should choose the html file to open and choose "Open with live server"

# Localization in html5 and js - static website

We are using html5 and js which is deployed in a S3 or a static website. So, for the localization we have a simple solution by javascript and i18n.js.

The library i18n.js is in the file js/i18n.js.

In addition, we have several functions which help to translate the texts by identifying the tags of the elements.

In the folder lang, you have the text in 3 languages: Enlish, Spanish and Portugese.

The html page, need to execute the function translateAllThePage() at the begining. You need to be explicit with the ids you want to translate in this method.

The HTML page needs to include the following in the header:
``` html
    <link rel="localization" hreflang="en" href="lang/en.json" type="application/vnd.oftn.l10n+json"/>
    <link rel="localization" hreflang="es" href="lang/es.json" type="application/vnd.oftn.l10n+json"/>
    <link rel="localization" hreflang="pt" href="lang/pt.json" type="application/vnd.oftn.l10n+json"/>
    <script type="text/javascript" src="js/i18n.js"></script>	    
	<script type="text/javascript" src="js/location.js"></script>
```

For the integration, you will need to use the parameter "lang" to use the form. For example
``` 
    ./index.html?lang=en&course=<id of the course> // for english
    ./index.html?lang=es&course=<id of the course> // for spanish
    ./index.html?lang=pt&course=<id of the course> // for portugese
```



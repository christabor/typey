[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/christabor/typey/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
[![MIT Badge](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/christabor/typey/master/LICENSE)

typey
=====

An api wrapper for Google Fonts, making it easy to load and show all fonts at once.

## Usage
```
$(document).ready(function(){
    var fonTypeyLoader = fonTypey({
        api_key: YOUR_GOOGLE_API_KEY
    });
    fonTypeyLoader.initAllFeatures('dom-element-scope');
});
```

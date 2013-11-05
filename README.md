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

### Warning
This library is undergoing some rewriting, and will likely change. It is perfectly usable as-is, but be warning, there will likely be breaking changes in the near future.

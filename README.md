[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/christabor/typey/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
[![MIT Badge](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/christabor/typey/master/LICENSE)

typey
=====

An api wrapper for Google Fonts, making it easy to load and show all fonts at once.

## Usage

*Add the below data attributes and list within any element you want the UI to show up at.*

```html
<h1 data-typey-editable data-typey-target="h1.foo"><ul class="fonts" data-typey-font-list></ul>Heading!</h1>
```

```javascript
$(document).ready(function(){
    var fonTypeyLoader = fonTypey({
        api_key: YOUR_GOOGLE_API_KEY
    });
    fonTypeyLoader.initAllFeatures('dom-element-scope');
});
```

## Options

* `api_key` [string] - (required) - the api key for google fonts
* `auto_add` [bool] - auto add typey dropdowns to elements
* `auto_add_els` [object] - jquery selector with all elements to auto add typey dropdowns to
* `store_history` [bool] - whether or not to create a history list. An html element with *data-typey-font-history* must exist.
* `debug` [bool] - allow debug data to show

## Other stuff

#### Random fonts
For randomized fonts, add `data-typey-randomize-fonts` to any button.

#### History
For a history of fonts clicked, add a ul element with `data-typey-font-history` set.

#### Export UI
To add exporting css UI, add `data-typey-font-exporter` to any button, and add `data-typey-font-export` to any element where you want the exported code to show up at.

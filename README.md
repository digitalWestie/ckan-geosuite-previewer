# ckan-geosuite-previewer

This repo provides the means to get [GeoSolution's WMS and WMTS previewing extension](https://github.com/geosolutions-it/ckanext-mapstore/) to work with [BoundlessGeo's GeoServer software](http://boundlessgeo.com/solutions/opengeo-suite/). 

## How to install

In your opengeo geoexplorer directory, replace the files `composer.html` and `viewer.html` with the files of the same name found in this repo. You should find these under `/<install path>/opengeo/geoexplorer/WEB-INF/app/templates/`.

Add the files `geoparams.js` and `jquery-git2.min.js` to `/<install path>/opengeo/geoexplorer/WEB-INF/app/static/script/`. 

Install the WMS and WMTS previewing via the mapstore extension as [explained in the repo wiki](https://github.com/geosolutions-it/ckanext-mapstore/wiki). However, instead of basing your configuration in `preview_config.js` from the wiki, base it on the following:

```js
var preview_config = {
        viewerConfigName: "preview",
        viewerPath: "viewer/",
        composerPath: "composer/",
        mapStoreBaseURL: "http://yoursite.org/geoexplorer/",
        basketStatus: false,
        storageMethod: "cookies",
        forceLocaleTo: "en",
        storeSize: 5000
}
```

That should be it! NB The above method has been tested and is working with CKAN 2.2.1

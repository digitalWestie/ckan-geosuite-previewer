var extractParams = function(){
  // /////////////////////////////////////////////////////
  // Extra parameters to add layers at startup
  // /////////////////////////////////////////////////////
  var layName; var layTitle; var wmsurl; var gsturl; var urlformat; var useCookies;

  // //////////////////////////////////////////////////
  // Parsing the request to get the parameters
  // //////////////////////////////////////////////////
  var params = location.search.replace(/^\?/,'').replace(/&amp;/g,'&').split("&");

  for (var j=0; j < params.length; j++) {
    var param = params[j].split("=");
    if(param[0]){
      switch ( param[0] ) {
        case "mapId":
        try{
          mapIdentifier = parseInt(param[1]);
        }catch(e){
          mapIdentifier = -1;
        }
        break;
        case "auth" :
        authorization = param[1];
        if(param.length > 2){
          for(var i = 2; i < param.length; i++){
            authorization += "=";
          }
        }
        break;
        case "fullScreen" :
        if(param[1] == 'true')
          fullScreen = true;
        else
          fullScreen = false;
        break;
        case "layName" :
        layName = param[1];
        layName = decodeURIComponent(layName);
        break;
        case "layTitle" :
        layTitle = param[1];
        layTitle = decodeURIComponent(layTitle);
        break;
        case "wmsurl" :
        wmsurl = param[1];
        wmsurl = decodeURIComponent(wmsurl);
        break;
        case "gsturl" :
        gsturl = param[1];
        gsturl = decodeURIComponent(gsturl);
        break;
        case "useCookies" :
        useCookies = param[1];
        break;
        case "config":
        customConfigName = param[1];
        break;
        case "bbox":
        try{
          bbox = new OpenLayers.Bounds.fromString(param[1]);
        }catch(e){
          bbox = undefined;
        }
        break;
        case "configId":
        try{
          templateId = parseInt(param[1]);
        }catch(e){
          templateId = -1;
        }
        break;
        case "format":
        urlformat = param[1];
        break;
        default :
    //mapIdentifier = -1;
    //authorization = false;
    //fullScreen = false;
      }
    }
  }

  return { layName: layName, layTitle: layTitle, wmsurl: wmsurl, useCookies: useCookies };
};

var extendMapAndSourcesFromParams = function(map,sources){
  var pdata = extractParams();
  var new_layers = [];
  var hasLayer = false;

  if (pdata.useCookies){
    //if in cookies or session
    var layersList = extractLayersList(pdata.useCookies, content);
    if (layersList){
      new_layers = addLayersFromList(map, sources, layersList);
    }
  } else if (pdata.wmsurl) {
    //if in url params
    addSource(sources, "params", pdata.wmsurl, new URL(pdata.wmsurl).hostname);
    if (pdata.layName) {
      if (pdata.layTitle == undefined){ pdata.layTitle = pdata.layName; }
      new_layers.push(addLayer(map, "params", pdata.layName, pdata.layName));
    }
  }

  if (new_layers.length > 0) {
    hasLayer = true;
    pdata.layName = new_layers[0].name;
    pdata.layTitle = new_layers[0].title;
  }

  pdata.hasLayer = hasLayer;
  return pdata;
};

var extractLayersList = function(useCookies){
  //if we have content.data or cookies
  var layersList;
  if(useCookies){
    var cookie = window.document.cookie;
    var cookies = cookie.split(";");
    var layersList;
    for(var i=0; i<cookies.length; i++){
      //go through each cookie and the useCookies key
      if(cookies[i].indexOf(useCookies) != -1){
        layersList = cookies[i].split("=")[1];
      }
    }
  }
  return layersList;
};

var addLayersFromList = function(map, sources, layersList){
  var layers = layersList.split("#");
  var new_layers = [];
  for(var i=0; i<layers.length; i++){
    var kees = layers[i];

    kees = unescape(kees);
    kees = Ext.util.JSON.decode(kees);

    var lname = kees.layer;
    var lwms = decodeURIComponent(kees.wms);

    var source_key;
    //check if we already have the source
    $.each(sources, function(k,v) {
      if(v.url === lwms){ source_key = k; }
    });
    if (!source_key){
      source_key = "layer_source_"+i;
      addSource(sources, source_key, lwms, new URL(lwms).hostname);
    }
    new_layers.push(addLayer(map, source_key, lname, lname));
  }
  return new_layers;
};

var addSource = function(sources, source_key, wmsurl, title){
  var new_source = { url: wmsurl, title: title }
  sources[source_key] = new_source;
  return new_source;
};

var addLayer = function(map, source_key, layName, layTitle){
  var new_layer = { source: source_key, name: layName, title: layTitle }
  map.layers.push(new_layer);
  return new_layer;
};

var zoomToLayer = function(app, pdata){
  if (pdata.hasLayer){
    var chosenLayer = app.mapPanel.map.getLayersByName(pdata.layName)[0];
    var extent = chosenLayer.maxExtent;
    app.mapPanel.map.zoomToExtent(extent);
  }
};
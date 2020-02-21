// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    function markers(feature, latlng){
        let options = {
            fillOpacity: 0.75,
            color: selectColor(feature.properties.mag),
            fillColor: selectColor(feature.properties.mag),
            radius: feature.properties.mag * 50000
        }
        return L.circle(latlng, options);
    }

  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature : function(feature, layer){
        layer.bindPopup(`<h1>${feature.properties.place}</h1><hr><h3>Points: ${Date(feature.properties.time)}</h3><h3>Magnitude: ${feature.properties.mag}</h3>`)
    },
    pointToLayer: markers


  });

  createMap(earthquakes);

});

function selectColor(mag){
    if (mag > 7) {
        return "red";
    }
    else if (mag > 6) {
        return "orange";
    }
    else if (mag > 4){
        return "yellow";
    }
    else if (mag > 2){
        return "greenyellow";
    }
    else {
        return "green";
    }
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes){

  // Define satellitemap and darkmap layers
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite Map": satellite,
    "Dark Map": darkmap
  };

  // Create overlay object to hold the earthquake data
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a new map
  var myMap = L.map("map", {
    center: [35.402276, 18.355001],
    zoom: 3,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    var magnitudes = ['0-2','2-4','4-6','6-7','7+'];
    var colors = ['green','greenyellow','yellow','orange','red'];
    for (var i=0; i<magnitudes.length; i++){
      div.innerHTML += '<p style="margin-left: 10 px">'+'<i style="background:'+colors[i]+'"></i>'+magnitudes[i]+'</p>';
    }
    return div;
};

legend.addTo(myMap);

};


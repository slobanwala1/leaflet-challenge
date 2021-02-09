// Name: Shanil Lobanwala
// Date: Feb 5-6, 2021
// Project Name: leaflet-challenge
// File: leaflet-challenge/Leaflet-Step-1/logic.js

// Function to set up map with the center and zoom value
var initMap = L.map("map", {
  center: [38, -123],
  zoom: 4
});

// map tile layer(the background)
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={your_access_token}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  your_access_token: API_KEY
}).addTo(initMap);

// earthquake API
var api = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(api, function(data) {
  function styleMap(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: styleColor(feature.properties.mag),
      color: "#000000",
      radius: styleRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function styleColor(mapFeatureMag) {
    if (mapFeatureMag > 5) {
      return "#ea2c2c";
    } else if(mapFeatureMag > 4) {
      return "#eaa92c";
    } else if(mapFeatureMag > 3) {
      return "#d5ea2c";
    } else if(mapFeatureMag > 2) {
      return "#92ea2c";
    } else if(mapFeatureMag > 1) {
      return "#2ceabf";
    } else {
      return "#2c99ea";
    }
  }

  function styleRadius(mag) {
    if (mag === 0) {
      return 1;
    }
    return mag * 3.5;
  }

  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: styleMap,

    onEachFeature: function(feature, layer) {
      layer.bindPopup("Mag: " + feature.properties.mag + "<br>Loc: " +
      feature.properties.place);
    }
  }).addTo(initMap);

  var mapLegend = L.control({
    position: "bottomright"
  });

  mapLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");

    // Magnitude grades and associated colors
    var magGrades = [0, 1, 2, 3, 4, 5];

    var magColors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    for(var i = 0; i < magGrades.length; i++) {
      div.innerHTML += "<i style='background: " + magColors[i] + "'></i> " +
      magGrades[i] + (magGrades[i + 1] ? "&ndash;" + magGrades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  mapLegend.addTo(initMap);
});

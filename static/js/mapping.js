const brazil =
  'https://raw.githubusercontent.com/Florianopolis-NASA-Space-Apps/geomap/refs/heads/master/data/brazil.geojson?raw=true';
const farmer =
  'https://raw.githubusercontent.com/Florianopolis-NASA-Space-Apps/geomap/refs/heads/master/data/farmer.geojson?raw=true';

d3.json(farmer).then(function (response) {
  // FARMER
  var farmer = L.geoJSON(response, {
    onEachFeature: function (fire, layer) {
      layer.bindPopup(
        '<h1>🚜 Farmer</h1>' + '<p>' + JSON.stringify(fire, null, 2) + '</p>',
        {
          maxWidth: 400,
        },
      );
    },
    pointToLayer: addCircleMarker,
  });
  function addCircleMarker(fire, latlng) {
    let options = {
      radius: 12.5,
      stroke: false,
      fillColor: '#72fa41',
      fillOpacity: 0.75,
    };
    return L.circleMarker(latlng, options);
  }

  // BRZILIAN FARMERS
  d3.json(brazil).then((data) => {
    var wildfires = L.geoJSON(data, {
      onEachFeature: function (fire, layer) {
        layer.bindPopup(
          '<h1>🔥 Wildfire</h1>' +
            '<p>' +
            JSON.stringify(fire, null, 2) +
            '</p>',
          {
            maxWidth: 400,
          },
        );
      },
      pointToLayer: addCircleMarker,
    });
    function addCircleMarker(fire, latlng) {
      let options = {
        radius: fire.properties.frp / 200,
        stroke: false,
        fillColor: markerColor(fire.properties.frp),
        fillOpacity: 0.75,
      };
      return L.circleMarker(latlng, options);
    }
    createMap(wildfires, farmer);
  });
});

//Create Map Function
function createMap(wildfires, farmer) {
  const dark = L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/dark-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY,
    },
  );

  const light = L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/light-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY,
    },
  );

  const sattelite = L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/satellite-v9',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY,
    },
  );

  const baseMaps = {
    Light: light,
    Dark: dark,
    Sattelite: sattelite,
  };

  const overlayMaps = {
    Wildfires: wildfires,
    Farmer: farmer,
  };

  let myMap = L.map('map', {
    center: [
      // Coordinates for the center of Brazil
      // 14-degrees South, 51-degrees West
      -14, -51,
    ],
    zoom: 4,
    layers: [dark, wildfires, farmer],
  });

  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);

  //Add legend
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<h5>Radiation</h5>';
    significance = [0, 300, 400];
    for (var i = 0; i < significance.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        markerColor(significance[i] + 1) +
        '"></i> ' +
        +significance[i] +
        (significance[i + 1]
          ? ' - ' + significance[i + 1] + '<br><br>'
          : ' + ');
    }
    return div;
  };

  legend.addTo(myMap);
}

// Define function for Market Color
function markerColor(radiation) {
  if (radiation <= 300) {
    return '#e22822';
  } else if (radiation <= 400) {
    return '#e85607';
  } else {
    return '#fede17';
  }
}

// Define function for fault stroke weight
function strokeWeight(slip_rate) {
  switch (slip_rate) {
    case 'Greater than 5.0 mm/yr':
      return 2;
    case 'Between 1.0 and 5.0 mm/yr':
      return 1;
    default:
      return 0;
  }
}

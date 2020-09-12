// code for creating Basic Map (Level 1)
var myMap = L.map('map').setView([0, 0], 3);

//Get the geojson data
const link='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson';

// Seting the tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

// Function for Marker Size
function markerSize(Magnitude) {
    return Magnitude **4*200;
  }

// Find min and max of significance
  d3.json(link).then(function(data){
    let features=data.features;
    let sig=[];
    features.forEach(d=>{
        sig.push(d.properties.sig);
    });
    let sigMin=Math.min(...sig);
    let sigMax=Math.max(...sig);
    console.log(sigMin);
    console.log(sigMax)
});


function markerColor(sig) {
    if (sig <= 250) {
        return "white";
    } else if (sig <= 500) {
        return "LightPink";
    } else if (sig <= 750) {
        return "LightCoral";
    } else if (sig <= 1000) {
        return "IndianRed";
    } else {
        return "Crimson";
    };
  }


//Grab the geojson data
d3.json(link).then(function(data){
    let features=data.features;
    console.log(features);
  
    features.forEach(d=>{
        let location=[d.geometry.coordinates[1],d.geometry.coordinates[0]];
        L.circle(location,{
            fillOpacity: 0.75,
            stroke:false,
            fillColor:markerColor(d.properties.sig),
            radius:markerSize(d.properties.mag)
        }).bindPopup("<h1>Earthquake: " + d.properties.place + "</h1> <hr> Time: " + new Date (d.properties.time) + "<hr> Magnitude: " + d.properties.mag + "<hr> Significance: " + d.properties.sig).addTo(myMap);
        
    })
});

//Add legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += "<h5>EQ Significance</h5>";
    significance = [0, 250, 500, 750, 1000];
    for (var i = 0; i < significance.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(significance[i] + 1) + '"></i> ' + 
    + significance[i] + (significance[i + 1] ? ' - ' + significance[i + 1] + '<br><br>' : ' + ');
    }
    return div;
};

legend.addTo(myMap);


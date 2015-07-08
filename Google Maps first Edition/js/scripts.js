
//Global map variable
var map;

// Get the location to display the coordinates
var lat = document.getElementById('latcoords');
var lng = document.getElementById('loncoords');

// Style elements
var mapStyle = [
    {
        'stylers': [
            {'saturation': -100},
            {'gamma': 1}
        ]
    },
    {
        'elementType': 'labels.text.stroke',
        'stylers': [
            {'visibility': 'off'}
        ]
    },
    {
        'featureType': 'road',
        'elementType': 'geometry',
        'stylers': [
            {'visibility': 'simplified'}
        ]
    },
    {
        'featureType': 'water',
        'stylers': [
            {'visibility': 'on'},
            {'saturation': 50},
            {'gamma': 0},
            {'hue': '#50a5d1'}
        ]
    },
    {
        'featureType': 'landscape',
        'elementType': 'all',
        'stylers': [
            {'color': '#e2e2e2'}
        ]
    }
    
]


//Function run on DOM load
function loadMap() {

    //Set the map options
    var mapOptions = {

        //Zoom on load
        zoom: 15,

        //Map center
        center: new google.maps.LatLng(51.1556826, 4.437092000000007),
        
        // Limit min/max zoom
        minZoom: 2,
        maxZoom: 18,
        
        // Map control
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [google.maps.MapTypeId.ROADMAP,     // default road map view
                        google.maps.MapTypeId.SATELLITE,    // satellite images
                        google.maps.MapTypeId.HYBRID,       // mixture of road map and satellite views
                        google.maps.MapTypeId.TERRAIN],     // shows elevations and physical terrain features
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        
        // set maptype
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        
        // 0 to 45deg, only valid for satellite and terrain
        tilt: 45,
        
        // Zoom controls
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        
        // Pan Controls
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },
        
        //Streetviewcontrol
        streetViewControl: true,
        
        // Overview Map
        overviewMapControl: true,
        overviewMapControlOptions: {
            opened: true
        },
        
        //Set the map style
        styles: mapStyle
        

    };

    //Get the id of the map container div
    var mapId = document.getElementById('map');

    //Create the map
    map = new google.maps.Map(mapId, mapOptions);
    
    // marker creation
    var newMarker = this.addMarker();
    
    addInfoWindow(newMarker);
    
    // automaticly opens info window onload
    google.maps.event.trigger(newMarker, 'click');
    
    updateCurrentLatLng(map.getCenter());
    
    //update the URL with the current location
    updateUrlLocation(map.getCenter(), map.getZoom());
    
    mapEventListeners();


}

// add a marker to the map
function addMarker() {
    // create the marker(#markerOptions)
    var marker = new google.maps.Marker({
        // position of marker
        position: new google.maps.LatLng(51.1556826, 4.437092000000007),
        
        /*// map
        map: map,*/
        
        // Icon details
        icon: {
            // URL of the image
            url: 'img/home-2.png',
            // sets the image size
            size: new google.maps.Size(40, 40),
            // sets the origin of the image (top left)
            origin: new google.maps.Point(0, 0),
            // sets the anchor (middle, bottom)
            anchor: new google.maps.Point(20, 40),
            //scales the image
            scaledSize: new google.maps.Size(40, 40)
        },
        
        // set the animation (BOUNCE or DROP)
        animation: google.maps.Animation.DROP,
        
        // set whether marker is clickable
        clickable: true,
        
        // drag marker
        draggable: true,
        
        // set the cross underneath the draggable marker
        crossOnDrag: false,
        
        // sets the opacity
        opacity: 1.0,
        
        // sets the title when mouse hovers
        title: 'Hier woon ik!',
        
        // set visibility
        visible: true,
        
        // Sets the zIndex if multiple markers are displayed
        zIndex: 1
        
    });
    
    marker.setMap(map);
    marker.setVisible(true);
    
    return marker;
}

function addInfoWindow(marker) {
    
    // content string
    var contentString = '<div class="infowindowcontent">' +
        '<div class="row">' + 
        '<p class="total bluebk"> Vix. </p>' + 
        '<p class="location"> EDEGEM (2650) </p>' +
        '<p class="code"> Drie Eikenstraat 128</p>' + 
        '</div>'+
        '<div class="data">' +
        '<p class="tagbelow">Bewoners</p>'+
        '<p class="label">Konijnen</p>'+
        '<p class="details">50% (4)</p>' +
        '<p class="label">Katten</p>'+
        '<p class="details">25% (2)</p>' +
        '<p class="label">Vogels</p>'+
        '<p class="details">12.5% (1)</p>' +
        '<p class="label">Mensen</p>'+
        '<p class="details">12.5% (1)</p>' +
        '<p class="coords">51.1556826, 4.437092000000007</p>' +
        '</div>' +
        '</div>';
               
    
    var infoWindow = new google.maps.InfoWindow({
        content: contentString,
        disableAutoPan: false,
        maxWidth: 300,
        zIndex: 1
        
    });
    
    google.maps.event.addListener(marker, 'click', function(e) {
        infoWindow.open(map, marker);
    });
    
}

// Map event listeners
function mapEventListeners() {
    // Mouse move updates the coordinates
    var mouseMoveChanged = google.maps.event.addListener(map, 'mousemove', function(event) {
        // update the coordinates
        updateCurrentLatLng(event.latLng);
    });
    
    var mouseDoubleClick = google.maps.event.addListener(map, 'rightclick', function(event) {
        var z = map.getZoom() + 1;
        
        if(z<16) {
            map.setZoom(z);
        } else {
            map.setZoom(11);
        }
        
        map.setCenter(event.latLng);
    });
    
    // wait for map to load
    var listenerIdle = google.maps.event.addListenerOnce(map,'idle', function() {
//        alert('map is ready!');
    });
    
    // Drag End
    var listenerDragEnd = google.maps.event.addListener(map, 'dragend', function() {
        updateUrlLocation(map.getCenter(), map.getZoom());
    });
    
    // Zoom changed
    var listenerZoomChanged = google.maps.event.addListener(map, 'zoom_changed', function() {
        updateUrlLocation(map.getCenter(), map.getZoom());
    });
}

// Update the position of the mouse in latitude and longitude
function updateCurrentLatLng(latLng) {
    // update the coordinates
    lat.innerHTML = latLng.lat();
    lng.innerHTML = latLng.lng();
}

// update the URL with the map center and zoom
function updateUrlLocation(center, zoom) {
    var url = '?lat='+center.lat()+'&lon='+center.lng()+'&zoom='+zoom;
    
    // Set the URL
    window.history.pushState({center: center, zoom: zoom}, 'map center', url);
}
  
//Load the map
google.maps.event.addDomListener(window, 'load', loadMap());
       




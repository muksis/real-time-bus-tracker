let map;
let markers = [];

// load map
function init(){
	const mapOptions = {
		zoom      : 14,
		center    : { lat:42.353350,lng:-71.091525},
		mapTypeId : 'hybrid'
	};
	const element = document.getElementById('map');
  	map = new google.maps.Map(element, mapOptions);
  	addMarkers();
}

// Add bus markers to map
async function addMarkers(){
	// get bus data
	const locations = await getBusLocations();

	// loop through data, add bus markers
	locations.forEach(bus => {
		let marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker, bus);
		}
		else{
			addMarker(bus);			
		}
	});

	// timer
	console.log(new Date());
	setTimeout(addMarkers, 15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';	
	const response = await fetch(url);
	const json = await response.json();
	return json.data;
}

function addMarker(bus){
	const icon = getIcon(bus);
	let marker = new google.maps.Marker({
	    position: {
	    	lat: bus.attributes.latitude, 
	    	lng: bus.attributes.longitude
	    },
	    map: map,
	    icon: icon,
	    id: bus.id
	});
	markers.push(marker);
}

function getIcon(bus){
	// select icon based on bus direction
	if (bus.attributes.direction_id === 0) {
		return './images/left.png';
	}
	return './images/right.png';	
}

function moveMarker(marker, bus) {
	// change icon if bus has changed direction
	const icon = getIcon(bus);
	marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setPosition( {
    	lat: bus.attributes.latitude, 
    	lng: bus.attributes.longitude
	});
}

function getMarker(id){
	let marker = markers.find(item => item.id === id);
	return marker;
}

window.onload = init;
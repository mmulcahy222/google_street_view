/*
 * Click the map to set a new location for the Street View camera.
 */
 var map;
 var panorama;
 var sv;
 var marker;
 var lat_lng;
 var markerPanoID;
 var count = 0;
 var times_to_loop = 0;
 function initMap() {
	lat_lng = {lat: 40.626503, lng: -74.179512}; 
	sv = new google.maps.StreetViewService();
	panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
	// Set up the map.
	map = new google.maps.Map(document.getElementById('map'), {
		center: lat_lng,
		zoom: 16,
		streetViewControl: false,
		keyboardShortcuts: false,
	});
	// Set the initial Street View camera to the center of the map
	sv.getPanorama({location: lat_lng, radius: 50}, processSVData);
	// Look for a nearby Street View panorama when the map is clicked.
	// getPanoramaByLocation will return the nearest pano when the
	// given radius is 50 meters or less.
	map.addListener('click', function(event) {
		sv.getPanorama({location: event.latLng, radius: 50}, processSVData);
	});
	keymap = {49:1,50:2,51:3,52:4,53:5,54:6,55:7,56:8,57:9,113:20,119:30,101:40,114:50,116:60};
	document.getElementsByTagName("body")[0].addEventListener('keypress', function(e) {
		count = 0;
		if(e.target.tagName == 'INPUT')
		{
			return;
		}
		//sorry I had to do it this way
		code = e.keyCode;
		if(code in keymap)
		{
			times_to_loop = keymap[code];
		}
		else
		{
			times_to_loop = 1;
		}
		sv.getPanorama({location: panorama.getPosition(), radius: 50}, position_changed);
	});
}
function processSVData(data, status) {
	if (status === 'OK') {
		console.log(data);
		forward_ids = [];
		//marker = new google.maps.Marker({
		//	position: data.location.latLng,
		//	map: map,
		//	title: data.location.description
		//});
		backward_pano = data.links[0]['pano'];
		forward_pano = data.links[1]['pano'];
		forward_heading = data.links[1]['heading'];
		panorama.setPov({
			heading: forward_heading,
			pitch: 0
		});
		panorama.setVisible(true);
		panorama.setPano(data.location.pano);
	} 
	else {
		console.error('Street View data not found for this location.');
	}
}
var old_heading = 0;
function get_heading_diff(h1, h2)
{   
	return (h2-h1+540) % 360 - 180;
}
function get_direction(degrees)
{
	return ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'][Math.round(degrees / 11.25 / 2)];
}
function position_changed(data, status)
{

	current_heading = (count == 0) ? panorama.getPov()['heading'] : forward_heading;
	next_links = data.links;
	var distances = []
	for(var i = 0; i < next_links.length; i++)
	{
		distances[i] = Math.abs(get_heading_diff(next_links[i]['heading'],current_heading));
	}
	closest_link_index = Object.keys(distances).reduce(function(a, b){ return distances[a] < distances[b] ? a : b });
	farthest_link_index = Object.keys(distances).reduce(function(a, b){ return distances[a] > distances[b] ? a : b });
	forward_pano = next_links[closest_link_index]['pano'];
	forward_heading = next_links[closest_link_index]['heading'];
	count += 1;
	document.getElementById('heading_value').innerHTML = get_direction(forward_heading);
	if(count > times_to_loop)
	{
		
		panorama.setPov({heading:forward_heading,pitch:0});
		panorama.setPano(forward_pano);
		map.setCenter(panorama.location.latLng);
		return;
	}
	//console.log(data.location.latLng,forward_pano,next_links,distances);
	sv.getPanoramaById(forward_pano, position_changed);
}
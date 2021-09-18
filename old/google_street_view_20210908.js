/*
 * Click the map to set a new location for the Street View camera.
 */
 var map;
 var panorama;
 var sv;
 var marker;
 var lat_lng;
 var markerPanoID;
 var last_data;
 var count = 0;
 var map_clicked = false;
var data_records = [];
var data_records_max_length = 2;

// Converts from degrees to radians.
function toRadians(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}


function bearing(startLat, startLng, destLat, destLng){
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);

  y = Math.sin(destLng - startLng) * Math.cos(destLat);
  x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}
function center_map()
{
	map.setCenter(panorama.getLocation().latLng);
}
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
	sv.getPanorama({location: lat_lng, radius: 50}, process_data_by_map_click);
	// Look for a nearby Street View panorama when the map is clicked.
	// getPanoramaByLocation will return the nearest pano when the
	// given radius is 50 meters or less.
	map.addListener('click', function(event) {
		map_clicked = true;
		sv.getPanorama({location: event.latLng, radius: 50}, process_data_by_map_click);
		map.setCenter(event.latLng);
	});
	panorama.addListener("pano_changed", () => {
		
  	});
  	panorama.addListener("location_changed", event => {
  		
  	});
  	panorama.addListener("links_changed", event => {
  		//DESIGNED TO PREVENT THE MAP CLICK TO RUN THIS EVENT!!!!!!!
  		if(map_clicked == true){
  			map_clicked = false;
  			return;	
  		}
		sv.getPanorama({location: panorama.getLocation().latLng, radius: 50}, process_data_by_map_click);
  		// center_map();
  	});
	panorama.addListener("pov_changed", () => {
    	// console.log('pov');
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
		sv.getPanorama({location: panorama.getPosition(), radius: 50}, position_changed_by_keypress);
	});
}
function process_data_by_map_click(data, status) {
	if (status === 'OK') {
		data_records.push(data);
		//page starts
		// if(data_records.length < data_records_max_length)
		// {
		// 	for (var i = 0; i < data_records_max_length - 1; i++) {
		// 		data_records.push(data);
		// 	}
		// }
		
		console.log(data_records);
		//marker = new google.maps.Marker({
		//	position: data.location.latLng,
		//	map: map,
		//	title: data.location.description
		//});
		last_data = data_records[data_records.length - 2];
		current_data = data_records[data_records.length - 1];
		last_latitude = last_data.location.latLng.lat();
		last_longitude = last_data.location.latLng.lng();
		current_latitude = current_data.location.latLng.lat();
		current_longitude = current_data.location.latLng.lng();
		forward_heading = bearing(last_latitude,last_longitude,current_latitude,current_longitude);
		console.log(forward_heading);
		if(forward_heading == 0)
		{
			return;
		}
		document.getElementById('heading_value').innerHTML = get_direction(forward_heading);
		// CENTER ARROW
		panorama.setPov({
			heading: forward_heading,
			pitch: 0
		});
		panorama.setVisible(true);
		panorama.setPano(data.location.pano);
		//record data
		//always has two
		//only a certain amount allowed in here
		while(data_records.length >= data_records_max_length)
		{
			data_records.shift();
		}
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
function position_changed_by_keypress(data, status)
{
	current_heading = (count == 0) ? panorama.getPov()['heading'] : forward_heading;
	next_links = data.links;
	console.log(next_links);
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
		center_map();
		return;
	}
	//console.log(data.location.latLng,forward_pano,next_links,distances);
	sv.getPanoramaById(forward_pano, position_changed_by_keypress);
}
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Directly accessing Street View data</title>
	<style>
			/* Always set the map height explicitly to define the size of the div
			* element that contains the map. */
			#map {
				height: 100%;
				cursor: pointer;
			}
			/* Optional: Makes the sample page fill the window. */
			html, body {
				height: 100%;
				margin: 0;
				padding: 0;
				font-family: "verdana";
				font-size: 13px;
				font-weight: 800px;
				color: #FFFFFF;
			}
			#header
			{
				width: 100%; 
				height: 25px; 
				overflow: hidden
			}
			#inner_header
			{
				background-color: #050466;
				border: 1px solid #6959BF;
				width: 100%;
				height: 100%;
			}
			#search
			{
				width: 150px;
			}
			#inner_header div
			{
				display: inline-block;
				position: relative;
				top: 45%;
				transform: translateY(-50%);
			}
			#heading
			{
				width: 150px;
				margin: 0px 10px;
			}
			#heading_value
			{
				font-weight: 900;
			}
		</style>
	<script src='jquery-3.2.1.min.js'></script>
	</head>
	<body>
		<div id="header">
			<div id="inner_header">
				<div id="search"><input type="text" id="input_search" /></div><!-- #search -->
				<div><input type="button" id="search_button" value="Search"/></div><!-- #search_button -->
				<div id="heading">Heading: <span id="heading_value"></span></div><!-- #heading -->

			</div><!-- #inner_header -->
		</div>
		<div id="pano" style="width: 75%; height: calc(100% - 25px);float:left"></div>
		<div id="map" style="width: 25%; height: calc(100% - 25px);float:left"></div>
		<script src="google_street_view.js">
			
		</script>
		<script async defer	src="https://maps.googleapis.com/maps/api/js?key=&callback=initMap">
	</script>
</body>
</html>
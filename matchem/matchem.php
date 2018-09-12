<!DOCTYPE html>
<html>
	<head>
		<?php
			$title = "Catch 'Em All";
			include($_SERVER['DOCUMENT_ROOT'] . "/header.php");
		?>
		<link rel="stylesheet" type="text/css" href="assets/fonts/fonts.css">
		<script type="text/javascript" src="phaser.js"></script>
		<script type="text/javascript" src="game.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,
      maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="HandheldFriendly" conent="true"/>
    <meta name="mobile-web-app-capable" content="yes"/>
    <style type="text/css">
      body {
        padding: 0px;
        margin: 0px;
        background: #000;
      }
    </style>
	</head>
	<body oncontextmenu="return false;">
		<?php
			$gamedev_class = "active";
			include("../navbar.php");
		?>
	</body>
</html>

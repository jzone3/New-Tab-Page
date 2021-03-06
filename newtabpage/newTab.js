var shown = false;

$('.noEnterSubmit').keypress(function(e){
	if ( e.which == 13 ) {
		$.ajax({
			type:'GET',
			url:'https://api.duckduckgo.com/',
			dataType: 'jsonp',
			crossDomain: true,
			data: {
				q: $('#search')[0].value,
				format: 'json',
				no_redirect: 1
			},
			success: function(response) {
				if (!shown) {
					var returnVal = formatResponse(response);
					$('#results').show();
					$('#results').animate({
						height: "360px",
						padding: "20px 20px",
					}, 'slow');
					if (returnVal) {
						$(':animated').promise().done(function() {
							$('#actualResults').append('<br/><br/><br/><a href="http://duckduckgo.com" style="color: black; position: absolute; top: 612px;">Results retrieved from Duck Duck Go</div></a>');
						});
					}
					shown = true;
				}
				else {
					$('#actualResults').fadeOut('fast');
					$(':animated').promise().done(function() {
						formatResponse(response);
						$('#actualResults').fadeIn('slow');
					});
				}
			}
		});

		return false
	}
});

function formatResponse(response) {
	if (response.Type == "E" && response.Redirect != "") {
		// !bang search
		window.location = response.Redirect;
		$.delay(4000);
	}
	else if (response.Image != "") {
		// Definition with an image result
		$('#actualResults').html('<a href="' + response.AbstractURL + '" style="text-decoration: none; color: black;"><img src="' + response.Image + '" style="float: left; padding-right: 20px; padding-top: 0;"><h1>' + response.Heading + '</h1><br/>' + response.Abstract + '</a><br/>');
	}
	else if (response.Abstract != "") {
		// Definition with no image result
		$('#actualResults').html('<a href="' + response.AbstractURL + '" style="text-decoration: none; color: black;"><h1>' + response.Heading + '</h1><br/>' + response.Abstract + '</a><br/>');
	}
	else if (response.Answer != "") {
		// example result: 4 * 2 = 8
		$('#actualResults').html('<h1 id="responseAnswer">' + response.Answer + '</h1>');
	}
	else if (response.RelatedTopics.length != 0) {
		// disambiguation
		$('#actualResults').html("");
		for (var i in response.RelatedTopics) {
			if (String(response.RelatedTopics[i].Text) != "undefined") {
				// top results (not under categories)
				if (i != response.RelatedTopics.length - 1) {
					$('#actualResults').append('<a href="' + response.RelatedTopics[i].FirstURL + '" style="text-decoration: none; color: black;"><img src="' + response.RelatedTopics[i].Icon.URL + '" style="padding-right: 10px; float: left;">' + response.RelatedTopics[i].Text + '</a><br style="clear: both;"/><hr>');
				}
				else {
					$('#actualResults').append('<a href="' + response.RelatedTopics[i].FirstURL + '" style="text-decoration: none; color: black;"><img src="' + response.RelatedTopics[i].Icon.URL + '" style="padding-right: 10px; float: left;">' + response.RelatedTopics[i].Text + '</a><br style="clear: both;"/>');
				}
			} else {
				// categories
				if (i != response.RelatedTopics.length - 1) {
					$('#actualResults').append('<a href="#" style="text-decoration: none; color: black;" onClick="$(' + "'#subcategory" + i + "'" + ').toggle(' + "'slow'" + ');">' + response.RelatedTopics[i].Name + ' (' + response.RelatedTopics[i].Topics.length + ')</a><br/>');
				}
				else {
					$('#actualResults').append('<a href="#" style="text-decoration: none; color: black;" onClick="$(' + "'#subcategory" + i + "'" + ').toggle(' + "'slow'" + ');">' + response.RelatedTopics[i].Name + ' (' + response.RelatedTopics[i].Topics.length + ')</a>');
				}

				// items under the category topic
				var subcategories = "";
				for (var j in response.RelatedTopics[i].Topics) {
					subcategories = subcategories + '<a href="' + response.RelatedTopics[i].Topics[j].FirstURL + '" style="text-decoration: none; color: black;"><img src="' + response.RelatedTopics[i].Topics[j].Icon.URL + '" style="padding-right: 20px; float: left;">' + response.RelatedTopics[i].Topics[j].Text + '</a><br style="clear: both;"/>';
					if (j != response.RelatedTopics[i].Topics.length - 1) {
						subcategories = subcategories + '<hr>';
					}
				}
				$('#actualResults').append('<div id="subcategory' + i + '" style="display: none; padding-left: 10px;"><br/>' + subcategories + '</div><hr>');
			}
		}
		$('#actualResults').append('<br/><br/><br/><a href="http://duckduckgo.com" style="color: black;">Results retrieved from Duck Duck Go</div></a>');
		return false;
	}
	else if (response.Results.length != 0) {
		// example query: lorem ipsum
		$('#actualResults').html(response.Results[0].Result);
	}
	else {
		// no results
		$('#actualResults').html('<h1>No results found!</h1>');
		window.location = 'http://duckduckgo.com/?q=' + $('#search')[0].value;
		// window.location = response.Redirect('http://google.com/?q=' + $('#search')[0].value);
	}
	
	if (shown) {
		$('#actualResults').append('<br/><br/><br/><a href="http://duckduckgo.com" style="color: black; position: absolute; top: 612px;">Results retrieved from Duck Duck Go</div></a>');
	}
	return true;
}
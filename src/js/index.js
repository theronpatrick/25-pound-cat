$(document).ready(function() {

	function init() {
		initCta();
	}

	// Load some pokemon into CTA
	function initCta() {
		var ctaSection = $("[data-section-type='cta']");
		var ctaButton = ctaSection.find("a");

		var firstClick = true;

		ctaButton.keydown(function(event) {
			if (event.keyCode == 13) {
				ctaButton.trigger('click');
			}
		});

		ctaButton.click(function() {

			// Gotta catch em all!
			var ctaParagraph = ctaSection.find("p");
			var button = $(this);

			button.text("Catching...");

			if (firstClick) {
				ctaParagraph.text("");
				firstClick = false;
			}

			var counter = 0;

			function catchEmAll() {
				pokeRap()
				.then(function(response) {
					counter ++;
					if (counter == 10) {
						button.text("Catch more!");
						return;
					} else {
						// Add poke-text, and add image next to it
						var pokeName = capitalizeFirstLetter(response.name);
						var pokeID = response.id;
						var url = "http://veekun.com/dex/media/pokemon/dream-world/" + pokeID + ".svg";

						var pokeLink = $("<a class='poke-image' target='_blank' href=" + url + ">" + pokeName + "</a>");
						ctaParagraph.append(pokeLink);
						ctaParagraph.append(" ");

						catchEmAll();
					}
				});
			}

			catchEmAll();

		});
	}

	function pokeRap() {
		var baseUrl = "http://pokeapi.co/api/v2/pokemon/";

		var random = Math.floor(Math.random() * (150 - 1) + 1);
		var promise = $.get(baseUrl + random + "/");

		return promise;

	}

	// Helper functions
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	init();
});



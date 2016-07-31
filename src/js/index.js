$(document).ready(function() {

	var ctaSection = $("[data-section-type='cta']");
	ctaSection.find("a").click(function() {

		// Gotta catch em all!
		var ctaParagraph = ctaSection.find("p");
		var button = $(this);

		ctaParagraph.text("");
		button.text("Catching...")

		var counter = 0;

		function catchEmAll() {
			pokeRap()
			.then(function(response) {
				counter ++;
				if (counter == 20) {
					button.text("Tell Me More")
					return;
				} else {
					ctaParagraph.text(ctaParagraph.text() + " " + response.name)
					catchEmAll();
				}
			})
		}

		catchEmAll();

	})

	function pokeRap() {
		var baseUrl = "http://pokeapi.co/api/v2/pokemon/";

		var random = Math.floor(Math.random() * (150 - 1) + 1);
		var promise = $.get(baseUrl + random + "/");

		return promise;

	}
})



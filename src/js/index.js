$(document).ready(function() {
	console.log("lel");

	var ctaSection = $("[data-section-type='cta']");
	ctaSection.find("a").click(function() {

		// TODO: Find a good API for getting text
		ctaSection.find("p").text("cool text");

	})
})

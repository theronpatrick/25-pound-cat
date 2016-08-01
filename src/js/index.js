$(document).ready(function() {

	function init() {
		initCta();
		initFilters();
	}

	// Load some pokemon into CTA
	function initCta() {
		var ctaSection = $("#cta");
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

	// Filter functions
	function initFilters() {
		// Load movie data and filter out genres
		loadData()
		.then(function(response) {
			var genres = getGenres(response);
			buildGenreFilter(genres);


			attachFilterHandlers();
			attachGlobalHandlers();
		})
	}

	function loadData() {
		return $.get("js/data/data.json");
	}

	function getGenres(data) {
		var genres = {};
		// Loop over each data item and add to hash
		$.each(data.media, function(key, value) {
			$.each(value.genre, function(key, value) {
				genres[value] = true;
			})
		})

		// Turn genre into array and sort
		var genreArray = [];
		$.each(genres, function(key, value) {
			genreArray.push(key)
		})

		genreArray.sort();

		return genreArray;

	}

	function buildGenreFilter(genres) {
		// Not wild about building DOM elements in JS like this.  
		// In a real project would probably use separate partial templates.
		var genreDropdown = $("<div class='dropdown-menu' aria-hidden='true' data-dropdown-type='genre'><ul></ul></div>");
		$.each(genres, function(key, value) {
			genreDropdown.find("ul").append($("<li role='button' aria-pressed='false' class='dropdown-button'>" + capitalizeFirstLetter(value) + "</li>"));
		})

		$("[data-filter-type='genre']").after(genreDropdown);
	}

	function attachFilterHandlers() {
		$("[data-filter-type='genre']").click(function() {
			toggleDropdown($("[data-dropdown-type='genre']"));
		})

		$("[data-dropdown-type='genre']").find("li").click(function() {
			toggleFilter($(this));
			filterGenres();
		})
	}

	function attachGlobalHandlers() {
		$("body").click(function(e) {
			var target = $(e.target);
			if (!target.hasClass("dropdown-button") && !target.hasClass("filter dropdown")) {
				hideDropdowns();
			}
		})
	}

	function toggleDropdown(target) {
		if (target.attr("aria-hidden") === "true") {
			target.attr("aria-hidden", "false");
		} else {
			target.attr("aria-hidden", "true");
		}
	}

	function hideDropdowns() {
		$(".dropdown-menu").attr("aria-hidden" , "true");
	}

	function toggleFilter(target) {
		if (target.attr("aria-pressed") === "true") {
			target.attr("aria-pressed", "false");
		} else {
			target.attr("aria-pressed", "true");
		}
	}
	
	function filterGenres() {
		// Get all current filters, then hide all movie blocks, and turn back ones that have selected genres
		var currentFilters = $("[data-dropdown-type='genre']").find("li[aria-pressed='true']");

		// If no filters are selected, clear filters and return
		if (currentFilters.length < 1) {
			clearFilters();
			return;
		}

		$(".movie-block").attr("aria-hidden", "true");

		$.each(currentFilters, function(key, value) {
			var selector = ".movie-genres:contains('" + $(value).text() + "')";
			$(selector).parent().attr("aria-hidden", false);
		})

	}

	function clearFilters() {
		$(".movie-block").attr("aria-hidden", "false");
	}

	// Helper functions
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	init();
});



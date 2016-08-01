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

		// Allow button press by focusing and hitting enter
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
				})
				.fail(function() {
					alert("Looks like Team Rocket took down the pokemon API :(");
					button.text("Catch more!");
				})
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
			var filteredData = filterData(response);
			buildFilters(filteredData);

			attachFilterHandlers();
			attachGlobalHandlers();
		})
	}

	function loadData() {
		return $.get("js/data/data.json");
	}

	// Takes in JSON data from local file
	// Returns two arrays, one with genres, one with years
	function filterData(data) {
		var genres = {};
		var years = {};
		// Loop over each data item and add to hash
		$.each(data.media, function(key, value) {
			$.each(value.genre, function(key, value) {
				genres[value] = true;
			})
			years[value.year] = true;
		})

		// Turn genre into array and sort
		var genreArray = [];
		$.each(genres, function(key, value) {
			genreArray.push(key)
		})
		genreArray.sort();

		var yearArray = [];
		$.each(years, function(key, value) {
			yearArray.push(key)
		})

		return {
			genres: genreArray,
			years: yearArray
		};

	}

	function buildFilters(data) {
		// Not wild about building DOM elements in JS like this.  
		// In a real project would probably use separate partial templates.
		var genreDropdown = $("<div class='dropdown-menu' aria-hidden='true' data-dropdown-type='genre'><ul></ul></div>");
		$.each(data.genres, function(key, value) {
			genreDropdown.find("ul").append($("<li role='button' aria-pressed='false' class='dropdown-button'>" + capitalizeFirstLetter(value) + "</li>"));
		})
		$("[data-filter-type='genre']").after(genreDropdown);

		var yearDropdown = $("<div class='dropdown-menu' aria-hidden='true' data-dropdown-type='year'><ul></ul></div>");
		$.each(data.years, function(key, value) {
			yearDropdown.find("ul").append($("<li role='button' aria-pressed='false' class='dropdown-button'>" + capitalizeFirstLetter(value) + "</li>"));
		})
		$("[data-filter-type='year']").after(yearDropdown);
	}



	function attachFilterHandlers() {
		$("[data-filter-type='genre']").click(function() {
			toggleDropdown($("[data-dropdown-type='genre']"));
		})

		$("[data-filter-type='year']").click(function() {
			toggleDropdown($("[data-dropdown-type='year']"));
		})

		$("[data-dropdown-type='genre']").find("li").click(function() {
			toggleFilter($(this));
			applyFilters();
		})

		$("[data-dropdown-type='year']").find("li").click(function() {
			toggleFilter($(this));
			applyFilters();
		})

		$("[type='text']").keyup(function() {
			applyFilters();
		})

		$("[type='radio']").change(function() {
			applyFilters();
		})

		$(".clear-button").click(clearFilters);
	}

	function attachGlobalHandlers() {
		// Hide open menus if clicking outside a dropdown
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
	
	function applyFilters() {
		// Get all current filters, then loop over media blocks and hide/show them
		var currentGenreFilters = $("[data-dropdown-type='genre']").find("li[aria-pressed='true']");
		var currentGenreFilterArray = [];
		$.each(currentGenreFilters, function(key, value) {
			currentGenreFilterArray.push($(value).text());
		})

		var currentYearFilters = $("[data-dropdown-type='year']").find("li[aria-pressed='true']");
		var currentYearFilterArray = [];
		$.each(currentYearFilters, function(key, value) {
			currentYearFilterArray.push($(value).text());
		})

		var searchText = $("[type='text']").val();
		var mediaType = $("[name='poster-type']:checked").val();

		$.each($(".movie-block"), function(key, value) {
			toggleMediaBasedOnFilters($(this), currentGenreFilterArray, currentYearFilterArray, searchText, mediaType);
		})

	}

	function toggleMediaBasedOnFilters(block, genres, years, searchText, mediaType) {
		// For each check, if a param is not sent in (or is empty) that means nothing is checked,
		// which is the default case and should be treated as if everything is checked
		var genreCheck = false;
		if (genres.length < 1) {
			genreCheck = true;
		} else {
			$.each(genres, function(key, value) {
				if (block.find(".movie-genres").text().indexOf(value) > -1) {
					genreCheck = true;
				}
			})
		}

		var yearCheck = false;
		if (years.length < 1) {
			yearCheck = true;
		} else {
			$.each(years, function(key, value) {
				if (block.find(".movie-year").text().indexOf(value) > -1) {
					yearCheck = true;
				}
			})
		}

		var searchCheck = false;
		if (searchText.length < 1) {
			searchCheck = true;
		} else {
			if (block.text().toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
				searchCheck = true;
			}
		}

		var typeCheck = false;
		if (!mediaType) {
			typeCheck = true;
		} else {
			if (block.attr("data-media-type") === mediaType) {
				typeCheck = true;
			}
		}

		if (genreCheck && yearCheck && searchCheck && typeCheck) {
			block.attr("aria-hidden", "false");
		} else {
			block.attr("aria-hidden", "true");
		}

	}

	function clearFilters() {
		$(".movie-block").attr("aria-hidden", "false");
		$(".dropdown-button").attr("aria-pressed" , "false");
		$("[type='text']").val("");
		$("[type='radio']").prop('checked', false);
	}

	// Helper functions
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	init();
});



/* jquery is loaded before we get to this point */
/* site wide globals */
var loaded = 0;
var css_supplementary = "";
var stateObj = {};

function cinema_load(path_to_html) {
	$(".cinemaContent").html("The requested app is loading...");
	$(".cinemaContent").load(path_to_html);

	if (loaded === 0) {
		loaded = 1;
	}

	$(".cinemaContainer").show();
}

function set_title(string_variable){
  $(".cinemaContainer .title").html(string_variable);
}

function cinema_destroy_app() {
}

function cinema_hide() {
	$(".cinemaContainer").hide();
}
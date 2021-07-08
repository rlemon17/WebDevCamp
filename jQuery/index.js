$("h1").css("font-weight", "bold"); //Same thing as document.querySelector("h1").style.color = "red";
// ^^^ But remember we want to keep css separate, so instead we should do something like adding a new class to css and doing
$("h1").addClass("big-title");
$("h1").hasClass("margin-50");
$("h1").text("testing");

$("button"); //Same thing as document.querySelectorAll("button");
$("button").eq(0); //document.querySelectorAll("button")[0], can't index

$("button.slide").text("Slider");

$("a").attr("href", "https://www.youtube.com");

$("button").click(() => $("h1").css("color", "red"));

$("input").keypress((e) => $("h1").text(e.key));

$("button.color").on("mouseover", () => $("h1").css("color", "purple"));
$("h1").on("click", () => $("h1").css("color", "aqua"));
$("button.slide").on("click", () => $("h1.title").slideToggle(1000, () => $("input").attr("type", "password")));
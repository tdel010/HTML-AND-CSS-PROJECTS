// Initialize movie poster popovers.
// Any element with data-bs-toggle="popover" will get a custom popover.

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')

popoverTriggerList.forEach(function (element) {
    // Read the stars image path stored on each element in data-bs-img.
    var imgSrc = element.getAttribute('data-bs-img');
    // Build HTML content for the popover body.
    var content = "<img class='star-rating' src='" + imgSrc + "' >";
    // Create a Bootstrap popover instance for each trigger element.
    new bootstrap.Popover(element, {
        content: content,
        html: true,
        trigger: 'hover'
    });
});

// Initialize toast components found on the page.
// This creates Bootstrap toast instances for any .toast element.

var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl)
})

// Build and show a confirmation toast using the selected ticket options.

function displaySelectedMovieOptions() {
    // Get the display text (not just value) from each select input.
    var movie = document.getElementById('movieSelect').options[document.getElementById('movieSelect').selectedIndex].text;
    var time = document.getElementById('timeSelect').options[document.getElementById('timeSelect').selectedIndex].text;
    // Read the quantity from the number input.
    var quantity = document.getElementById('quantity').value;

    // Create the message shown in the toast body.
    var message = "Purchase confirmed for: " + movie + "\nTime: " + time + "\nTickets: " + quantity;

    // Inject the message and then display the toast.
    var toastBody = document.getElementById('toastBody');
    toastBody.textContent = message;
    var toast = new bootstrap.Toast(document.getElementById('toastDisplay'));
    toast.show();
}

function buyTickets() {
    displaySelectedMovieOptions();
}

//JQUERY

//Shrinks header size when user scrolls down the page by 50 pixels
$(document).on("scroll", function () {
    //When the webpage is scrolled down more than 50 pixels, this if statement will trigger
    if ($(document).scrollTop() > 50) {
        //Once the 50px requirement has been met add the nav-shrink class selector to the same HTML element as the nav selector. 
        $("nav").addClass("nav-shrink");
        //Adjust the position of the mobile drop menu to accommodate the smaller header size. 
        $("div.navbar-collapse").css("margin-top", "-6px");
    } else {
        //if the webpage has not been scrolled down or is back at the top of the nav-shrink class selector is removed from the HTML element with the nav class selector.
        $("nav").removeClass("nav-shrink");
        //The margin for the dropdown menu is reset to its original position 
        $("div.navbar-collapse").css("margin-top", "14px");
    }
});

//Close mobile menu when a navigation link is clicked
$(document).ready(function () {
    //On click when an element contains just the nav-link class and not the dropdown-toggle and then also close when an element with the class .dropdown-item (each movie link) is clicked
    $(".navbar-nav").on('click', '.nav-link:not(.dropdown-toggle), .dropdown-item', function() {
        //Collapse the navbar when a link or dropdown item is clicked
        $(".navbar-collapse").collapse('hide');
    });
});

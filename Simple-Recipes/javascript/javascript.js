//RECIPE POP UP MODAL SECTION

// Sets up the button that will open the recipe modal
var btns = document.querySelectorAll("input.modal-button");

//Defines all modals for each recipe
var modals = document.querySelectorAll(".recipe-modal");

//Get the span element that closes the modal
var spans = document.getElementsByClassName("close-btn");

//Stores one timer per modal so reopening resets the countdown
var modalCloseTimers = {};

function closeModal(modal) {
    if (!modal) {
        return;
    }

    modal.style.display = "none";

    if (modal.id && modalCloseTimers[modal.id]) {
        clearTimeout(modalCloseTimers[modal.id]);
        delete modalCloseTimers[modal.id];
    }
}

function startModalCloseTimer(modal) {
    if (!modal || !modal.id) {
        return;
    }

    if (modalCloseTimers[modal.id]) {
        clearTimeout(modalCloseTimers[modal.id]);
    }

    modalCloseTimers[modal.id] = setTimeout(function () {
        closeModal(modal);
    }, 10000);
}

//When the user clicks the recipe button, open the modal
for (var i = 0; i < btns.length; i++) {
    btns[i].onclick = function (event) {
        var modal = document.querySelector(event.target.getAttribute("href"));
        modal.style.display = "block";
        startModalCloseTimer(modal);
    };
}

for (var j = 0; j < spans.length; j++) {
    spans[j].onclick = function () {
        closeModal(this.closest(".recipe-modal"));
    };
}

//Email validation for contact form
document.getElementById("contactForm").addEventListener("submit", function (event) {
    
    //Prevents the form from submitting and refreshing the page

    event.preventDefault();

    //Variables to validate the each field is filled out
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    //Email pattern checks for all symbols and characters that are required for a valid email address
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    //Use this variable to display messages if fields are filled out  or thank you message
    const valMsg = document.getElementById("validatMsg");

    if (!firstName || !lastName || !email || !phone || !message) {
        //Checks if all fields are filled out
        valMsg.innerHTML = '<p style="color: red;">Please fill out all empty fields.</p>';
    } else if (!emailPattern.test(email)) {
        //Checks if email is valid
        valMsg.innerHTML = '<p style="color: red;">Please enter a valid email address.</p>';
    } else {
        //If all fields are filled out and email is valid, display thank you message
        valMsg.innerHTML = '<p style="color: red;">Thank you for contacting us, ' + firstName + '!</p>';
    }

    const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        message: message,
        subscribe: document.getElementById("subscription").checked
    };
    //Displays what the user has entered in the console
    console.log("Submitted form data:", formData);
}
);
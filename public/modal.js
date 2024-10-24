function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}


const formContact = document.querySelector("#section-contact form");

if(formContact)
{
  formContact.addEventListener("submit", async (e) => {

    e.preventDefault();
    const formData = new FormData(formContact);

    const response = await fetch("/contact", {
      method: "POST",
      body: formData,
    });
    console.log(await response.json());

  })
}



function editNav() {
	var x = document.getElementById('myTopnav');
	if (x.className === 'topnav') {
		x.className += ' responsive';
	} else {
		x.className = 'topnav';
	}
}
// DOM Elements
const modalbg = document.querySelector('.bground');
const modalBtn = document.querySelectorAll('.modal-btn');
const formData = document.querySelectorAll('.formData');
const formRegister = document.querySelector(".modal-body form")

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener('click', launchModal));

// launch modal form
function launchModal() {
	modalbg.style.display = 'block';
}

const formContact = document.querySelector('#section-contact form');

if (formContact) {
	formContact.addEventListener('submit', async (e) => {
		e.preventDefault();
		const formData = new FormData(formContact);

		let data = JSON.stringify(Object.fromEntries(formData));
		
		const response = await fetch('/contact', {
			method: 'POST',
			body: data,
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(resp => resp.json());
        treatResponse(response);
	});
}

if (formRegister) {
  formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formDataInscription = new FormData(formRegister);
      formDataInscription.set(
          'newsletter',
          formDataInscription.get('newsletter') ? true : false
      );
      formDataInscription.set(
        'consent',
        formDataInscription.get('consent') ? true : false
    );

      let data = JSON.stringify(Object.fromEntries(formDataInscription));
      const response = await fetch('/', {
          method: 'POST',
          body: data,
          headers: {
              'Content-Type': 'application/json',
          },
      }).then(resp => resp.json());
      treatResponse(response);
  });
}


function treatResponse(jsonResponse){ 

    if(jsonResponse.errors)
    {

        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach( element => {

            element.textContent ="";
        });

        jsonResponse.errors.forEach( item => {
            if(item)
            {
                const selector = `.error-${item.path}`;
                const errorElement = document.querySelector(selector);
                errorElement.textContent = item.msg;

        }});
    }
   }


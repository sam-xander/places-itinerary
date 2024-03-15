var itineraryObj = {
  city: "",
  days: 5,
  budget: 50,
  itineraryText: "",
  imgOneUrl: "",
  imgTwoUrl: "",
  imgThreeUrl: "",
  imgFourUrl: "",
};

var itineraryPlan = document.querySelector("#itinerary-plan");
var itineraryCityHeader = document.querySelector("#itinerary-city");

/* *************************************************************************** */
//GET THE INPUTS: BUDGET & DAYS
/* *************************************************************************** */
var sliderBudget = document.getElementById("budgetSlider");
var outputBudget = document.getElementById("budget");
var sliderDays = document.getElementById("daysSlider");
var outputDays = document.getElementById("days");

outputBudget.innerHTML = sliderBudget.value;
sliderBudget.oninput = function () {
  outputBudget.innerHTML = this.value;
  itineraryObj.budget = this.value;
};

outputDays.innerHTML = sliderDays.value;
sliderDays.oninput = function (e) {
  outputDays.innerHTML = e.target.value;
  itineraryObj.days = e.target.value;
};

/* *************************************************************************** */
// GET ITINERARIES DATA FROM LOCAL-STORAGE
/* *************************************************************************** */
var itinerariesData = JSON.parse(localStorage.getItem("itinerariesData"));

if (!itinerariesData) {
  itinerariesData = [];
}

createSavedPlaceButton();

/* *************************************************************************** */
// UPDATE ITINERARIES DATA ON LOCAL-STORAGE
/* *************************************************************************** */
function updateLocalStorage() {
  if (itinerariesData.length >= 5) {
    itinerariesData.pop();
  }

  itinerariesData.unshift({ ...itineraryObj });

  localStorage.setItem("itinerariesData", JSON.stringify(itinerariesData));
}

/* *************************************************************************** */
// CREATE SAVED-PLACE-BUTTON
/* *************************************************************************** */
function createSavedPlaceButton() {
  var savedInputContainer = document.querySelector("#saved-inputs");
  savedInputContainer.innerHTML = "";
  for (var saved of itinerariesData) {
    savedInputContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="saved-place-button" id=${saved.id}>${saved.days} days in ${saved.city} on £${saved.budget}</button>`
    );
  }
}

/* *************************************************************************** */
// UPDATE ITINERARY OBJECT
/* *************************************************************************** */
function updateItineraryObj() {
  itineraryObj.city = autoCity;
  itineraryObj.imgOneUrl = `url('${photosArr[0].getUrl()}')`;
  itineraryObj.imgTwoUrl = `url('${photosArr[1].getUrl()}')`;
  itineraryObj.imgThreeUrl = `url('${photosArr[2].getUrl()}')`;
  itineraryObj.imgFourUrl = photosArr[3].getUrl();
  // console.log(itineraryObj);
}

// /* *************************************************************************** */
// // GET DATA FROM OPEN-AI
// /* *************************************************************************** */
// function getDataFromOpenAI() {
//   var API_KEY = "API-KEY";
//   var API_URL =
//     "https://api.openai.com/v1/engines/text-davinci-002/completions";
//   var prompt = `Give me a short ${itineraryObj.days} days itinerary for to visit ${itineraryObj.city} with £${itineraryObj.budget}. Don't include the departure as last day and have each day separate.`;
//   var options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${API_KEY}`,
//     },
//     body: JSON.stringify({
//       prompt: prompt,
//       temperature: 0.5,
//       max_tokens: 4000,
//     }),
//   };

//   fetch(API_URL, options)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       var planText = data.choices[0].text.replaceAll("Day", "<br><br>Day");
//       itineraryObj.itineraryText = `<p>${planText}</p>`;
//     })
//     .then(function () {
//       updateItineraryTextUI();
//       updateLocalStorage();
//       createSavedPlaceButton();
//     })
//     .catch(function (error) {
//       console.error(error);
//     });
// }

/* *************************************************************************** */
// GET DATA FROM OPEN-AI
/* *************************************************************************** */
function getDataFromOpenAI() {
  const prompt = `Give me a ${itineraryObj.days} days itinerary for to visit ${itineraryObj.city} with £${itineraryObj.budget}. Don't include the departure as last day and have each day separate.`;

  // Construct the OpenAI API Endpoint
  const API_URL =
    "https://api.openai.com/v1/engines/text-davinci-002/completions";

  // Show a loading state in the UI
  document.getElementById("itinerary-plan").innerHTML =
    "Generating itinerary...";

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Access the key from Netlify
    },
    body: JSON.stringify({
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 4000,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        // Check for HTTP errors
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return response.json();
    })
    .then((res) => {
      formatApiResponse(res);
      updateItineraryTextUI();
      updateLocalStorage();
      createSavedPlaceButton();
    })
    .catch((error) => {
      console.error(error);
      // Update the UI to display an error message
      document.getElementById("itinerary-plan").innerHTML =
        "Cannot generate itinerary. Please try again.";
    });
}

/* *************************************************************************** */
// FORMAT API RESPONSE
/* *************************************************************************** */

function formatApiResponse(res) {
  var planText = res.data.choices[0].text;

  planText = planText.replaceAll("Day", "<br><br>Day");

  for (let n = 1; n <= itineraryObj.days; n++) {
    planText = planText.replaceAll(`${n}.`, `<br><br>${n}.`);

    console.log(`${n}.`);
  }

  itineraryObj.itineraryText = `<p>${planText}</p>`;
}

/* *************************************************************************** */
// DISPLAY AND UPDATE UI
/* *************************************************************************** */
var itineraryContainer = document.querySelector("#itinerary-container");
var formContainer = document.getElementById("inputContainer");

function displayItineraryUI() {
  itineraryContainer.classList.remove("hidden");
  formContainer.classList.add("hidden");
}

function displayInputsUI() {
  itineraryContainer.classList.add("hidden");
  formContainer.classList.remove("hidden");
}

function updateItineraryImagesUI() {
  var imageOne = document.querySelector("#img-one");
  imageOne.style.backgroundImage = itineraryObj.imgOneUrl;

  var imageTwo = document.querySelector("#img-two");
  imageTwo.style.backgroundImage = itineraryObj.imgTwoUrl;

  var imageThree = document.querySelector("#img-three");
  imageThree.style.backgroundImage = itineraryObj.imgThreeUrl;

  var imageFour = document.querySelector("#header-image");
  imageFour.src = itineraryObj.imgFourUrl;
}

function updateItineraryTextUI() {
  itineraryCityHeader.innerText = itineraryObj.city;

  document.querySelector("#wait").classList.add("hidden");

  itineraryPlan.innerHTML = `${itineraryObj.itineraryText}`;
}

/* *************************************************************************** */
// ON CREAT-ITINERARY-BUTTON CLICKED
/* *************************************************************************** */
var createItinerarBtn = document.querySelector("#submitBtn");
createItinerarBtn.addEventListener("click", function (e) {
  e.preventDefault();
  // Check if there is a city
  if (!autoCity) {
    // display error message
    document.querySelector(".error").classList.remove("hidden");
  } else {
    itineraryPlan.innerHTML = "";
    itineraryCityHeader.innerText = "";
    updateItineraryObj();
    displayItineraryUI();
    updateItineraryImagesUI();
    getDataFromOpenAI();

    document.querySelector(".place-input").value = "";
  }
});

/* *************************************************************************** */
// ON NEW-ITINERARY-BUTTON CLICKED
/* *************************************************************************** */
var newItineraryBtn = document.querySelector("#back");
newItineraryBtn.addEventListener("click", function (e) {
  e.preventDefault();
  displayInputsUI();
});

/* *************************************************************************** */
// ON SAVED-PLACE-BUTTON CLICKED
/* *************************************************************************** */
var savedInputs = document.querySelector("#saved-inputs");

savedInputs.addEventListener("click", function (e) {
  if (e.target.classList.contains("saved-place-button")) {
    let buttons = Array.from(e.target.parentNode.children);
    let clickedButtonIndex = buttons.indexOf(e.target);
    itineraryObj = itinerariesData[clickedButtonIndex];
    displayItineraryUI();
    updateItineraryImagesUI();
    updateItineraryTextUI();
  }
});

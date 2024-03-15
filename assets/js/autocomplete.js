var autocomplete;
var autoCity;
var photosArr;
var placeInput = document.querySelector(".autocomplete");
var placeName;

// Initialize the google maps autocomplete function and add a listener to it to detect when the place is changed.
function initAutocomplete() {
  const googleMapsScript = document.getElementById("google-maps-api-script");
  googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initAutocomplete`; // Include your Netlify API key
  document.body.appendChild(googleMapsScript); // Insert the script into your DOM

  // Rest of your autocomplete initialization code ...
  autocomplete = new google.maps.places.Autocomplete(
    document.querySelector(".autocomplete"),
    { types: ["(cities)"] }
  );
  autocomplete.addListener("place_changed", onPlaceChanged);
}

// This function is called when a new place is selected from the autocomplete list.
function onPlaceChanged() {
  var placeData = autocomplete.getPlace();

  //validate if a city is selected
  if (!placeData.geometry) {
    placeInput.placeholder = "Please enter and select a city";
  } else {
    // hide the error message
    document.querySelector(".error").classList.add("hidden");

    //assign the selected city to autoCity
    autoCity = document.querySelector(".autocomplete").value;
    //assign the array of photos to photosArr
    photosArr = placeData.photos;
    //assign the name of the place to placeName
    placeName = placeData.formatted_address;
  }
}

const searchBtn = document.getElementById("search-btn");
const roomsInput = document.getElementById("rooms-input");
const resultsContainer = document.getElementById("results-container");

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const locationInput = document.getElementById("location-input").value;

  const endpoint = "https://hotels4.p.rapidapi.com/locations/v2/search";

  fetch(`${endpoint}?query=${locationInput}&&locale=en_US&currency=USD`, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "98e9640870msh28ec614d96d186dp16d6b1jsn2d0bbed90dcb",
      "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // Handle the hotel results here
      const hotelData = data.suggestions[1].entities;
      console.log(hotelData);

      // Create a new <ul> element to hold the hotel data
      const hotelList = document.createElement("ul");

      // Loop through the hotel data and create a new <li> element for each hotel
      hotelData.forEach((element) => {
        const hotelItem = document.createElement("li");

        // Add the hotel data to the <li> element
        const hotelName = document.createElement("h2");
        hotelName.textContent = element.name;
        hotelItem.appendChild(hotelName);

        const hotelCaption = document.createElement("p");
        hotelCaption.textContent = element.caption.replace(/<[^>]+>/g, "");
        const cost = hotelData.geoId;
        hotelCaption.textContent += cost + " $";
        hotelItem.appendChild(hotelCaption);

        const image = document.createElement("img");
        image.src = "./hotel.jpg";
        image.classList.add("hotel-img");
        hotelItem.appendChild(image);

        // Add the "Book Now" button to the <li> element
        const bookNowBtn = document.createElement("button");
        bookNowBtn.textContent = "Book Now";
        bookNowBtn.addEventListener("click", () => {
          // Create the payment modal and its contents
          const paymentModal = document.createElement("div");
          paymentModal.id = "payment-modal";
          paymentModal.classList.add("modal");

          const paymentModalContent = document.createElement("div");
          paymentModalContent.classList.add("modal-content");

          const paymentModalClose = document.createElement("span");
          paymentModalClose.classList.add("close");
          paymentModalClose.textContent = "×";
          paymentModalClose.addEventListener("click", () => {
            paymentModal.style.display = "none";
          });

          const paymentModalHeader = document.createElement("h2");
          paymentModalHeader.textContent = "Payment Details";

          const paymentForm = document.createElement("form");
          paymentForm.id = "payment-form";

          const cardNumberLabel = document.createElement("label");
          cardNumberLabel.setAttribute("for", "card-number");
          cardNumberLabel.textContent = "Card Number:";
          const cardNumberInput = document.createElement("input");
          cardNumberInput.type = "text";
          cardNumberInput.id = "card-number";
          cardNumberInput.name = "card-number";

          const expiryDateLabel = document.createElement("label");
          expiryDateLabel.setAttribute("for", "expiry-date");
          expiryDateLabel.textContent = "Expiry Date:";
          const expiryDateInput = document.createElement("input");
          expiryDateInput.type = "text";
          expiryDateInput.id = "expiry-date";
          expiryDateInput.name = "expiry-date";

          const cvvLabel = document.createElement("label");
          cvvLabel.setAttribute("for", "cvv");
          cvvLabel.textContent = "CVV:";
          const cvvInput = document.createElement("input");
          cvvInput.type = "text";
          cvvInput.id = "cvv";
          cvvInput.name = "cvv";

          const payNowBtn = document.createElement("button");
          payNowBtn.type = "submit";
          payNowBtn.textContent = "Pay Now";

          payNowBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const cardNumber = cardNumberInput.value.trim();
            const expiryDate = expiryDateInput.value.trim();
            const cvv = cvvInput.value.trim();

            if (expiryDate.length != 5) {
              expiryDateInput.style.border = "1px solid red";
            }
            if (cardNumber.length != 16) {
              cardNumberInput.style.border = "1px solid red";
            }
            if (cvv.length != 3) {
              cvvInput.style.border = "1px solid red";
            } else {
              document.getElementById("payment-form").innerHTML =
                "<h2>Your payment is successful!</h2>";
            }
          });

          // Add the contents to the payment modal
          paymentForm.appendChild(cardNumberLabel);
          paymentForm.appendChild(cardNumberInput);
          paymentForm.appendChild(document.createElement("br"));
          paymentForm.appendChild(expiryDateLabel);
          paymentForm.appendChild(expiryDateInput);
          paymentForm.appendChild(document.createElement("br"));
          paymentForm.appendChild(cvvLabel);
          paymentForm.appendChild(cvvInput);
          paymentForm.appendChild(document.createElement("br"));
          paymentForm.appendChild(payNowBtn);

          paymentModalContent.appendChild(paymentModalClose);
          paymentModalContent.appendChild(paymentModalHeader);
          paymentModalContent.appendChild(paymentForm);

          paymentModal.appendChild(paymentModalContent);

          // Display the payment modal
          document.body.appendChild(paymentModal);
          paymentModal.style.display = "block";
        });

        hotelItem.appendChild(bookNowBtn);

        // Add the <li> element to the <ul> element
        hotelList.appendChild(hotelItem);
      });

      // Add the <ul> element to the results container
      resultsContainer.innerHTML = "";
      resultsContainer.appendChild(hotelList);
    })
    .catch((error) => {
      console.error("There was a problem with the hotel search:", error);
    });
});

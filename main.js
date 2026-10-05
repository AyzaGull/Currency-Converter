const BASE_URL = "https://open.er-api.com/v6/latest";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");



for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toUpperCase();
  const to = toCurr.value.toUpperCase();

  try {

    let response = await fetch(`${BASE_URL}/${from}`);
    let data = await response.json();

    if (data.result !== "success") {
      throw new Error("Failed to fetch exchange rates");
    }

    let rate = data.rates[to];
    if (!rate) {
      throw new Error(`Conversion rate not found for ${to}`);
    }

    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${from} = ${finalAmount.toFixed(2)} ${to}`;
  } catch (error) {
    msg.innerText = `Error fetching conversion rate: ${error.message}`;
    console.error(error);
  }
});

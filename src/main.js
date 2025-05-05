import "./style.css";
const countryApi = "https://restcountries.com/v3.1/all";
const listCountry = document.getElementById("list-country");
const searchCountry = document.getElementById("search-country");
const searchInput = document.getElementById("search-input");
const detailInformation = document.getElementById("detail-information");
const overallInformation = document.getElementById("overall-information");
const animationLoading = document.getElementById("animation-loading");
const apiWeatherKey = "6e6b93dbd04be660a25e18c92f760578";
let data = [];

async function fetchCountry() {
  try {
    handleLoading("show");
    const fetchData = await fetch(countryApi).finally(() => {
      setTimeout(() => {
        handleLoading("off");
      }, 1000);
    });
    if (!fetchData.ok) {
      throw new Error("something went wrong!");
    }
    const bodyData = await fetchData.json();
    data = bodyData;
    data.sort((a, b) => {
      const nameA = a.name.common.toUpperCase();
      const nameB = b.name.common.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    renderCountry(data);
  } catch (error) {
    console.log(error.message);
  }
}
fetchCountry();

async function fetchWeatherData(lat, lon) {
  const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiWeatherKey}`;
  try {
    handleLoading("show");
    const weatherData = await fetch(urlWeather).finally(() => {
      handleLoading("off");
    });
    if (!weatherData.ok) throw new Error("Something went wrong !");
    const weather = await weatherData.json();
    detailInformation.innerHTML = detailWeatherInformation(weather);
    overallInformation.innerHTML = overallWeatherInformation(weather);
    console.log(weather);
  } catch (error) {
    console.log(error.message);
  }
}
const renderCountry = (country) => {
  listCountry.innerHTML = "";
  if (country.length === 0) {
    listCountry.innerHTML =
      '<h1 class="my-9 px-5 uppercase font-light">This country not exist !</h1>';
  } else {
    country.forEach((el) => {
      const p = document.createElement("p");
      p.addEventListener("click", () => {
        fetchWeatherData(el.capitalInfo.latlng[0], el.capitalInfo.latlng[1]);
        searchInput.value = "";
        listCountry.classList.add("h-[0px]");
        listCountry.classList.remove("h-[100px]");
      });
      p.className = "cursor-pointer hover:bg-[#8195A7] px-10";
      p.innerText = el.name.common;
      listCountry.appendChild(p);
    });
  }
};

searchInput.addEventListener("input", (e) => {
  if (!e.target.value) {
    listCountry.classList.add("h-[0px]");
    listCountry.classList.remove("h-[100px]");
  } else {
    listCountry.classList.add("h-[100px]");
    listCountry.classList.remove("h-[0px]");
  }

  const tempData = data.filter((item) =>
    item.name.common.toLowerCase().includes(e.target.value)
  );
  renderCountry(tempData);
});

searchCountry.addEventListener("submit", (e) => {
  e.preventDefault();

  const tempData = data.find(
    (item) => item.name.common.toLowerCase() === searchInput.value
  );
  if (tempData !== undefined) {
    fetchWeatherData(
      tempData.capitalInfo.latlng[0],
      tempData.capitalInfo.latlng[1]
    );
    searchInput.value = "";
    listCountry.classList.add("h-[0px]");
    listCountry.classList.remove("h-[100px]");
  }
});
const detailWeatherInformation = (weatherCity) => {
  return `<div class="flex gap-6 flex-col pb-20 border-b border-white/50">
            <div class="detail flex justify-between font-light">
              <span class="text-[1.3rem] font-extralight uppercase"
                >${weatherCity.weather[0].description}</span
              >
            </div>
            <div class="detail flex justify-between font-light">
              <span>Temp max</span>
              <div class="flex gap-6">
                <span>${Math.floor(weatherCity.main.temp_max - 273.15)}°</span>
                <img src="/images/temp-worm.png" alt="temp worm" />
              </div>
            </div>
            <div class="detail flex justify-between font-light">
              <span>Temp min</span>
              <div class="flex gap-6">
                <span>${Math.floor(weatherCity.main.temp_min - 273.15)}°</span>
                <img src="/images/temp-cold.png" alt="temp cold" />
              </div>
            </div>
            <div class="detail flex justify-between font-light">
              <span>Humadity</span>
              <div class="flex gap-6">
                <span>${weatherCity.main.humidity}%</span>
                <img src="/images/watter.png" alt="water" />
              </div>
            </div>
            <div class="detail flex justify-between font-light">
              <span>Cloudy</span>
              <div class="flex gap-5">
                <span>${weatherCity.clouds.all}%</span>
                <img src="/images/cloud.png" alt="cloud" />
              </div>
            </div>
            <div class="detail flex justify-between font-light">
              <span>Wind</span>
              <div class="flex gap-4">
                <span>${Math.floor(weatherCity.wind.speed * 3.6)}km/h</span>
                <img src="/images/wind.png" alt="wind" />
              </div>
            </div>
          </div>`;
};

const overallWeatherInformation = (weatherCity) => {
  return `<div class="flex lg:gap-6 sm:gap-3 gap-3 flex-wrap  items-end max-h-50">
          <span class="lg:text-[143px]/32 sm:text-[120px]/32 text-[64px]/20"
            >${Math.floor(weatherCity.main.temp - 273.15)}°</span
          >
          <div class="flex ">
          <div class="flex flex-col  gap-2">
            <h2 id="city" class="lg:text-5xl sm:text-4xl text-3xl font-semibold">
              ${weatherCity.name}
            </h2>
            <i
              class="lg:text-1xl sm:text-[0.7rem] text-[0.9rem] max-sm:text-gray-50/80"
              >the capital of this  country is :</i
            >
            </div>
            
            <img
            src="/images/Cloudy.svg"
            class="lg:h-20 sm:h-10 h-8"
            alt="cloud icon"
            />
            </div>
        </div>`;
};

function handleLoading(operation) {
  if (operation === "show") {
    animationLoading.classList.remove("hidden");
    animationLoading.classList.add("flex");
    animationLoading.classList.add("show-loading");
    console.log("show");
  } else {
    console.log("off");
    // setTimeout(()=>{
    // },2000)
    animationLoading.classList.add("hidden");
    animationLoading.classList.remove("flex");
    animationLoading.classList.remove("show-loading");

    // animationLoading.classList.add("hidden");
  }
}

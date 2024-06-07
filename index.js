const userTab =document.querySelector("[data-userweather]");
const searchTab =document.querySelector("[data-searhweather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer =document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen =document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const error404 = document.querySelector(".error404-container");

let currentTab = userTab; //default
const API_KEY ="08989cbd17aade17688451f35fb67cea";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab)
        {
            currentTab.classList.remove("current-tab");
            currentTab = clickedTab;
            currentTab.classList.add("current-tab");

            if(!searchForm.classList.contains("active")){

                searchForm.classList.add("active");
                grantAccessContainer.classList.remove("active");
                userInfoContainer.classList.remove("active");
            }
            else{
                userInfoContainer.classList.add("active");
                searchForm.classList.remove("active");
                getfromSessionStorage();
            }
        }

}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

// check coordinates
function getfromSessionStorage(){
     const localCoordinates = sessionStorage.getItem("user-coordinates");
     if(!localCoordinates){
        // if local coordinates not present 
        grantAccessContainer.classList.add("active");
        userInfoContainer.classList.remove("active");
        error404.classList.remove("active");
     }
     else{
        const coordinates = JSON.parse(localCoordinates);  //converts text to javascript object
        fetchUserWeatherInfo(coordinates);
     }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // grant access invisible and show loading gif
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active"); 

    // api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data); 
    }
    catch(err){
        loadingScreen.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo){
    
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src =`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
 }

    

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation not supported by browser");
        console.log("geolocation not supported by browser");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates)); //to convert into string (JSON.stringify)
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    
    let cityName = searchInput.value;

    if(cityName === "") {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
    
});

async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    error404.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

            if(!response.ok){
                throw data;
            }        
            
            loadingScreen.classList.remove("active");
            error404.classList.remove("active");
            userInfoContainer.classList.add("active");
            
            renderWeatherInfo(data);

        }
        
    
    catch(err){
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active")
        error404.classList.add("active");        
    }
}
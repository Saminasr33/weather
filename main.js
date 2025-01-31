"use strict";
const API ='48262da0052b2f6faf67b12332ecb1e3';
const dayEL=document.querySelector(".default_day");
const dateEL=document.querySelector(".default_date");
const btnEL=document.querySelector(".btn_search");
const inputEL=document.querySelector(".input_filed");
const iconsContainer =document.querySelector('.icons');
const dayInfoEL =document.querySelector(".day_info");
const listContentEL =document.querySelector(".list_content ul");

const days =[
    "الاحد",
    "الاثنين",
    "الثلاثاء",
    "الاربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
];

// display the day

const day = new Date();
const dayName= days[day.getDay()];
dayEL.textContent=dayName;

// display the date

let month =day.toLocaleString("default",{month:"long"});
let date = day.getDate();
let year = day.getFullYear();

dateEL.textContent= date + "   " + month + "   " + year;

// add Event
btnEL.addEventListener("click",(e)=>{
    e.preventDefault();



    // check empty input value 

    if(inputEL.value !== ""){
        const Search =inputEL.value;
        inputEL.value="";
        findlocation(Search);



    }else{
        console.log("working");
    }
})

async function findlocation(name){
    iconsContainer.innerHTML="";
    dayInfoEL.innerHTML="";
    listContentEL.innerHTML="";

try{
    const API_URL= `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`
    const data =await fetch(API_URL);
    const result = await data.json();
    console.log(result);
    if(result.cod !=="404"){
        // display image content 
        const imageContent=displayImageContent(result);

        // display right side content 
         const rightSide =rightSideContent(result);

        // forecast function 
        displayForeCast(result.coord.lat,result.coord.lon);

        setTimeout(()=>{
            
        iconsContainer.insertAdjacentHTML("afterbegin",imageContent);
        iconsContainer.classList.add("fadeIn");
        dayInfoEL.insertAdjacentHTML("afterbegin",rightSide);
        },1500)

    }else{
        const message= `<img src="https://openweathermap.org/img/wn/10d@4x.png">
        <h2 class="weather_temp">${result.cod}°C</h2>
        <h3 class="cloudtxt">${result.message}</h3>`;
        iconsContainer.insertAdjacentHTML("afterbegin",message);
    }
}catch(error){};

}
// display image content and temp 
function displayImageContent(data){
    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png">
    <h2 class="weather_temp">${Math.round(data.main.temp - 273.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
};

// display the right side content 

function rightSideContent(result){
    return ` <div class="content">
                        <p class="title">Name</p>
                        <span class="value">${result.name}</span>
                    </div>
                    <div class="content">
                        <p class="title">Temp</p>
                        <span class="value">${Math.round(result.main.temp - 273.15)}°C</span>
                    </div>
                    <div class="content">
                        <p class="title">Humidity</p>
                        <span class="value">${result.main.humidity}%</span>
                    </div>
                    <div class="content">
                        <p class="title">Wind speed</p>
                        <span class="value">${result.wind.speed}km/h</span>
                    </div>`
};


async function displayForeCast(lat,long){
    const ForeCast_API= `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`
    const data = await fetch(ForeCast_API);
    const result= await data.json();

    // filter the forecast

    const uniqeForeCastDays =[];
    const daysForeCast = result.list.filter((forecast)=>{
        const forecastdate = new Date(forecast.dt_txt).getDate();
        if(!uniqeForeCastDays.includes(forecastdate)){
            return uniqeForeCastDays.push(forecastdate);
        }
    });
    console.log(daysForeCast);

    daysForeCast.forEach((content,index)=>{
        if(index<=3){
            listContentEL.insertAdjacentHTML("afterbegin",forecast(content))
        }
    })
};


// forecast html element data 

function forecast(frContent){
    const day =new Date(frContent.dt_txt);
    const dayName =days[day.getDay()];
    // const splitDay =dayName.split("",3); اذا كنت اريد اخذ 3حروف
    // const joinDay =splitDay.join(""); دمج الثلاث حروف
    return `<li>
                            <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png">
                            <span>${dayName}</span>
                            <span class="day_temp">${Math.round(frContent.main.temp - 273.15)}°C</span>
                        </li>`
}
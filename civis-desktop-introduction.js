
// ADAPTED FROM W3SCHOOLS - https://www.w3schools.com/howto/howto_js_draggable.asp

// Make the DIV element draggable:
function DragElement(element) {

  if (!element){
    console.error("element does not exist")
    return
  }

  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const draggable = document.getElementById(element.id + "Header") || element
  draggable.onmousedown = dragDown;
  draggable.ontouchstart = dragDown;


  function dragDown(e) {
    e.preventDefault();

    if (e.type === "touchmove"){
      pos3 = e.touches[0].clientX
      pos4 = e.touches[0].clientY
    }
    else{
    pos3 = e.clientX;
    pos4 = e.clientY;
    }

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDrag;
    
  }

  function elementDrag(e) {
   ToggleScroll(true)

    e.preventDefault();

    let clientX, clientY;
    // calculate the new cursor position:
    if (e.type === "touchmove"){
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    }
    else{
      clientX = e.clientX;
      clientY = e.clientY;
    }

    pos1 = pos3 - clientX;
    pos2 = pos4 - clientY;
    pos3 = clientX;
    pos4 = clientY;
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    ToggleScroll(false)
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchmove = null;
    document.ontouchend = null;

    //Check if the window is outside the viewport

    //Get boundary
    const boundary = element.getBoundingClientRect();

    //Is it pass the limits?
    if (boundary.top<0 || boundary.left<0 || boundary.bottom >= (window.innerHeight || document.documentElement.clientHeight) || boundary.right >= (window.innerWidth || document.documentElement.clientWidth)){
      if (element.id === "OverviewWindow"){
        UpdateDB("Tutorial","completed",1,"tutorial_id",3)
      }
      element.remove(); //DEATH TO THE WINDOW
    }
  }
}

//ADDS NEW FORM POPUP
function NewFormPopup() {
  WindowPopUp(`
  <div class="window" id="IntroForm" style="width: 350px">
      <div class="title-bar" id="IntroFormHeader">
          <div class="title-bar-text">Create City Form</div>
          <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" onclick="document.getElementById('IntroForm').remove()"></button>
          </div>
      </div>
      <div class="window-body" id="FormContent">
          <p style="color:black">Please write the name of your city:</p>
          <br>
          <div class="field-row" style="padding-left: 45px;">
              <label for="FormCityName"style="color:black">City Name</label>
              <input id="FormCityName" type="text" / style="color:black">
              <button onclick="NewFormPopupFinished()"style="color:black"> Confirm </button>
          </div>
          <p id ="FormWarning"></p>
      </div>
  </div>
  `,"IntroForm","StartBlocker");
}

//Let's add the new to the database
async function NewFormPopupFinished() {
  //Get the City Name
  const CityName = document.getElementById('FormCityName').value.trim();
  if (!CityName) {
      document.getElementById("FormWarning").textContent = "PLEASE INSERT A CITY NAME BEFORE STARTING";
      return;
  }
  if (CityName.length > 24){
      document.getElementById("FormWarning").textContent = "PLEASE INSERT A CITY NAME LESS THAN 24 CHARACTERS";
      return;
  }
  NewDB(CityName);
}


//ADDS LOAD FORM POPUP
function LoadFormPopup() {
  //Add the window
  WindowPopUp(`
  <div class="window" id="IntroForm" style="width: 350px">
      <div class="title-bar" id="IntroFormHeader">
          <div class="title-bar-text">Create City Form</div>
          <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" onclick="document.getElementById('IntroForm').remove()"></button>
          </div>
      </div>
      <div class="window-body" id="FormContent">
          <p style="color:black">Please upload your file</p>
          <br>
          <input id="FormLoadDB" type="file" accept=".sqlite" onchange="LoadDB()" style="display:none;color:black"></input>
          <label id="ForFormLoadDB" for="FormLoadDB" style="margin-left:110px;color:black;">Click here to upload save</label>
          <p id ="FormWarning"></p>
      </div>
  </div>
  `,"IntroForm","StartBlocker");
}

//Let's add the new to the database
function LoadFormPopupFinished() {
  //Get the City Name
  LoadDB();
}

async function StartUp(){
  const delay = ms => new Promise(res => setTimeout(res, ms));
  // Making sure that StartUp is only occouring when the StartBlocker is present
  if (!document.getElementById("StartBlocker")){
    console.warning("StartUp already begun!");
    return;
  }
  //Hide Startblocker
  document.getElementById("StartBlockerTransitionBlocker").style.animation = "FadeToBlack 1s forwards";
  //Remove Popup
  document.getElementById("IntroForm").remove();
  await delay(1000);
  //OS animation
  document.getElementById("OS").style.visibility = "visible";
  //Remove StartBlocker
  document.getElementById("StartBlocker").remove();
  await delay(500)
  await PrepareDesktop();
  //Hide OS animation
  document.getElementById("OS").style.animation = "Hide 1s ease-in forwards"
  await delay(1000)
  document.getElementById("OS").remove()
}

function PrepareDesktop(){
  if ((Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) > 770) && GetDBElements("Tutorial","completed","tutorial_id",3)[0] === 1){
    Overview()
  }
  if (GetDBElements("Tutorial","completed","tutorial_id",4) === 0){
    Tutorial()
  }
  //Taskbar
  document.getElementById("TaskbarDate").innerText = "Today's date is... " + GetGameDate()
  document.getElementById("TaskbarPopulation").innerText = "Population: " + FormattedNumber(GetDBElements("City_Attribute","attribute_value","city_attribute_id",2),"default")
  document.getElementById("TaskbarCurrentFunds").innerText = "Current funds: " + GetDBElements("City","money_symbol",null,null)[0] + FormattedNumber(GetDBElements("City_Attribute","attribute_value","city_attribute_id",3),"currency")
}
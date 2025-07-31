
// ADAPTED FROM W3SCHOOLS - https://www.w3schools.com/howto/howto_js_draggable.asp

// Make the DIV element draggable:
function DragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  if (!element){
    console.log("element does not exist")
    return
  }
  else if(!element.id){
    console.log("element "+ element +" does not have an id")
    element.onmousedown = dragMouseDown;
  }
  else if (!(document.getElementById(element.id + "Header"))){
    console.log("element "+ element + " does not have a Header id")
    element.onmousedown = dragMouseDown;
  }
  else{
    document.getElementById(element.id + "Header").onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;

    //Check if the window is outside the viewport

    //Get boundary
    let boundary = element.getBoundingClientRect();

    //Is it pass the limits?
    if(boundary.top<0 || boundary.left<0 || boundary.bottom >= (window.innerHeight || document.documentElement.clientHeight) || boundary.right >= (window.innerWidth || document.documentElement.clientWidth)){
      element.remove(); //DEATH TO THE WINDOW
    }
  }
}

//ADDS NEW FORM POPUP
function NewFormPopup() {
  //Is the form already there?
  if (document.getElementById('Form') != null) 
  {
    document.getElementById('Form').remove() //DEATH TO THE WINDOW 💀
  }
  WindowPopUp(`
  <div class="window" id="Form" style="width: 350px">
      <div class="title-bar" id="FormHeader">
          <div class="title-bar-text">Create City Form</div>
          <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button>
          </div>
      </div>
      <div class="window-body" id="FormContent">
          <p>Please write the name of your city:</p>
          <br>
          <div class="field-row" style="padding-left: 45px;">
              <label for="FormCityName">City Name</label>
              <input id="FormCityName" type="text" />
              <button onclick="NewFormPopupFinished()"> Confirm </button>
          </div>
          <p id ="FormWarning"></p>
      </div>
  </div>
  `,"Form","StartBlocker");
}

//Let's add the new to the database
async function NewFormPopupFinished() {
  //Get the City Name
  const CityName = document.getElementById('FormCityName').value.trim();
  console.log(CityName)
  if (!CityName) {
      document.getElementById("FormWarning").textContent = "PLEASE INSERT A CITY NAME BEFORE STARTING";
      return;
  }
  if (CityName.length > 24){
      document.getElementById("FormWarning").textContent = "PLEASE INSERT A CITY NAME LESS THAN 24 CHARACTERS";
      return;
  }
  await NewDB(CityName);
}


//ADDS LOAD FORM POPUP
function LoadFormPopup() {
  //Is the form already there?
  if (document.getElementById('Form') != null) 
  {
    document.getElementById('Form').remove() //DEATH TO THE WINDOW 💀
  }
  //Add the window
  WindowPopUp(`
  <div class="window" id="Form" style="width: 350px">
      <div class="title-bar" id="FormHeader">
          <div class="title-bar-text">Create City Form</div>
          <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button>
          </div>
      </div>
      <div class="window-body" id="FormContent">
          <p>Please upload your file</p>
          <br>
          <input id="FormLoadDB" type="file" accept=".sqlite" onchange="LoadDB()" style="display:none"></input>
          <label id="ForFormLoadDB" for="FormLoadDB" style="margin-left:110px">Click here to upload save</label>
          <p id ="FormWarning"></p>
      </div>
  </div>
  `,"Form","StartBlocker");
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
    console.error("StartUp already begun!");
    return;
  }
  //Hide Startblocker
  document.getElementById("StartBlockerTransitionBlocker").style.animation = "FadeToBlack 1s forwards";
  //Remove Popup
  document.getElementById("Form").remove();
  await delay(1000);
  //OS animation
  document.getElementById("OS").style.visibility = "visible";
  //Remove StartBlocker
  document.getElementById("StartBlocker").remove();
  await delay(500)
  await PrepareDesktop;
  //Hide OS animation
  document.getElementById("OS").style.animation = "OS_Hide 1s ease-in forwards"
}

async function PrepareDesktop(){
  if (Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) > 770){
    Overview()}
  const gameDate = await GetGameDate();
  document.getElementById("TaskbarDate").innerText = "Today's date is... " + gameDate;
  return;
}
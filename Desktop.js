function PolicyPurchase(){
    if (GetDBElements("Tutorial","completed","tutorial_id",5) == 1){
        UpdateDB("Tutorial","completed",1,"tutorial_id",6)
    }
    WindowPopUp(`
    <div class="window" id="Form" style="width: 350px">
        <div class="title-bar" id="FormHeader">
            <div class="title-bar-text"> Policy Purchase Terminal </div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button>
            </div>
        </div>
        <div class="window-body" id="FormContent">
            <div id="PolicyPurchaseFlex">
                <div class="field-row" style="float:left;height:100%">
                    <label for="PolicyPurchaseSlider">Slider</label>
                    <div class="is-vertical">
                        <input id="PolicyPurchaseSlider" class="has-box-indicator" type="range" min="1" max="3" step="1" value="3" oninput="PolicyPurchaseUpdate()" onchange="PolicyPurchaseUpdate()"/>
                    </div>
                </div>
                <div id="PolicyPurchaseInterface">
                </div>
            </div>
        </div>
    </div>
    `,"Form","Desktop")
    PolicyPurchaseUpdate()
}

function PolicyPurchaseUpdate(){
    let unlockedPolicyPacks = GetDBElements("Policy_Pack","policy_pack_id","policy_pack_unlocked",1);
    let policyPurchaseInterface =  document.getElementById("PolicyPurchaseInterface");
    let policyPurchasSlider = document.getElementById("PolicyPurchaseSlider");
    PolicyPurchaseInterface.innerHTML = "";

    if (unlockedPolicyPacks.length == 0){
        unlockedPolicyPacks = [2];
    }

    policyPurchasSlider.max = Math.ceil(unlockedPolicyPacks.length / 6);
    policyPurchasSlider.value = policyPurchasSlider.max


    const selectedPolicyPacks = unlockedPolicyPacks.slice((document.getElementById("PolicyPurchaseSlider").ariaValueNow * 6) - 6,6);
    let leftside = true;
    let iteration = 1;

    for (let policypack of selectedPolicyPacks){
        policyPurchaseInterface.innerHTML += leftside ? `<div> ` : ``;

        policyPurchaseInterface.innerHTML += `
        <div id="PP` + iteration +`" onclick="PolicyPurchaseConfirmation(` + policypack + `)">
            <img src='Assets/Policies/PP_`+policypack+`.png'>
            <h4>` + GetDBElements("Policy_Pack","policy_pack_name","policy_pack_id",policypack) + `</h4>
            <p>` + GetDBElements("Policy_Pack","policy_pack_description","policy_pack_id",policypack) +`</p>
        </div>`;

        document.getElementById("PP" + iteration).style.float = leftside ? "left" : "right"; //VERY PROUD OF THIS :D
        policyPurchaseInterface.innerHTML += !leftside ? `</div><br>` : ``;
        leftside = !leftside;
        iteration++;
    }
}
function PolicyPurchaseConfirmation(id){
    let policyContents = PoliciesInPolicyPack(id);
    let list = "";
    
    if (policyContents.length === 0){
        policyContents = [1];
    }

    for (policy of policyContents){
        list += `<li><details><summary>` + GetDBElements("Policy","policy_name","policy_id",id) +`</summary><ul><li>` + GetDBElements("Policy","policy_description","policy_id",id) + `<li></details></li>`
    }

    document.getElementById("Body").innerHTML += `
    <div id="PolicyPurchaseConfirmation">
        <div class="window" id="Confirmation" style="width: 350px">
            <div class="title-bar" id="ConfirmationHeader">
                <div class="title-bar-text"> Confirmation </div>
                <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onclick="document.getElementById('PolicyPurchaseConfirmation').remove()"></button>
                </div>
            </div>
            <div class="window-body" id="FormContent">
                <h3>` + GetDBElements("Policy_Pack","policy_pack_name","policy_pack_id",id) +`</h3>
                <p>` + GetDBElements("Policy_Pack","policy_pack_description","policy_pack_id",id)  + `
                <hr>
                <ul class="tree-view">` + list + `
                </ul>
                <br>
            </div>
        </div>
    </div> 
    `;
}

function Settings(){
    WindowPopUp(`
    <div class="window" id="Form" style="width: 350px">
        <div class="title-bar" id="FormHeader">
            <div class="title-bar-text"> Settings </div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button>
            </div>
        </div>
        <div class="window-body" id="FormContent">
            <p>Welcome to the settings</p>
            <br>
            <button onclick="Tutorial();if(!document.getElementById('TutorialWindow')){UpdateDB('Tutorial','completed',1,'tutorial_id',4)};getElementById('Form').remove()">Open Tutorial Window</button>
            <hr>
            <button onclick="ExportDB()">Export</button>
            <br>
        </div>
    </div>
    `, "Form","Desktop")
}

function Overview(){
    UpdateDB("Tutorial","completed",1,"tutorial_id",2)
    const cityName = GetDBElements("City","name",null,null) 
    WindowPopUp(`
    <div class="window" id="OverviewWindow" style="width: 350px">
        <div class="title-bar" id="OverviewWindowHeader">
            <div class="title-bar-text">`+ cityName +`</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('OverviewWindow').remove();UpdateDB('Tutorial','completed',1,'tutorial_id',3)"></button> <!-- That does not need to be an IF cause tutorial_id 2 is only true if this pops up --!>
            </div>
        </div>
        <div class="window-body" id="OverviewWindowContent">
            <p>The current data of ` + cityName + `:</p>
            <div class="field-row">
                <input id="OverviewWindowRadioPopulation" type="radio" name="OverviewWindow">
                <label for="OverviewWindowRadioPopulation">` + GetDBElements("City_Attribute","attribute_name","city_attribute_id",2) + `</label>
            </div>
            <div class="field-row">
                <input id="OverviewWindowRadioRevenue" type="radio" name="OverviewWindow">
                <label for="OverviewWindowRadioRevenue">Revenue</label>
            </div>
            <div class="field-row">
                <input disabled id="OverviewWindowRadioPolicyCount" type="radio" name="OverviewWindow">
                <label for="OverviewWindowRadioPolicyCount">Amount of policies collected</label>
            </div>
            <br>
            <button onclick="OverviewButton()">Submit</button>
            <div id="OverviewWindowContentResponse"></div>
        </div>
    </div>
    `, "OverviewWindow","Desktop")
}

function OverviewButton(){
    document.getElementById("OverviewWindowContentResponse").innerHTML = ``
    let radioID = null
    const overviews = document.querySelectorAll("input[name='OverviewWindow']")
    for (const radio of overviews){
        if (radio.checked){
            radioID = radio.id
            break
        }
    }
    if (radioID === null){
        console.error("No radio selected")
        window.alert("No overview was selected, please select one")
        return
    }
    document.getElementById("OverviewWindowContentResponse").innerHTML += `<hr>`
    let infoTextHeading = `Uh oh - 📺`
    let infoTextDescription = `This is not supposed to happen... sorry! I must have forgotten to update the responses. Send me a message about this please!`
    let infoTextValue = `Beep boop, I'm a mistake`
    switch (radioID){
        case ("OverviewWindowRadioPopulation"):
            infoTextHeading = GetDBElements("City_Attribute","attribute_name","city_attribute_id",2)
            infoTextDescription = GetDBElements("City_Attribute","attribute_description","city_attribute_id",2)
            infoTextValue = GetDBElements("City_Attribute","attribute_value","city_attribute_id",2)
            break
    }
    document.getElementById("OverviewWindowContentResponse").innerHTML += `<h3>` + infoTextHeading + `</h3><p>` + infoTextDescription + `</p><br><h4 style="margin-top:0px">`+ infoTextValue +`</h4>`
}


function Tutorial(){
    const tutorialToDo = GetDBElements("Tutorial","tutorial_id","completed",0);
    
    let tutorialToDoPick = 1;
    if (tutorialToDo.length == 1){
        tutorialToPick = 0;
    }
    let tutorialPercentage = (tutorialToDo[tutorialToDoPick] - 1)/(Math.max.apply(Math,GetDBElements("Tutorial","tutorial_id",null,null)) - 1) * 100 + "%"
    if (tutorialToDo.length == 1){
        tutorialPercentage = "Completed";
    }
    WindowPopUp(`
    <div class="window" id="TutorialWindow" style="width: 350px">
        <div class="title-bar" id="TutorialWindowHeader" style="cursor:default">
            <div class="title-bar-text">Tutorial window</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="if(GetDBElements('Tutorial','completed','tutorial_id',2) == 1 && GetDBElements('Tutorial','completed','tutorial_id',3) == 1){UpdateDB('Tutorial','completed',1,'tutorial_id',4); document.getElementById('TutorialWindow').remove()}"></button>
            </div>
        </div>
        <div class="window-body" id="TutorialWindowContent">
            <h3 id="TutorialHeader">` + GetDBElements("Tutorial","tutorial_title","tutorial_id",tutorialToDo[tutorialToDoPick]) + `</h3>
            <p>` + GetDBElements("Tutorial","tutorial_description","tutorial_id",tutorialToDo[tutorialToDoPick]) +`</p>
        </div>
        <div class="status-bar" id="TutorialWindowStatus">
            <p class="status-bar-field">Tutorial number: ` + tutorialToDo[tutorialToDoPick] + `</p>
            <p class="status-bar-field">` + GetDBElements("Tutorial","tutorial_category","tutorial_id",tutorialToDo[tutorialToDoPick]) +`</p>
            <p class="status-bar-field">` + tutorialPercentage + `</p>
        </div>
    </div>
    `, "TutorialWindow","Desktop")
}

function UpdateTutorial(){
    const tutorialUpdate = new Audio('Assets/Audio/TutorialUpdate.wav');
    const tutorialToDoRaw = GetDBElements("Tutorial","tutorial_id","completed",0);
    let tutorialToDo = []
    //NOO
    let tutorialToDoPick = 1;
    if (!Array.isArray(tutorialToDoRaw)){
        tutorialToDo.push(tutorialToDoRaw)
        tutorialToDoPick = 0;
    }
    else{
      tutorialToDo = tutorialToDoRaw
    }
    console.log(tutorialToDo)
    let tutorialPercentage = (tutorialToDo[tutorialToDoPick] - 1)/(Math.max.apply(Math,GetDBElements("Tutorial","tutorial_id",null,null)) - 1) * 100 + "%"
    if (!Array.isArray(tutorialToDo)){
        tutorialPercentage = "Completed";
    }

    if (GetDBElements("Tutorial","tutorial_title","tutorial_id",tutorialToDo[tutorialToDoPick]) != document.getElementById("TutorialHeader").innerHTML){
        tutorialUpdate.play();
    }
    document.getElementById("TutorialWindowContent").innerHTML=`
            <h3 id="TutorialHeader">` + GetDBElements("Tutorial","tutorial_title","tutorial_id",tutorialToDo[tutorialToDoPick]) + `</h3>
            <p>` + GetDBElements("Tutorial","tutorial_description","tutorial_id",tutorialToDo[tutorialToDoPick]) +`</p>`
    document.getElementById("TutorialWindowStatus").innerHTML=`
            <p class="status-bar-field">Tutorial number: ` + tutorialToDo[tutorialToDoPick] + `</p>
            <p class="status-bar-field">` + GetDBElements("Tutorial","tutorial_category","tutorial_id",tutorialToDo[tutorialToDoPick]) +`</p>
            <p class="status-bar-field">` + tutorialPercentage + `</p>
    `
}

function WindowPopUpAdd(innerHTML,Source){
    document.getElementById(Source).innerHTML += innerHTML;
    return;
}

async function WindowPopUp(innerHTML,id,Source){
    if (document.getElementById(id)){
     document.getElementById(id).remove()
    }
    
    console.log(id + " is popping up")
    await WindowPopUpAdd(innerHTML,Source)

    if (id != "TutorialWindow"){
     DragElement(document.getElementById(id))
    }
}

function ToggleScroll(lockScroll){
    const html = document.documentElement;
    const body = document.body;

    if(lockScroll){
        html.overflow = "hidden";
        body.overflow = "hidden";
    }
    else{
        html.overflow = "auto";
        body.overflow = "auto";
    }
}
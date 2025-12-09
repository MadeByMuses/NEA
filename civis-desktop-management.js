//Opens the policy window
async function PolicyPurchase(){
    // They have done what they have been told to do (Open this window)
    if (GetDBElements("Tutorial","completed","tutorial_id",5)[0] === 1){
        UpdateDB("Tutorial","completed",1,"tutorial_id",6)
    }
    await WindowPopUp(`
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
    PolicyPurchaseSetUp()


    let policyPurchasSlider = document.getElementById("PolicyPurchaseSlider");
    //In groups of 6
    policyPurchasSlider.max = Math.ceil(GetDBElements("Policy_Pack","policy_pack_id","policy_pack_unlocked",1).length / 6);
    //value is max cause I want it to be at the top (like a scroll bar)
    policyPurchasSlider.ariaValueNow = policyPurchasSlider.max
}

function PolicyPurchaseSetUp (){
    //I call this early incase there is no policiy packs unlocked so I can default it to the DEBUG pack 
    const unlockedPolicyPacks = GetDBElements("Policy_Pack","policy_pack_id","policy_pack_unlocked",1);

    let policyPurchaseInterface =  document.getElementById("PolicyPurchaseInterface");
    PolicyPurchaseInterface.innerHTML = "";

    //See previous comment talking about unlockedPolicyPacks
    if (unlockedPolicyPacks.length === 0){
        unlockedPolicyPacks = [2];
    }

    //n*6 - 6 has {0,6,12,...}
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
        leftside = !leftside; //Easy method of flipping a bool
        iteration++;
    }
}

function PolicyPurchaseConfirmation (id){
    let policyContents = PoliciesInPolicyPack(id);
    let list = "";
    
    if (policyContents.length === 0){
        policyContents = [1];
    }
    for (policy of policyContents){
        list += `<li><details><summary>` + GetDBElements("Policy","policy_name","policy_id",policy) +`</summary><ul><li>` + GetDBElements("Policy","policy_description","policy_id",policy) + `</li><li> Activation cost:` + GetDBElements("City","money_symbol","city_id",1) + GetDBElements("Policy","policy_act_cost","policy_id",policy) + `</li></details></li>`
    }

    document.getElementById("Body").innerHTML += `
    <div id="PolicyPurchaseConfirmation">
        <div class="window" id="Confirmation" style="width: 350px">
            <div class="title-bar" id="ConfirmationHeader">
                <div class="title-bar-text"> Confirmation </div>
                <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onclick="if (GetDBElements('City_Attribute','attribute_value','city_attribute_id',5)[0]===0){document.getElementById('PolicyPurchaseConfirmation').remove()}"></button>
                </div>
            </div>
            <div class="window-body" id="ConfirmationContent">
                <h3>` + GetDBElements("Policy_Pack","policy_pack_name","policy_pack_id",id) +`</h3>
                <p>` + GetDBElements("Policy_Pack","policy_pack_description","policy_pack_id",id)  + `
                <hr>
                <ul style="max-height:200px" class="tree-view">` + list + `
                </ul>
                <hr>
                <p>Price of pack is: §` + GetDBElements("Policy_Pack","policy_pack_cost","policy_pack_id",id) + ` - Your funds: § ` + GetDBElements("City_Attribute","attribute_value","city_attribute_id",4) +`</p>
                <p>You will get ` + Math.max(...GetDBElements("Policy_Pack_Policy","slot","policy_pack_id",id)) + ` policy/policies from this pack</p>
                <br>
                <button onclick="PurchasePolicyPack(` + id + `)">Purchase policy pack</button>
                <div id="PolicyPurchaseConfirmationComment"></div>
            </div>
        </div>
    </div> 
    `;
}

async function PurchasePolicyPack (id){
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let policiesChosen = []
    if (GetDBElements("City_Attribute","attribute_value","city_attribute_id",4) < GetDBElements("Policy_Pack","policy_pack_cost","policy_pack_id",id)) {
        document.getElementById("PolicyPurchaseConfirmationComment").innerHTML = `<p id="Formwarn">You are missing § funds!</p>`;
        return;
    }
    else{
        UpdateDB("City_Attribute","attribute_value",1,"city_attribute_id",5)
        UpdateDB("City_Attribute","attribute_value",GetDBElements("City_Attribute","attribute_value","city_attribute_id",4) - GetDBElements("Policy_Pack","policy_pack_cost","policy_pack_id",id),"city_attribute_id",4)

        document.getElementById("ConfirmationContent").innerHTML = `<img style="width:50%;image-rendering: pixelated;" src="Assets/Transaction.gif"><p>The policies collected</p><ul class="tree-view" id="PolicyPackPurchaseWhatDidYouGet"></ul>`;
        await delay(1000);//GetDBElements("Policy_Pack","policies_to_gain","policy_pack_id",id)
        for (let i = 1; i <= Math.max(...GetDBElements("Policy_Pack_Policy","slot","policy_pack_id",id)); i++){
            const policies = PoliciesInPolicyPackSlot(id,i);
            const policyChosen = policies[Math.floor(Math.random() * policies.length)];
            policiesChosen.push(policyChosen)
            document.getElementById("PolicyPackPurchaseWhatDidYouGet").innerHTML += `<li>` + GetDBElements("Policy","policy_name","policy_id",policyChosen) + `</li>`;
            InsertDB('Policy_Collection','(policy_id, policy_active)','('+String(policyChosen) + ',0)')
            await delay(500)
        }
        await delay(500)
        document.getElementById("ConfirmationContent").innerHTML = `<h2>You have purchased:<br>` + GetDBElements("Policy_Pack","policy_pack_name","policy_pack_id",id) + `</h2><br><ul class="tree-view" id="PolicyPackPurchaseWhatDidYouGet"></ul><hr><p>You may now close this window, thank you for your patronage`;
        
        for (n of policiesChosen){
            document.getElementById("PolicyPackPurchaseWhatDidYouGet").innerHTML += `<li>` + GetDBElements("Policy","policy_name","policy_id",n) +`</li>`;
        }

        UpdateDB("Tutorial","completed",1,"tutorial_id",7)
        UpdateDB("City_Attribute","attribute_value",0,"city_attribute_id",5)
    }
}

//Opens dictionary of policies
function PrePolicyPanel (){
    WindowPopUp(`
        <div id="Form" class="window" style="width:350px">
            <menu role="tablist" class="multirows">
                <li role="tab" onclick="PolicyPanel(null); UpdateDB('Tutorial','completed',1,'tutorial_id',8); UpdateTutorial()"><a style="font-size:1.2rem">All</a></li>
            </menu>
            <menu role="tablist" class="multirows">
                <li role="tab"><a ></a></li>
                <li role="tab"><a href="#tabs"></a></li>
                <li role="tab"><a href="#tabs">Programs</a></li>
                <li role="tab"><a href="#tabs">Services</a></li>
                <li role="tab"><a href="#tabs">Resources</a></li>
                <li role="tab"><a href="#tabs">Advanced</a></li>
            </menu>
            <div class="window" role="tabpanel" id="FormHeader">
                <div>
                <h4 style="text-align:center">Pick a tab to open!</h4>
                <hr>
                <h4 style="text-align:center">You have collected ` + GetDBElements("Policy_Collection","policy_collection_id",null,null).length + ` policies.</h4>
                <br>
                <div style="display: flex;justify-content: center;align-items: center;height: 70px;">
                <button class="default" onclick="getElementById('Form').remove()">Press this button to close the window</button>
                </div>
                </div>
            </div>
        </div>`,`Form`,`Desktop`)
}

function PolicyPanel (category){
    WindowPopUp(`
    <div class="window" id="Form" style="width: 350px">
        <div class="title-bar" id="FormHeader">
            <div class="title-bar-text"> Policy panel - ` + (category === null ? `All` : category) + `</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button>
            </div>
        </div>
        <div class="window-body" style="max-height:650px;overflow-y:scroll;overflow-x:none" id="FormContent">
        </div>
    </div>
    `,"Form","Desktop")

    const unlockedPolicy = UnlockedPolicies(category)
    for (n of unlockedPolicy){
        document.getElementById("FormContent").innerHTML += `
        <div style="border-style: outset; padding:1rem">
            <div style="display:flex; align-items:center;">
                <img style="margin:5px;max-height:100px;max-width:100px;border: 3px solid black;" src="Assets/Policies/P_` + n + `.png">
                <h3>` + GetDBElements("Policy","policy_name","policy_id",n) + `</h3>
            </div>
            <br>
            <p>` + GetDBElements("Policy","policy_description","policy_id",n) + `</p>
            <br>
            <div id="P_` + n + `"></div>
            <h4>Activation fee: ` + GetDBElements("City","money_symbol",null,null) + GetDBElements("Policy","policy_act_cost","policy_id",n) +`</h4>
        </div>
        <br>`
        UpdatePolicyPanel(n,0,null)
    }
}

function UpdatePolicyPanel(id, change, method){
    if (method === 'sub' || method ==='add'){
        let inactivatedList = GetDBElementsDoubleCondition("Policy_Collection","policy_collection_id","policy_id",id,"policy_active",0)
        let activatedList = GetDBElementsDoubleCondition("Policy_Collection","policy_collection_id","policy_id",id,"policy_active",1)
        if (method === 'sub' && activatedList.length > 0){
            for (let i = 0; i < change; i++){
                const ActivatedSfx = new Audio('Assets/Audio/Activation.wav')
                ActivatedSfx.play()
                UpdateDB("Policy_Collection","policy_active",0,"policy_collection_id",activatedList[i])
            }
        }
        else if (method === 'add' && inactivatedList.length > 0){
            if (Number(GetDBElements("Policy","policy_act_cost","policy_id",id)) > Number(GetDBElements("City_Attribute","attribute_value","city_attribute_id",3))){
                const warnSfx = new Audio('Assets/Audio/Hit_Hurt.wav');
                warnSfx.play()
                return
            }
            for (let i = 0; i < change; i++){
                const ActivatedSfx = new Audio('Assets/Audio/Activation.wav')
                ActivatedSfx.play()
                UpdateDB("Tutorial","completed",1,"tutorial_id",9)
                UpdateDB("Policy_Collection","policy_active",1,"policy_collection_id",inactivatedList[i])
                UpdateDB("City_Attribute","attribute_value",GetDBElements("City_Attribute","attribute_value","city_attribute_id",3) - GetDBElements("Policy","policy_act_cost","policy_id",id),"city_attribute_id",3)
            }
            if (GetDBElements("Policy_Collection","policy_collection_id","policy_active",1).length >= 4){
                UpdateDB("Tutorial","completed",1,"tutorial_id",10)
            }
        }
    }
    let element = document.getElementById("P_"+id)
    const elementNumber = GetDBElements("Policy_Collection","policy_collection_id","policy_id",id)
    if (GetDBElementsDoubleCondition("Policy_Collection","policy_collection_id","policy_id",id,"policy_active",0).length === elementNumber.length){
        element.innerHTML = `<button disabled> deactivate </button>`
    }
    else{
        element.innerHTML = `<button onclick="UpdatePolicyPanel(` + id + `,1,'sub')"> deactivate </button>`
    }
    
    element.innerHTML += "<span style='font-size:1.5em;padding-left:1.25em;padding-right:1.25em'>" + GetDBElementsDoubleCondition("Policy_Collection","policy_collection_id","policy_id",id,"policy_active",1).length + " are active</span>"

    if (GetDBElementsDoubleCondition("Policy_Collection","policy_collection_id","policy_id",id,"policy_active",1).length === elementNumber.length){
        element.innerHTML += `<button disabled> activate </button>`
    }
    else{
        element.innerHTML += `<button onclick="UpdatePolicyPanel(` + id + `,1,'add')"> activate </button>`
    }

    //Update funds
    document.getElementById("TaskbarCurrentFunds").innerText = "Current funds: " + GetDBElements("City","money_symbol",null,null)[0] + FormattedNumber(GetDBElements("City_Attribute","attribute_value","city_attribute_id",3),"currency")
}

function Settings (){
    if (GetDBElements('Tutorial','completed','tutorial_id',12)[0] == 1){
        UpdateDB('Tutorial','completed',1,'tutorial_id',13)
    }
    let selects = ['','','','']
    switch (GetDBElements("City","money_symbol","city_id",1).toString()){
        case "£":
            selects[0] = ` selected`
            break
        case "$":
            selects[1] = ` selected`
            break
        case "€":
            selects[2] = ` selected`
            break
        case "¥":
            selects[3] = ` selected`
            break
    }
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
            <button onclick="Tutorial();if (!document.getElementById('TutorialWindow')){UpdateDB('Tutorial','completed',1,'tutorial_id',4)};getElementById('Form').remove()">Open Tutorial Window</button>
            <br><br>
            <p>Currency symbol</p>
            <select id="CurrencySelect" onchange="let moneySymbol = document.getElementById('CurrencySelect').value; UpdateDB('City','money_symbol',moneySymbol,'city_id',1)">
                <option` + selects[0] + `>£</option>
                <option` + selects[1] + `>$</option>
                <option` + selects[2] + `>€</option>
                <option` + selects[3] + `>¥</option>
            </select>
            <hr>
            <button onclick="ExportDB()">Export</button>
            <br>
        </div>
    </div>
    `, "Form","Desktop")
}

function Overview (){
    UpdateDB("Tutorial","completed",1,"tutorial_id",2)
    const cityName = GetDBElements("City","name","city_id",1) 
    WindowPopUp(`
    <div class="window" id="Form" style="width: 350px">
        <div class="title-bar" id="FormHeader">
            <div class="title-bar-text">`+ cityName +`</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('Form').remove();UpdateDB('Tutorial','completed',1,'tutorial_id',3)"></button> <!-- That does not need to be an IF cause tutorial_id 2 is only true if this pops up --!>
            </div>
        </div>
        <div class="window-body" id="FormContent">
            <p>The current data of ` + cityName + `:</p>
            <div class="field-row">
                <input id="FormRadioPopulation" type="radio" name="Form">
                <label for="FormRadioPopulation">` + GetDBElements("City_Attribute","attribute_name","city_attribute_id",2) + `</label>
            </div>
            <div class="field-row">
                <input id="FormRadioRevenue" type="radio" name="Form">
                <label for="FormRadioRevenue">Revenue</label>
            </div>
            <div class="field-row">
                <input disabled id="FormRadioPolicyCount" type="radio" name="Form">
                <label for="FormRadioPolicyCount">Amount of policies collected</label>
            </div>
            <br>
            <button onclick="OverviewButton()">Submit</button>
            <div id="FormContentResponse"></div>
        </div>
    </div>
    `, "Form","Desktop")
}

function OverviewButton (){
    document.getElementById("FormContentResponse").innerHTML = ``
    let radioID = null
    const overviews = document.querySelectorAll("input[name='Form']")
    for (const radio of overviews){
        if (radio.checked){
            radioID = radio.id
            break
        }
    }
    if (radioID === null){
        console.warn("No radio selected")
        window.alert("No overview was selected, please select one")
        return
    }
    document.getElementById("FormContentResponse").innerHTML += `<hr>`
    let infoTextHeading = `Uh oh - 📺`
    let infoTextDescription = `This is not supposed to happen... sorry! I must have forgotten to update the responses. Send me a message about this please!`
    let infoTextValue = `Beep boop, I'm a mistake`
    switch (radioID){
        case ("FormRadioPopulation"):
            infoTextHeading = GetDBElements("City_Attribute","attribute_name","city_attribute_id",2)
            infoTextDescription = GetDBElements("City_Attribute","attribute_description","city_attribute_id",2)
            infoTextValue = GetDBElements("City_Attribute","attribute_value","city_attribute_id",2)
            break
    }
    document.getElementById("FormContentResponse").innerHTML += `<h3>` + infoTextHeading + `</h3><p>` + infoTextDescription + `</p><br><h4 style="margin-top:0px">`+ infoTextValue +`</h4>`
}

function Tutorial (){
    const tutorialToDo = GetDBElements("Tutorial","tutorial_id","completed",0);
    
    let tutorialToDoPick = 1;
    if (tutorialToDo.length === 1){
        tutorialToPick = 0;
    }
    let tutorialPercentage = FormattedNumber((tutorialToDo[tutorialToDoPick] - 1)/(Math.max.apply(Math,GetDBElements("Tutorial","tutorial_id",null,null)) - 1) * 100, 'percentage') + "%"
    if (tutorialToDo.length === 1){
        tutorialPercentage = "Completed";
    }
    WindowPopUp(`
    <div class="window" id="TutorialWindow" style="width: 350px">
        <div class="title-bar" id="TutorialWindowHeader" style="cursor:default">
            <div class="title-bar-text">Tutorial window</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="if (GetDBElements('Tutorial','completed','tutorial_id',2)[0] === 1 && GetDBElements('Tutorial','completed','tutorial_id',3)[0] === 1){UpdateDB('Tutorial','completed',1,'tutorial_id',4); document.getElementById('TutorialWindow').remove()}"></button>
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

async function CityCensus (){
    const cityName = GetDBElements("City","name","city_id",1) 
    let ageWeekArray = GetDBElements("Citizen","turn_of_birth",null,null)
    await WindowPopUp(`
    <div class="window" id="Form" style="width: 350px">
        <div class="title-bar" id="FormHeader">
            <div class="title-bar-text">City census: `+ cityName +`</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button> 
            </div>
        </div>
        <div class="window-body" id="FormContent" style="max-height:650px; overflow-y:auto">
            <h3>The demographic</h3>
            <p>Population of ` + cityName + ` : ` + ageWeekArray.length +`</p>
            <hr>
            <canvas id="AgePieChart" width="250px" height="250px"></canvas>
            <p>Details</p>
            <ul id="AgePieChartBulletList">
            </ul>
            <hr>
            <canvas id="JobPieChart" width="250px" height="250px"></canvas>
            <p>Details</p>
            <ul id="JobPieChartBulletList">
            </ul>
            <hr>
            <div class="sunken-panel" style="height: 120px; width: 240px;">
                <table class="interactive" id="CitizenCensusTable">
                </table>
            </div>
        </div>
    </div>
    `, "Form","Desktop")
    let jobArray = []
    let ageArray = [["Baby",0,"#006e7fff"],["Child",0,"#7d8508ff"],["Teenager",0,"#341539ff"],["Young Adult",0,"#06a165ff"],["Adult",0,"#960909ff"],["Elder",0,"#1a45d3ff"]]

    const jobIds = await GetDBElements("Job","job_id",null,null)
    for (const id of jobIds){
        const count = await GetDBElements("Employer","employer_listing_id","job_id",id).length
        if (count == 0){
            continue
        }
        const name = await GetDBElements("Job","name","job_id",id)[0]
        const hexColour = await GetDBElements("Job","hex_colour","job_id",id)[0]
        jobArray.push([name,count,hexColour])
    }

    const birthWeeks = await GetDBElements("Citizen","turn_of_birth",null,null)
    const turn = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",1)
    for (const birthWeek of birthWeeks){
        const trueAge = turn - birthWeek
        if (trueAge <= (52 * 5)){
            ageArray[0][1] += 1
        }
        else if (trueAge <= (52*13)){
            ageArray[1][1] += 1
        }
        else if (trueAge <= (52*18)){
            ageArray[2][1] += 1
        }
        else if (trueAge <= (52*33)){
            ageArray[3][1] += 1
        }
        else if (trueAge <= (52*65)){
            ageArray[4][1] += 1
        }
        else{
            ageArray[5][1] += 1
        }

    }
    DrawPieChart("AgePieChart",ageArray)
    DrawPieChart("JobPieChart",jobArray)

    let citizenDataArray = []
    const citizenParameters = ["citizen_id","name","parent_id","turn_of_birth","money","residential_id","education_weeks"]
    citizenDataArray.push(citizenParameters)
    const citizenArray = await GetDBElements("Citizen","citizen_id",null,null)
    for(const id of citizenArray){
        let arrayToPush = []
        const object = await LoadObject.constructCitizen(id)
        arrayToPush.push(id)
        arrayToPush.push(object.getName())
        arrayToPush.push(object.getParentId())
        arrayToPush.push(object.getTurnOfBirth())
        arrayToPush.push(object.getMoney())
        arrayToPush.push(object.getResidentialId())
        arrayToPush.push(object.getEducationTurns())
        citizenDataArray.push(arrayToPush)
    }
    InsertTable("CitizenCensusTable",citizenDataArray)
}

async function PrivateSector (){
    const cityName = GetDBElements("City","name","city_id",1) 
    await WindowPopUp(`
    <div class="window" id="Form" style="width: 350px">
        <div class="title-bar" id="FormHeader">
            <div class="title-bar-text">Private sector: `+ cityName +`</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button> 
            </div>
        </div>
        <div class="window-body" id="FormContent" style="max-height:650px; overflow-y:auto">
            <div class="sunken-panel" style="height: 120px; width: 240px;">
                <table class="interactive" id="IndustrialCensusTable">
                </table>
            </div>
            <div class="sunken-panel" style="height: 120px; width: 240px;">
                <table class="interactive" id="CommercialCensusTable">
                </table>
            </div>
            <div class="sunken-panel" style="height: 120px; width: 240px;">
                <table class="interactive" id="ResidentialCensusTable">
                </table>
            </div>
        </div>
    </div>
    `, "Form","Desktop")

    let industrialDataArray = []
    const industrialParameters = ["industrial_id","name","building_id","industrial_model_id","money"]

    industrialDataArray.push(industrialParameters)
    const industrialArray = await GetDBElements("Industrial","industrial_id",null,null)
    for(const id of industrialArray){
        let arrayToPush = []
        const object = await LoadObject.constructIndustrial(id)
        arrayToPush.push(id)
        arrayToPush.push(object.getName())
        arrayToPush.push(object.getBuildingId())
        arrayToPush.push(object.getIndustrialModelId())
        arrayToPush.push(object.getMoney())
        industrialDataArray.push(arrayToPush)
    }
    InsertTable("IndustrialCensusTable",industrialDataArray)

    let commercialDataArray = []
    const commercialParameters = ["commercial_id","name","building_id","commercial_model_id","money"]

    commercialDataArray.push(commercialParameters)
    const commercialArray = await GetDBElements("Commercial","commercial_id",null,null)
    for(const id of commercialArray){
        let arrayToPush = []
        const object = await LoadObject.constructCommercial(id)
        arrayToPush.push(id)
        arrayToPush.push(object.getName())
        arrayToPush.push(object.getBuildingId())
        arrayToPush.push(object.getCommercialModelId())
        arrayToPush.push(object.getMoney())
        commercialDataArray.push(arrayToPush)
    }
    InsertTable("CommercialCensusTable",commercialDataArray)


    let residentialDataArray = []
    const residentialParameters = ["residential_id","name","building_id","rent","family_count"]

    residentialDataArray.push(residentialParameters)
    const residentialArray = await GetDBElements("Residential","residential_id",null,null)
    for(const id of residentialArray){
        let arrayToPush = []
        const object = await LoadObject.constructResidential(id)
        arrayToPush.push(id)
        arrayToPush.push(object.getName())
        arrayToPush.push(object.getBuildingId())
        arrayToPush.push(object.getRent())
        arrayToPush.push(await GetDBElements('Group_Residential_Collection','group_id','residential_id',id).length)
        residentialDataArray.push(arrayToPush)
    }
    InsertTable("ResidentialCensusTable",residentialDataArray)
}

async function Simulation (){
    UpdateDB('Tutorial','completed',1,'tutorial_id',12)
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const nextDate = GetGameDate(1)
    document.getElementById("Body").innerHTML += `
    <div id="SimulationBlocker">
        <h1 id="SimulationBlockerHeader" >Simulating - ` +  nextDate + `</h1>
        <br><br><br>
        <div id="SimulationProgressBars">
            <p id="SimulationProgressBarsDetail"></p> 
            <div class="progress-indicator segmented">
                <span id="SimulationProgressBarsDetailProgressIndicator" class="progress-indicator-bar" style="width: 0%;" />
            </div>
            <br>
            <br>
            <p id="SimulationProgressBarsDetailSpecifics"></p>
            <div class="progress-indicator">
                <span id="SimulationProgressBarsDetailSpecificsProgressIndicator" class="progress-indicator-bar"  style="width: 00%;" />
            </div>
        </div>
    </div>`
    
    await delay(1000)
    await simulateCity(10)
}

function UpdateTutorial (){
    const tutorialUpdate = new Audio('Assets/Audio/TutorialUpdate.wav');
    const tutorialToDo = GetDBElements("Tutorial","tutorial_id","completed",0);
    
    let tutorialToDoPick = 1;
    if (tutorialToDo.length == 0){
        tutorialToDoPick = 0;
    }

    let tutorialPercentage = "Completed";
    if (tutorialToDo.length > 0){
        tutorialPercentage = FormattedNumber((tutorialToDo[tutorialToDoPick] - 1)/(Math.max.apply(Math,GetDBElements("Tutorial","tutorial_id",null,null)) - 1) * 100, 'percentage') + "%"
    }

    if (GetDBElements("Tutorial","tutorial_title","tutorial_id",tutorialToDo[tutorialToDoPick]) !== document.getElementById("TutorialHeader").innerHTML){
        tutorialUpdate.play();
    }
    document.getElementById("TutorialWindowContent").innerHTML=`
            <h3 id="TutorialHeader">` + GetDBElements("Tutorial","tutorial_title","tutorial_id",tutorialToDo[tutorialToDoPick]) + `</h3>
            <p>` + GetDBElements("Tutorial","tutorial_description","tutorial_id",tutorialToDo[tutorialToDoPick]) +`</p>`
    document.getElementById("TutorialWindowStatus").innerHTML=`
            <p class="status-bar-field">Tutorial number: ` + tutorialToDo[tutorialToDoPick] + `</p>
            <p class="status-bar-field">` + GetDBElements("Tutorial","tutorial_category","tutorial_id",tutorialToDo[tutorialToDoPick]) +`</p>
            <p class="status-bar-field">` + tutorialPercentage + `</p>
    `;
}

function WindowPopUpAdd (innerHTML,Source){
    document.getElementById(Source).innerHTML += innerHTML;
    return;
}

async function WindowPopUp (innerHTML,id,Source){
    //remove existing windows
    if (document.getElementById(id)){
     document.getElementById(id).remove()
    }
    
    //wait for the window to be added
    console.log(id + " is popping up")
    await WindowPopUpAdd(innerHTML,Source)

    //Make it draggable
    if (id !== "TutorialWindow"){
     DragElement(document.getElementById(id))
    }

    return;
}

function ToggleScroll (lockScroll){
    const html = document.documentElement;
    const body = document.body;

    if (lockScroll){
        html.overflow = "hidden";
        body.overflow = "hidden";
    }
    else{
        html.overflow = "auto";
        body.overflow = "auto";
    }
}
//Opens the policy window
async function PolicyPurchase(){
    printTable("Policy_Pack")
    // They have done what they have been told to do (Open this window)
    if (GetDBElements("Tutorial","completed","tutorial_id",5)[0] === 1){
        UpdateDB("Tutorial","completed",1,"tutorial_id",6)
    }
    await WindowPopUp(`
    <div class="window" id="Form" style="width: 350px; height: 500px">
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
                        <input id="PolicyPurchaseSlider" class="has-box-indicator" type="range" min="1" max="5" step="1" value="3" oninput="PolicyPurchaseSetUp()"/>
                    </div>
                </div>
                <div id="PolicyPurchaseInterface">
                </div>
            </div>
        </div>
    </div>
    `,"Form","Desktop")


    let policyPurchasSlider = document.getElementById("PolicyPurchaseSlider");
    //In groups of 6
    policyPurchasSlider.max = Math.ceil(GetDBElements("Policy_Pack","policy_pack_id","policy_pack_unlocked",1).length / 6);
    //value is max cause I want it to be at the top (like a scroll bar)
    policyPurchasSlider.value = policyPurchasSlider.max


    await PolicyPurchaseSetUp()
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


    let policyPurchasSlider = document.getElementById("PolicyPurchaseSlider");
    const totalPages = policyPurchasSlider.max;
    const reversedInput = totalPages - policyPurchasSlider.value + 1;
    //n*6 - 6 has {0,6,12,...}
    const selectedPolicyPacks = unlockedPolicyPacks.slice((reversedInput - 1) * 6,reversedInput * 6);
    let leftside = true;
    let iteration = 1;
    let insert = ``
    for (let policypack of selectedPolicyPacks){
        insert += leftside ? `<div style="margin-bottom:135px"> ` : ` `;

        insert += `
        <div id="PP` + iteration +`" onclick="PolicyPurchaseConfirmation(` + policypack + `)">
            <img style="max-width:100px;max-height:80px" src='Assets/Policies/PP_`+policypack+`.png'>
            <h4>` + GetDBElements("Policy_Pack","policy_pack_name","policy_pack_id",policypack) + `</h4>
            <hr>
            <p>` + GetDBElements("Policy_Pack","policy_pack_description","policy_pack_id",policypack) +`</p>
        </div>`;

        insert += !leftside ? `</div><br>` : ``;
        if (!leftside || ((selectedPolicyPacks.length == iteration) && iteration % 2 == 1)){
            policyPurchaseInterface.innerHTML += insert
            insert = ``
            document.getElementById("PP" + String(iteration-1)).style.float = "right"
            document.getElementById("PP" + String(iteration)).style.float = "left"

        }
        iteration++
        leftside = !leftside; 
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
    const budget = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",4)[0]
    const cost = await GetDBElements("Policy_Pack","policy_pack_cost","policy_pack_id",id)[0]
    if (budget < cost) {
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
                <li role="tab" onclick=" PolicyPanel('ResidentialZoning')"><a href="#tabs">Residential</a></li>
                <li role="tab" onclick=" PolicyPanel('CommercialZoning')"><a href="#tabs">Commercial</a></li>
                <li role="tab" onclick=" PolicyPanel('IndustrialZoning')"><a href="#tabs">Industrial</a></li>
                <li role="tab" onclick=" PolicyPanel('Services')"><a href="#tabs">Government</a></li>
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

async function PolicyPanel (category){
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
        <div class="window-body" style="max-height:600px;overflow-y:scroll;overflow-x:none" id="FormContent">
        </div>
    </div>
    `,"Form","Desktop")

    if (category == "Services"){
        const services = ["Road","Electricity","DrinkingWater","Sewage","Healthcare","Deathcare","Fire","Police","Government"]
        for (const service of services){
            await CategoryPolicyPanel(service)
        }
    }
    else {
        CategoryPolicyPanel(category)
    }
}

async function CategoryPolicyPanel(category){
    const unlockedPolicy = await UnlockedPolicies(category)
    for (n of unlockedPolicy){
        document.getElementById("FormContent").innerHTML += `
        <div style="border-style: outset; padding:1rem">
            <div style="display:flex; align-items:center;">
                <img style="margin:5px;;max-height:100px;width:100px;border: 3px solid black;" src="Assets/Policies/P_` + n + `.png">
                <h3>` + await GetDBElements("Policy","policy_name","policy_id",n) + `</h3>
            </div>
            <br>
            <p>` + await GetDBElements("Policy","policy_description","policy_id",n) + `</p>
            <br>
            <div id="P_` + n + `"></div>
            <h4>Activation fee: ` + await GetDBElements("City","money_symbol",null,null) + await GetDBElements("Policy","policy_act_cost","policy_id",n) +`</h4>
        </div>
        <br>`
        UpdatePolicyPanel(n,0,null)
    }

}

const activatedSfx = new Audio('Assets/Audio/Activation.wav')
const warnSfx = new Audio('Assets/Audio/Hit_Hurt.wav');

function UpdatePolicyPanel(id, change, method){
    if (method === 'sub' || method ==='add'){
        let inactivatedList = GetDBElementsDoubleCondition("Policy_Collection","policy_collection_id","policy_id",id,"policy_active",0)
        let activatedList = GetDBElementsDoubleCondition("Policy_Collection","policy_collection_id","policy_id",id,"policy_active",1)
        if (method === 'sub' && activatedList.length > 0){
            for (let i = 0; i < change; i++){
                activatedSfx.play()
                UpdateDB("Policy_Collection","policy_active",0,"policy_collection_id",activatedList[i])
            }
        }
        else if (method === 'add' && inactivatedList.length > 0){
            if (Number(GetDBElements("Policy","policy_act_cost","policy_id",id)) > Number(GetDBElements("City_Attribute","attribute_value","city_attribute_id",3))){
                warnSfx.play()
                return
            }
            for (let i = 0; i < change; i++){
                activatedSfx.play()
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
        <div class="window-body" id="FormContent" style="max-height: 400px">
            <p>Welcome to the settings</p>
            <br>
            <button onclick="Tutorial();if (!document.getElementById('TutorialWindow')){UpdateDB('Tutorial','completed',1,'tutorial_id',4)};getElementById('Form').remove()">Open Tutorial Window</button>
            <br><br>
            <p>Currency symbol</p>
            <select id="CurrencySelect" onchange="let moneySymbol = document.getElementById('CurrencySelect').value; UpdateDB('City','money_symbol',moneySymbol,'city_id',1)">
                <option` + selects[0] + `>£</option>
                <option` + selects[1] + `>$</option>
                <option` + selects[2] + `>€</option>
            </select>
            <hr>
            <div class="field-row" style="width: 95%;padding-left:5%">
                <label >Volume:</label>
                <label ">Low</label>
                <input id="range23" type="range" min="0" max="1" value="1" step="0.05" onchange="VolumeUpdate(this.value)"/>
                <label >High</label>
            </div>
            <br>
            <button onclick="ExportDB()">Export</button>
            <hr>
            <h4>Many thanks to all that helped!</h4>
            <ul class="tree-view">
                <li>
                    Tools
                    <ul>
                    <li><a href="https://sql.js.org/#/">SQL.js</a></li>
                    <li><a href="https://github.com/jdan/98.css">98.css</a></li>
                    <li><a href="https://github.com/madebymuses">Github</a></li>
                    </ul>
                </li>
                <li>
                    <details open>
                    <summary>Alpha Testers</summary>
                    <ul>
                        <li>Ewan Smith</li>
                        <li>Riley Searle</li>
                        <li>Ben Prineas</li>
                        <li>Luke Burrows</li>
                    </ul>
                    </details>
                </li>
                <li>
                    <details>
                    <summary>Beta Testers</summary>
                    <ul>
                        <li>___</li>
                    </ul>
                    </details>
                </li>
            </ul>
        </div>
    </div>
    `, "Form","Desktop")
}

async function Overview (){
    UpdateDB("Tutorial","completed",1,"tutorial_id",2)
    const cityName = await GetDBElements("City","name","city_id",1)
    const population = await GetDBElements("City_attribute","attribute_value","city_attribute_id",2) 
    const status = await GetDBElements("City","status","city_id",1)
    WindowPopUp(`
    <div class="window" id="Overview" style="width: 350px">
        <div class="title-bar" id="OverviewHeader">
            <div class="title-bar-text">`+ cityName +`</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('Overview').remove();UpdateDB('Tutorial','completed',1,'tutorial_id',3)"></button> <!-- That does not need to be an IF cause tutorial_id 2 is only true if this pops up --!>
            </div>
        </div>
        <div class="window-body" id="OverviewContent">
            <h3>The current data of ` + cityName + `:</h3>
            <hr>
            <p>` + cityName + ` has a population of ` + population + `, making it have ` + status + ` status!</p>
        </div>
    </div>
    `, "Overview","Desktop")
}

async function PublicSector(){
    WindowPopUp(`
    <div class="window" id="InfoBox" style="width: 350px">
        <div class="title-bar" id="InfoBoxHeader">
            <div class="title-bar-text">Public sector</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('InfoBox').remove();"></button>
            </div>
        </div>
        <div class="window-body" id="InfoBoxContent" style="max-height:70vh">
        <ul class="tree-view" style="max-height:68vh">
            <li>Roads
                <ul class="financeList">
                    <li id="RoadsCost">0</li>
                    <li id="RoadsRevenue">0</li>
                    <li><span id="Value200"></span> space: <span id="Status200"></span></li>
                </ul>
            </li>
            <li>Electricity
                <ul class="financeList">
                    <li id="ElectricityCost">0</li>
                    <li id="ElectricityRevenue">0</li>
                    <li><span id="Value202"></span> MW: <span id="Status202"></span></li>
                </ul>
            </li>
            <li>Water
                <ul class="financeList">
                    <li id="WaterCost">0</li>
                    <li id="WaterRevenue">0</li>
                    <li>Drinking water</li>
                    <ul class="financeList">
                        <li id="DrinkingWaterCost">0</li>
                        <li id="DrinkingWaterRevenue">0</li>
                        <li><span id="Value204"></span> m^3: <span id="Status204"></span></li>
                    </ul>
                    <li>Sewage</li>
                    <ul class="financeList">
                        <li id="SewageCost">0</li>
                        <li id="SewageRevenue">0</li>
                        <li><span id="Value206"></span> m^3: <span id="Status206"></span></li>
                    </ul>
                </ul>
            </li>
            <li>Garbage
                <ul class="financeList">
                    <li id="GarbageCost">0</li>
                    <li id="GarbageRevenue">0</li>
                    <li><span id="Value220"></span> Tonnes: <span id="Status220"></span></li>
                </ul>
            </li>
            <li>Care
                <ul class="financeList">
                    <li id="CareCost">0</li>
                    <li id="CareRevenue">0</li>
                    <li>Healthcare</li>
                    <ul class="financeList">
                        <li id="HealthcareCost">0</li>
                        <li id="HealthcareRevenue">0</li>
                        <li><span id="Value216"></span> Patients: <span id="Status216"></span></li>
                    </ul>
                    <li>Deathcare</li>
                    <ul class="financeList">
                        <li id="DeathcareCost">0</li>
                        <li id="DeathcareRevenue">0</li>
                        <li><span id="Value218"></span> Bodies: <span id="Status218"></span></li>
                    </ul>
                </ul>
            </li>
            <li>Police
                <ul class="financeList">
                    <li id="PoliceCost">0</li>
                    <li id="PoliceRevenue">0</li>
                    <li><span id="Value222"></span> jail spaces: <span id="Status222"></span></li>
                </ul>
            </li>
            <li>Fire safety
                <ul class="financeList">
                    <li id="FireCost">0</li>
                    <li id="FireRevenue">0</li>
                    <li><span id="Value224"></span> protected houses: <span id="Status224"></span></li>
                </ul>
            </li>
            <li>Government
                <ul class="financeList">
                    <li id="GovernmentCost">0</li>
                    <li id="GovernmentRevenue">0</li>
                    <li><span id="Value226"></span> space: <span id="Status226"></span></li>
                </ul>
            </li>
        </ul>
        </div>
    </div>
    `, "InfoBox","Desktop")

    const activePolicies = await GetDBElements("Policy_Collection","policy_id","policy_active",1)
    const repeats = {
        "DrinkingWater":"Water",
        "Sewage":"Water",
        "Healthcare":"Care",
        "Deathcare":"Care"
    }
    for (const policyId of activePolicies){
        let policyTag = await GetDBElements("Policy","policy_category","policy_id",policyId)
        const effectIds = await GetDBElements("Policy_Effect","policy_effect_id","policy_id",policyId)
        for (const effectId of effectIds){
            const attributeId = await GetDBElements("Policy_Effect","city_attribute_id","policy_effect_id",effectId)[0]
            const attributeMethod = await GetDBElements("Policy_Effect","method","policy_effect_id",effectId)[0]
            const deltaValue = await GetDBElements("Policy_Effect","delta_value","policy_effect_id",effectId)[0]
            if (attributeId == 3){
                if (deltaValue < 0){
                    let allIdsDone = true
                    do{
                        allIdsDone = true
                        const liToChange = document.getElementById(policyTag + "Cost")
                        const currentLi = Number(liToChange.innerText)
                        if (attributeMethod == "add"){
                            liToChange.innerText = Number(deltaValue) + Number(currentLi)
                        }
                        else if (attributeMethod == "multi"){
                            const dynamicDeltaId = await GetDBElements("Policy_Effect","dynamic_attribute_id","policy_effect_id",effectId)[0]
                            const dynamicDelta = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",dynamicDeltaId)[0]
                            liToChange.innerText = (Number(deltaValue) * dynamicDelta)  + Number(currentLi)
                        }
                        if (repeats.hasOwnProperty(policyTag)){
                            policyTag = repeats[policyTag]
                            allIdsDone = false
                        }
                    }while(!allIdsDone)
                }
                else{
                    let allIdsDone = true
                    do{
                        allIdsDone = true
                        const liToChange = document.getElementById(policyTag + "Revenue")
                        const currentLi = Number(liToChange.innerText)
                        if (attributeMethod == "add"){
                            liToChange.innerText = Number(deltaValue) + Number(currentLi)
                        }
                        else if (attributeMethod == "multi"){
                            const dynamicDeltaId = await GetDBElements("Policy_Effect","dynamic_attribute_id","policy_effect_id",effectId)[0]
                            const dynamicDelta = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",dynamicDeltaId)[0]
                            liToChange.innerText = (Number(deltaValue) * dynamicDelta)  + Number(currentLi)
                        }
                        if (repeats.hasOwnProperty(policyTag)){
                            policyTag = repeats[policyTag]
                            allIdsDone = false
                        }
                    }while(!allIdsDone)
                }
            }
        }
    }

    const serviceBuildings = await GetDBElements("Service_Building","building_id",null,null)
    for (const employerId of await GetDBElements("Employer","employer_listing_id",null,null)){
        const buildingId = await GetDBElements("Employer","building_id","employer_listing_id",employerId)[0]
        if (!serviceBuildings.includes(buildingId)){
            continue
        }
        const jobId = await GetDBElements("Employer","job_id","employer_listing_id",employerId)[0]
        const deltaValue = Number(await GetDBElements("Job","wage","job_id",jobId)[0]) * -1
        const modelId = await GetDBElements("Service_Building","service_building_model_id","building_id",buildingId)[0]
        const policyTag = await GetDBElements("Service_Building_Model","category","service_building_model_id",modelId)[0]
        let allIdsDone = true
        do{
            allIdsDone = true
            const liToChange = document.getElementById(policyTag + "Cost")
            const currentLi = Number(liToChange.innerText)
            liToChange.innerText = Number(deltaValue) + Number(currentLi)
            if (repeats.hasOwnProperty(policyTag)){
                policyTag = repeats[policyTag]
                allIdsDone = false
            }
        }while(!allIdsDone)
    }

    const attributeIds = [200,202,204,206,216,218,220,222,224]
    for (const attribute of attributeIds){
        let element = document.getElementById("Value"+String(attribute))
        let production = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",attribute)[0]
        let demand = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",Number(attribute) + 1)[0]
        let profit = production - demand
        if (profit < 0){
            element.style.color = "#FF0000"
        }
        else{
            element.style.color = "#000000"
        }
        element.innerHTML = Math.round(100 *profit) / 100

        element = document.getElementById("Status"+String(attribute))
        if (profit < 0){
            element.innerHTML+= "There is a deficit"
            element.style.color = "#FF0000"
        }
        else{
            element.innerHTML+= "There is not a deficit"
            element.style.color = "#000000"
        }

    }
}

async function Tutorial (){
    const tutorialToDo = await GetDBElements("Tutorial","tutorial_id","completed",0);
    
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
    if (GetDBElementsDoubleCondition("Policy_Collection","policy_collection_id","policy_id",11,"policy_active",1).length == 0){
        WindowPopUp(`
        <div class="window" id="Form" style="width: 350px">
            <div class="title-bar" id="FormHeader">
                <div class="title-bar-text">Window Error!</div>
                <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button> 
                </div>
            </div>
            <div class="window-body" id="FormContent" style="max-height:600px; overflow-y:auto">
            <h2>Currently, there is no data on your city.</h2>
            <hr>
            <h4>To fix this, try to implement a city census HQ into your city to gather more data</h4>
            </div>
        </div>`,
        `Form`,`Desktop`)
        return
    }
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
        <div class="window-body" id="FormContent" style="max-height:600px; overflow-y:auto">
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
            <h4>Info Table</h4><br>
            <div class="sunken-panel" style="min-height:120px ; max-height: 250px; width: 85%; margin-left: 5%">
                <table class="interactive" id="CitizenCensusTable">
                </table>
            </div>
            <hr>
            <h4>Id search</h4>
            <div class="field-row">
                <label for="citizenIdBox">ID:</label>
                <input id="citizenIdBox" type="text" />
            </div>
            <button onclick="SearchCitizen(document.getElementById('citizenIdBox').value)">Search</button>
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
    const citizenParameters = ["citizen_id","name","parent_id","turn_of_birth","money","residential_id","education_weeks","happiness"]
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
        arrayToPush.push(object.getHappiness())
        citizenDataArray.push(arrayToPush)
    }
    InsertTable("CitizenCensusTable",citizenDataArray)
}

async function SearchCitizen(id){    
    if (id == null){
        WindowPopUp(`
        <div class="window" id="Form" style="width: 350px">
            <div class="title-bar" id="FormHeader">
                <div class="title-bar-text">Window Error!</div>
                <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button> 
                </div>
            </div>
            <div class="window-body" id="FormContent" style="max-height:600px; overflow-y:auto">
            <h2>Invalid Id inserted</h2>
            </div>
        </div>`,
        `Form`,`Desktop`)
    }
    else if (await GetDBElements("Citizen","citizen_id","citizen_id",id)[0] != null){
        const citizen = await LoadObject.constructCitizen(id)
        let jobId = await GetDBElements("Employer","job_id","citizen_id",id)[0]
        let jobTitle = "currently unemployed"
        let jobPlaceName = "home"
        if (jobId != null){
            jobTitle = await GetDBElements("Job","name","job_id",jobId)[0]
            let workPlaceId =  await GetDBElements("Employer","building_id","job_id",jobId)[0]
            jobPlaceName = await GetDBElements("Building","name","building_id",workPlaceId)[0]
        }
        WindowPopUp(`
        <div class="window" id="Form" style="width: 350px">
            <div class="title-bar" id="FormHeader">
                <div class="title-bar-text">Window Error!</div>
                <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button> 
                </div>
            </div>
            <div class="window-body" id="FormContent" style="max-height:600px; overflow-y:auto">
            <h2>Citizen Search</h2>
            <h4>` + citizen.getName() + `</h4>
            <hr>
            <p>` + citizen.getName() + ` is ` + jobTitle + ` at ` + jobPlaceName + `</p>
            <p>They have ` + citizen.getMoney() + GetDBElements("City","money_symbol",null,null)[0] + `</p>
            <p>They have a happiness score of ` + citizen.getHappiness() + `<p>
            </div>
        </div>`,
        `Form`,`Desktop`)
        return
    }
}

async function PrivateSector (){
    if (GetDBElementsDoubleCondition("Policy_Collection","policy_collection_id","policy_id",12,"policy_active",1).length == 0){
        WindowPopUp(`
        <div class="window" id="Form" style="width: 350px">
            <div class="title-bar" id="FormHeader">
                <div class="title-bar-text">Window Error!</div>
                <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button> 
                </div>
            </div>
            <div class="window-body" id="FormContent" style="max-height:600px; overflow-y:auto">
            <h2>Currently, there is no data on your city.</h2>
            <hr>
            <h4>To fix this, try to implement a Taxes HQ into your city to gather more data</h4>
            </div>
        </div>`,
        `Form`,`Desktop`)
        return
    }

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
        <div class="window-body" id="FormContent" style="max-height:600px; overflow-y:auto">
            <h4>Industrial Table</h4>
            <div class="sunken-panel" style="min-height:120px ; max-height: 250px; width: 85%; margin-left: 5%">
                <table class="interactive" id="IndustrialCensusTable">
                </table>
            </div>
            <hr>
            <h4>Commercial Table</h4>
            <div class="sunken-panel" style="min-height:120px ; max-height: 250px; width: 85%; margin-left: 5%">
                <table class="interactive" id="CommercialCensusTable">
                </table>
            </div>
            <hr>
            <h4>Residential Table</h4>
            <div class="sunken-panel" style="min-height:120px ; max-height: 250px; width: 85%; margin-left: 5%">
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
    const commercialParameters = ["commercial_id","name","building_id","commercial_model_id","type","money"]

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
        arrayToPush.push(object.getType())
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

async function Finance(){
    const cityName = await GetDBElements("City","name","city_id",1) 
    const currency = await GetDBElements("City","money_symbol","city_id",1)
    await WindowPopUp(`
    <div class="window" id="Form" style="width: 350px;">
        <div class="title-bar" id="FormHeader">
            <div class="title-bar-text">Finances for: `+ cityName +`</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button> 
            </div>
        </div>
        <div class="window-body" id="FormContent" style="max-height:55vh;">
            <h3>The exchange rate</h3>
            <p>Currently the exchange rate for ` + currency + ` to § is:<br> 100: 1</p>
            <button onclick="exchange(100)">Exchange ` + currency + `100 into incre</button>
            <button onclick="exchange(1000)">Exchange ` + currency + `1,000 into incre</button>
            <button onclick="exchange(10000)">Exchange ` + currency + `10,000 into incre</button>
            <hr>
            <h3> Taxes </h3>
            <br>
            <div class="field-row" style="width: 300px">
                <label for="restax">Residential:</label>
                <label for="restax">0%</label>
                <input id="restax" type="range" min="0" max="0.25" value="0.08" step="0.01" oninput="document.getElementById('restaxval').textContent = Round(this.value * 100,0) + '%'; UpdateDB('City_Attribute','attribute_value',this.value,'city_attribute_id',900);"/>
                <label for="restax">25%</label>
            </div>
            <p id="restaxval"></p>
            <br>
            <div class="field-row" style="width: 300px">
                <label for="comtax">Commercial:</label>
                <label for="comtax">0%</label>
                <input id="comtax" type="range" min="0" max="0.25" value="0.08" step="0.01" oninput="document.getElementById('comtaxval').textContent = Round(this.value * 100,0) + '%'; UpdateDB('City_Attribute','attribute_value',this.value,'city_attribute_id',906);"/>
                <label for="comtax">25%</label>
            </div>
            <p id="comtaxval"></p>
            <br>
            <div class="field-row" style="width: 300px">
                <label for="indtax">Industrial:</label>
                <label for="indtax">0%</label>
                <input id="indtax" type="range" min="0" max="0.25" value="0.08" step="0.01" oninput="document.getElementById('indtaxval').textContent = Round(this.value * 100,0) + '%'; UpdateDB('City_Attribute','attribute_value',this.value,'city_attribute_id',909);"/>
                <label for="indtax">25%</label>
            </div>
            <p id="indtaxval"></p>
        </div>
    </div>
    `, "Form","Desktop")

    const restaxval = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",900);
    document.getElementById('restaxval').textContent = restaxval * 100 + '%';
    document.getElementById('restax').value = restaxval;
    const comtaxval = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",906);
    document.getElementById('comtaxval').textContent = comtaxval * 100 + '%';
    document.getElementById('comtax').value = restaxval;
    const indtaxval = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",909);
    document.getElementById('indtaxval').textContent = indtaxval * 100 + '%';
    document.getElementById('indtax').value = indtaxval;
}

async function exchange(money){
    await UpdateAddDB("City_Attribute","attribute_value",-Number(money),"city_attribute_id",3)
    await UpdateAddDB("City_Attribute","attribute_value",Round(Number(money/100),0),"city_attribute_id",4)
    await PrepareDesktop()
}

async function StatusCongratulations(){
    const cityName = await GetDBElements('City','name','city_id',1)
    const status = await GetDBElements('City','status','city_id',1)
    
    await WindowPopUp(`
        <div class="window" id="Form" style="width: 350px">
            <div class="title-bar" id="FormHeader">
                <div class="title-bar-text"> Status Update </div>
                <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button>
                </div>
            </div>
            <div class="window-body" id="FormContent">
                <h3>Congratulations! ` + cityName + ` has just been awarded a new status title of...</h3>
                <hr>
                <h3>` + status + `</h3>
            </div>
        </div>
    `,"Form","Desktop")
}

async function SimulationPreview(){
    await WindowPopUp(`
    <div class="window" id="Form" style="width: 350px;">
        <div class="title-bar" id="FormHeader">
            <div class="title-bar-text">Simulation</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button> 
            </div>
        </div>
        <div class="window-body" id="FormContent" style="max-height:55vh;">
            <h3>Enter duration of your simulation</h3>
            <p>(Tip: in early game you need all the fine tuning you can do, so it is best to only simulation for 1 cycle/ 1 week)</p>
            <br>
            <div class="field-row">
                <label for="cycleDuration">Cycles/ Weeks:</label>
                <input id="cycleDuration" type="text" />
                <input onclick="Simulation(document.getElementById('cycleDuration').value)" type="submit" />
            </div>
        </div>
    </div>
    `, "Form","Desktop")
}

async function Simulation (cycles){
    cycles = Number(cycles)
    if (cycles == 0 || cycles > 52){
        return
    }
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
    await simulateCity(cycles)
}

const tutorialUpdate = new Audio('Assets/Audio/TutorialUpdate.wav');
function UpdateTutorial (){
    const tutorialToDo = GetDBElements("Tutorial","tutorial_id","completed",0);
    
    let tutorialToDoPick = 1;
    if (tutorialToDo.length == 0){
        tutorialToDoPick = 0;
    }

    let tutorialPercentage = "Completed";
    if (tutorialToDo.length > 0){
        tutorialPercentage = FormattedNumber((tutorialToDo[tutorialToDoPick] - 1)/(Math.max.apply(Math,GetDBElements("Tutorial","tutorial_id",null,null)) - 1) * 100, 'percentage') + "%"
    }

    /*
    if (GetDBElements("Tutorial","tutorial_title","tutorial_id",tutorialToDo[tutorialToDoPick]) !== document.getElementById("TutorialHeader").innerHTML){
        tutorialUpdate.play();
    }*/
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
    tryLog(id + " is popping up")
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

//This has to be done to ensure that the other js files are loaded
const clickSound = new Audio('Assets/Audio/click.wav');
window.addEventListener('load', function() {
    document.addEventListener('click', function(event) {
      if (event.target.tagName.toLowerCase() === 'button') {
        clickSound.play();
      }
      if (event.target.className.toLowerCase() === 'activation') {
        clickSound.play();
      }
  });

  Debug()
})

function VolumeUpdate(volumeToInput) {
    tryLog(volumeToInput)
  tutorialUpdate.volume = volumeToInput
  activatedSfx.volume = volumeToInput
  warnSfx.volume = volumeToInput
  clickSound.volume = volumeToInput
}

async function Docs(){        
    WindowPopUp(`
        <div class="window" id="Form" style="width: 350px">
            <div class="title-bar" id="FormHeader">
                <div class="title-bar-text">Window Error!</div>
                <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button> 
                </div>
            </div>
            <div class="window-body" id="FormContent" style="max-height:600px; overflow-y:auto">
            <h2>To be finalised...</h2>
            <hr>
            <h4>Uh oh! This is underdevelopment</h4>
            </div>
        </div>`,
        `Form`,`Desktop`)
}

async function News(){        
    WindowPopUp(`
        <div class="window" id="Form" style="width: 350px">
            <div class="title-bar" id="FormHeader">
                <div class="title-bar-text">Window Error!</div>
                <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close" onclick="document.getElementById('Form').remove()"></button> 
                </div>
            </div>
            <div class="window-body" id="FormContent" style="max-height:600px; overflow-y:auto">
            <h2>To be finalised...</h2>
            <hr>
            <h4>Uh oh! This is underdevelopment</h4>
            </div>
        </div>`,
        `Form`,`Desktop`)
}
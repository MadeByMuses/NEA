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
        <button onclick="ExportDB()">Export</button>
        </div>
    </div>
    `, "Form","Desktop")
}

function Overview(){
    const cityName = GetDBElement("City","name",null,null) 
    WindowPopUp(`
    <div class="window" id="OverviewWindow" style="width: 350px">
        <div class="title-bar" id="OverviewWindowHeader">
            <div class="title-bar-text">`+ cityName +`</div>
            <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('OverviewWindow').remove()"></button>
            </div>
        </div>
        <div class="window-body" id="OverviewWindowContent">
            <p>The current data of ` + cityName + `:</p>
            <div class="field-row">
                <input id="OverviewWindowRadioPopulation" type="radio" name="OverviewWindow">
                <label for="OverviewWindowRadioPopulation">` + GetDBElement("City_Attribute","attribute_name","city_attribute_id",2) + `</label>
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
            infoTextHeading = GetDBElement("City_Attribute","attribute_name","city_attribute_id",2)
            infoTextDescription = GetDBElement("City_Attribute","attribute_description","city_attribute_id",2)
            infoTextValue = GetDBElement("City_Attribute","attribute_value","city_attribute_id",2)
            break
    }
    document.getElementById("OverviewWindowContentResponse").innerHTML += `<h3>` + infoTextHeading + `</h3><p>` + infoTextDescription + `</p><br><h4 style="margin-top:0px">`+ infoTextValue +`</h4>`
}

async function WindowPopUpAdd(innerHTML,Source){
    document.getElementById(Source).innerHTML += innerHTML
    return;
}

async function WindowPopUp(innerHTML,id,Source){
    if (document.getElementById(id)){
     document.getElementById(id).remove()
    }
    console.log(id + " is popping up")
    await WindowPopUpAdd(innerHTML,Source);
    DragElement(document.getElementById(id));
}
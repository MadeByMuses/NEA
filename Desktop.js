function Overview(){
    const cityName = GetCityElement("Name") 
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
                <label for="OverviewWindowRadioPopulation">Population</label>
            </div>
            <div class="field-row">
                <input id="OverviewWindowRadioRevenue" type="radio" name="OverviewWindow">
                <label for="OverviewWindowRadioRevenue">Revenue</label>
            </div>
            <div class="field-row">
                <input disabled id="OverviewWindowRadioPolicyCount" type="radio" name="OverviewWindow">
                <label for="OverviewWindowRadioPolicyCount">Amount of policies collected</label>
            </div>
        </div>
    </div>
    `, "OverviewWindow","Desktop")
}

async function WindowPopUpAdd(innerHTML,Source){
    document.getElementById(Source).innerHTML += innerHTML
    return;
}

async function WindowPopUp(innerHTML,id,Source){
    console.log(id + " is popping up")
    await WindowPopUpAdd(innerHTML,Source);
    DragElement(document.getElementById(id));
}
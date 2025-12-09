async function simulateCity(){    
    for (let i = 0; i < 1; i++){
        document.getElementById('SimulationBlockerHeader').innerHTML = 'Simulating - ' + await GetGameDate(1)
        updateProgressBars(0,"",0,"")
        await resetCityAttributes()
        //10 
        await demandCalculations()
        //4
        await creationPolicySimulation()
        //10
        await industrialSimulation()
        //19
        await commercialSimulation()
        //19
        await residentialSimulation()
        //19
        await citizenSimulation()
        //19
        await UpdateDB("City_Attribute","attribute_value",await GetDBElements("City_Attribute","attribute_value","city_attribute_id",1)[0] + 1,"city_attribute_id",1)
        
        updateProgressBars(100,"Completed all tasks",100,"Returning to simulation screen")
    }
        printTable("Employer")
        printTable("Industrial")
        printTable("Commercial")
        printTable("Inventory")
        printTable("Citizen")
        printTable("Residential")
        printTable("Group_Collection")
        printTable("Group_Residential_Collection")
        printTable("Building")
    document.getElementById('SimulationBlocker').remove()
} 

async function resetCityAttributes(){
    let counter = 0
    const attributeIds = GetDBElements("City_attribute","city_attribute_id","clear_on_simulation",1)
    const total = attributeIds.length
    for (const id of attributeIds){
        counter++
        await updateProgressBars(10*(counter/total),"Reseting city attribute values",100 * (counter/total), String(await GetDBElements("City_attribute","attribute_name","city_attribute_id",id)) + " is being reset")
        await UpdateDB("City_Attribute","attribute_value",0,"city_attribute_id",id)
    }
}

async function demandCalculations(){
    if (GetDBElements("Citizen","citizen_id",null,null).length === 0){
        UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",106)
    }
    await updateProgressBars(10 + (4*(1)),"Calculating demand",(100), "")
}

async function creationPolicySimulation(){
    const policies = GetDBElements("Policy_Collection","policy_id","policy_active",1);
    let attributeIteration = 0;
    const total = policies.length
    for (const policy of policies){
        attributeIteration++;
        await updateProgressBars(14 + (10 * (attributeIteration/total)),"Implementing policies",100 * (attributeIteration/total), "Calculating: " + String(await GetDBElements("Policy","policy_name","policy_id",policy)[0]))
        const effects = GetDBElements("Policy_Effect","policy_effect_id","policy_id",policy);
        for (const effect of effects){
            switch (GetDBElements("Policy_Effect","method","policy_effect_id",effect).toString().toLowerCase()){
                case "add":
                case "addition":
                case "+":
                    UpdateDB("City_Attribute",
                        "attribute_value",
                        Number(
                            GetDBElements("City_Attribute",
                                "attribute_value",
                                "city_attribute_id",
                                GetDBElements("Policy_Effect",
                                    "city_attribute_id",
                                    "policy_effect_id",
                                    effect
                                )
                            )
                        )+
                        Number(
                            GetDBElements("Policy_Effect",
                                "delta_value",
                                "policy_effect_id",
                                effect
                            )
                        ),
                        "city_attribute_id",
                        GetDBElements(
                            "Policy_Effect",
                            "city_attribute_id",
                            "policy_effect_id",
                            effect
                        )
                    )
                    break;
                case `sub`,`subtract`,`-`:
                    UpdateDB("City_Attribute",
                        "attribute_value",
                        Number(
                            GetDBElements("City_Attribute",
                                "attribute_value",
                                "city_attribute_id",
                                GetDBElements("Policy_Effect",
                                    "city_attribute_id",
                                    "policy_effect_id",
                                    effect
                                )
                            )
                        )+
                        Number(
                            GetDBElements("Policy_Effect",
                                "delta_value",
                                "policy_effect_id",
                                effect
                            )
                        ),
                        "city_attribute_id",
                        GetDBElements(
                            "Policy_Effect",
                            "city_attribute_id",
                            "policy_effect_id",
                            effect
                        )
                    )
                    break;
            }
            //await new Promise(res => setTimeout(res, 10));
        }
    }
}

async function industrialSimulation(){

    let attributeIds = {
        16:0,
        17:0,
        21:0
    }

    let industrialBuildings = []
    const currentIndustrialIds = GetDBElements('Industrial','industrial_id',null,null)
    let currentIndustrialModelsMaterials = []
    let availableIndustrialModelsMaterials = []

    for (const id of currentIndustrialIds){
        const building = await LoadObject.constructIndustrial(id)
        industrialBuildings.push([building,await building.getOrderIndex()])
        attributeIds[await building.getStockMadeMaterialId()] -= 1
    }

    for (let id of Object.keys(attributeIds)){
        const count = GetDBElements('City_Attribute','attribute_value','city_attribute_id',id)[0]
        attributeIds[id] += count
    }


    let potentialIndustrialModelsMaterial = []
    for (const[key,value] of Object.entries(attributeIds)){
        for (let i = 0; i < value; i++){
            potentialIndustrialModelsMaterial.push(Number(key) - 15)
        }
    }

    if (potentialIndustrialModelsMaterial == null){
        return
    }
    potentialIndustrialModelsMaterial = await SortingObject.shuffle(potentialIndustrialModelsMaterial)
    const loopLength = potentialIndustrialModelsMaterial.length
    const chance = 1
    for (let i = 0; i < loopLength; i++){
        if (Math.random() <= chance){
            console.log(potentialIndustrialModelsMaterial)
            const chosenMaterial = potentialIndustrialModelsMaterial.pop()
                /*potentialIndustrialModelsMaterial.forEach(function(entry) {
                    console.log(entry);
                });
            console.log(chosenMaterial)*/
            const building = await industrialSimulationCreateRandomiser(chosenMaterial)
            industrialBuildings.push([building,await building.getOrderIndex()])
        }
    }


    /*industrialBuildings.forEach(function(entry) {
        console.log(entry);
    });*/

    let industrialIteration = 0
    const total = industrialBuildings.length
    industrialBuildings = await SortingObject.mergeSort(industrialBuildings,1)
    for (let industrial of industrialBuildings){
        industrial = industrial[0]
        industrialIteration++
        await industrial.simulate()
        await industrial.save()
        updateProgressBars(24 + (19*(industrialIteration/total)),"Simulating Industrial", 100 * (industrialIteration/total), "Simulating " + industrial.getName() + ": ")
    }
}

async function industrialSimulationCreateRandomiser(materialId){
    const possibleModels = GetDBElements('Industrial_Model','industrial_model_id','stock_made_material_id',Number(materialId))
    let industrialBuilding = await (new Industrial(null,null,null,possibleModels[Math.floor(Math.random() * possibleModels.length)],2000))
    await industrialBuilding.init()
    return industrialBuilding
}

async function commercialSimulation(){
    const currentLowerCommercialAmount = GetDBElements('Commercial','commercial_id',null,null).length
    const deltaLowerCommercialAmount = GetDBElements('City_Attribute','attribute_value','city_attribute_id',14) - currentLowerCommercialAmount

    let commercialBuidlings = []

    const commercialBuildingsIds = GetDBElements('Commercial','commercial_id',null,null)

    for (id of commercialBuildingsIds){
        commercialBuidlings.push(await LoadObject.constructCommercial(id))
    }

    if (currentLowerCommercialAmount == 0){
        const regularModelIds = GetDBElements('Commercial_Model','commercial_model_id','type','regular')
        for (let i = 0; i < deltaLowerCommercialAmount; i++){
            const id = regularModelIds[Math.floor(Math.random() * regularModelIds.length)]
            const building = await new Commercial(null,null,null,id,0,1000)
            await building.init()
            commercialBuidlings.push(building)
        }
    }
    
    /*
    else{
        for (let i = 0; i < deltaLowerCommercialAmount; i++){

        }
    }*/

    let commercialIteration = 0
    const total = commercialBuidlings.length
    for (commercial of commercialBuidlings){
        await commercial.simulate()
        await commercial.save()
        commercialIteration++
        updateProgressBars(43 + (19*(commercialIteration/total)),"Simulating Industrial", 100 * (commercialIteration/total), "Simulating " + commercial.getName() + ": ")
    }
}

async function residentialSimulation(){
    const types = ['budget','lower','middle','upper','lowrent','affordable','regular','luxury']
    let residentialBuildings = []

    const residentialBuildingsIds = GetDBElements('Residential','residential_id',null,null)

    for (id of residentialBuildingsIds){
        residentialBuildings.push(await LoadObject.constructResidential(id))
    }

    for (type of types){
        const residentialBuildingsTypeExclusive = await residentialSimulationCreateRandomiser(type)
        //returns as an array so you have to insert each element individually otherwise it is a freaky 2D array :P
        for (residentialBuildingTypeExclusive of residentialBuildingsTypeExclusive)
        {
            residentialBuildings.push(residentialBuildingTypeExclusive)
        }
    }

    //Below is debug for seeing each element in the array
    /*
    residentialBuildings.forEach(function(entry) {
        console.log(entry);
    });*/


    let residentialIteration = 0
    const total = residentialBuildings.length
    for (residentialBuilding of residentialBuildings){
        residentialBuilding.simulate()
        residentialBuilding.save()
        updateProgressBars(62 + (19*(residentialIteration/total)),"Simulating Residential", 100 * (residentialIteration/total), "Simulating " + residentialBuilding.getName() + ": ")
    }
}

async function residentialSimulationCreateRandomiser(type){
    let numberOfResidentialAccomodation = 0
    //models based off type (not called class cause class is already a 'thing' with OOP)
    let models = GetDBElements('Residential_Model','residential_model_id','type',type)
    let residentialBuidlings = []

    //add each number of residential buildings that have that model in the type/ class
    for (model of models){
        numberOfResidentialAccomodation += Number(GetDBElements("Residential","residential_id","residential_model_id",model).length)
    }
    for (let n = 0; n < ( GetDBElements('City_Attribute','attribute_value','attribute_key_word',String(type+'c')) - numberOfResidentialAccomodation); n++){
        if (Math.random() * 100 <= GetDBElements("City_Attribute","attribute_value","attribute_key_word",String(type+'d'))){
            let residentialBuilding = null
            const model = models[Math.floor(models.length * Math.random())]

            //add object based on its type/ class
            switch (type){
                case 'budget':
                    residentialBuilding = await new ResidentialBudget(null,null,null,model,null)
                    break
                case 'lower':
                    residentialBuilding = new ResidentialLower(null,null,null,model,null)
                    break
                case 'middle':
                    residentialBuilding = new ResidentialLower(null,null,null,model,null)
                    break
                case 'upper':
                    residentialBuilding = new ResidentialLower(null,null,null,model,null)
                    break
                case 'affordable':
                    residentialBuilding = new ResidentialLower(null,null,null,model,null)
                    break
                case 'regular':
                    residentialBuilding = new ResidentialLower(null,null,null,model,null)
                    break
                case 'luxury':
                    residentialBuilding = new ResidentialLower(null,null,null,model,null)
                    break
            }
            await residentialBuilding.init()
            residentialBuidlings.push(residentialBuilding)
        }
    }
    return residentialBuidlings
}

async function citizenSimulation(){
    const standardOfLiving = 500
    const citizenIds = GetDBElements("Citizen","citizen_id",null,null)

    let citizens = []
    for (citizenId of citizenIds){
        citizens.push(await LoadObject.constructCitizen(citizenId))
    }
    const happiness = 0.9
    //f(h) = 3.1log(h) {h in Real: 0<= h <=1}
    const chance = Math.log10(happiness + 1)*(3.1)

    //get the population that needs to be topped up
    const possibleGroupPopulationResidentialModelId = GetDBElements("Residential","residential_model_id",null,null)
    let possibleGroupPopulation = 0
    for (residentialId of possibleGroupPopulationResidentialModelId){
        possibleGroupPopulation += GetDBElements("Residential_Model","max_groups","residential_model_id",residentialId)[0] || 0;
    }
    const actualGroupPopulationList = GetDBElements("Group_Collection","group_id",null,null)
    const actualGroupPopulation = actualGroupPopulationList.length

    const potentialdeltaGroupPopulation =  possibleGroupPopulation - actualGroupPopulation

    const turn = await GetDBElements('City_Attribute','attribute_value','city_attribute_id','1')
    for (let i = 0; i < potentialdeltaGroupPopulation; i++){
        const assignedRandomValue = Math.random()
        if (assignedRandomValue <= chance){
            const citizen = await new Citizen(null,null,null,null,turn - Math.floor(((Math.random() * 20) + 20)*52),standardOfLiving * 0.7,null,Math.floor(Math.random()*52*2) + 26)
            await citizen.init()
            citizens.push(citizen)
        }
    }

    let citizenIteration = 0
    const total = citizens.length
    for (citizen of citizens){
        citizenIteration++
        await citizen.simulate()
        await citizen.save()
        updateProgressBars(81 + (19*(citizenIteration/total)),"Simulating Citizen", 100 * (citizenIteration/total), "Simulating " + citizen.getName() + ": ")
    }
}

async function updateProgressBars(progress, text, specificProgress, specificText){
    const SimulationProgressBarsDetailSpecificsProgressIndicator = document.getElementById("SimulationProgressBarsDetailSpecificsProgressIndicator")
    const SimulationProgressBarsDetailSpecifics = document.getElementById("SimulationProgressBarsDetailSpecifics")
    const SimulationProgressBarsDetail = document.getElementById("SimulationProgressBarsDetail")
    const SimulationProgressBarsDetailProgressIndicator = document.getElementById("SimulationProgressBarsDetailProgressIndicator")

    SimulationProgressBarsDetail.innerHTML = text
    SimulationProgressBarsDetailProgressIndicator.style.width = (progress) + "%"
    SimulationProgressBarsDetailSpecifics.innerHTML = specificText
    SimulationProgressBarsDetailSpecificsProgressIndicator.style.width = (specificProgress) + "%"

    await new Promise(r => setTimeout(r));
}
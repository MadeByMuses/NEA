async function simulateCity(loop){
    for (let i = 0; i < loop; i++){
        await resetCityAttributes()
        await demandCalculations()
        await creationPolicySimulation()
        await industrialSimulation()
        await commercialSimulation()
        await residentialSimulation()
        await citizenSimulation()
    }
} 

async function creationPolicySimulation(){
    //document elements
    //policies to use
    const policies = GetDBElements("Policy_Collection","policy_id","policy_active",1);
    let attribute_iteration = 0;
    for (policy of policies){
        attribute_iteration++;
        SimulationProgressBarsDetail.innerHTML = "Implementing policies";
        SimulationProgressBarsDetailProgressIndicator.style.width = "5%";
        SimulationProgressBarsDetailSpecificsProgressIndicator.style.width = (attribute_iteration/policies.length) * 100 + "%";
        SimulationProgressBarsDetailSpecifics.innerHTML = "Calculating: " + GetDBElements("Policy","policy_name","policy_id",policy);
        const effects = GetDBElements("Policy_Effect","policy_effect_id","policy_id",policy);
        for (effect of effects){
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
            await new Promise(res => setTimeout(res, 10));
        }
    }
}

async function resetCityAttributes(){
    let attribute_iteration = 0
    const attribute_ids = GetDBElements("City_attribute","city_attribute_id","clear_on_simulation",1)
    document.getElementById("SimulationProgressBarsDetail").innerHTML = "Setting Up Simulations"
    for (attribute of attribute_ids){
        attribute_iteration++;
        SimulationProgressBarsDetailSpecificsProgressIndicator.style.width = (attribute_iteration/attribute_ids.length) * 100 + "%";
        SimulationProgressBarsDetailSpecifics.innerHTML = "Preparing: " + GetDBElements("City_Attribute","attribute_name","city_attribute_id",attribute)
        UpdateDB("City_Attribute","attribute_value",0,"city_attribute_id",attribute)
    }
}

function demandCalculations(){
    if (GetDBElements("Citizen","citizen_id",null,null).length === 0){
        UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",106)
    }
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
            const building = await new Commercial(null,null,null,id,0,0,10000)
            await building.init()
            commercialBuidlings.push(building)
        }
    }
    
    /*
    else{
        for (let i = 0; i < deltaLowerCommercialAmount; i++){

        }
    }*/

    for (object of commercialBuidlings){
        object.simulate()
        object.save()
    }
}

async function industrialSimulation(){
    let industrialBuildings = []
    const currentIndustrialIds = GetDBElements('Industrial','industrial_id',null,null)
    let currentIndustrialModelsMaterials = []
    let availableIndustrialModelsMaterials = []
    for (id of currentIndustrialIds){
        const building = (await LoadObject.constructIndustrial(id)).init()
        industrialBuildings.push(building)
        currentIndustrialModelsMaterials.push(building.getStockMadeMaterialId())
    }
    const attributeIds = [16,17]

    for (id of attributeIds){
        const loop = GetDBElements('City_Attribute','attribute_value','city_attribute_id',id).length
        for (let i = 0; i < loop; i++){
            availableIndustrialModelsMaterials.push(id-15)
        }
    }       

    let potentialIndustrialModelsMaterial = availableIndustrialModelsMaterials.filter(id => !currentIndustrialModelsMaterials.includes(id));

    const chance = 1
    if (Math.random() <= chance){
        const chosenMaterial = potentialIndustrialModelsMaterial[Math.floor(Math.random() * potentialIndustrialModelsMaterial.length)]
            potentialIndustrialModelsMaterial.forEach(function(entry) {
                console.log(entry);
            });
        console.log(chosenMaterial)
        potentialIndustrialModelsMaterial.splice(potentialIndustrialModelsMaterial.indexOf(chosenMaterial),1)
        industrialBuildings.push(await industrialSimulationCreateRandomiser(chosenMaterial))
    }


    industrialBuildings.forEach(function(entry) {
        console.log(entry);
    });

    for (const industrial of industrialBuildings){
        industrial.save()
    }
}

async function industrialSimulationCreateRandomiser(materialId){
    const possibleModels = GetDBElements('Industrial_Model','industrial_model_id','stock_made_material_id',materialId)
    let industrialBuilding = await (new Industrial(null,null,null,possibleModels[Math.floor(Math.random() * possibleModels.length)],null,2000))
    await industrialBuilding.init()
    return industrialBuilding
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


    for (residentialBuilding of residentialBuildings){
        residentialBuilding.simulate()
        residentialBuilding.save()
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
        citizens.push(LoadObject.constructCitizen(citizenId))
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
            const citizen = await new Citizen(null,null,null,null,turn,standardOfLiving * 0.7,null,Math.floor(Math.random()*52*2) + 26)
            await citizen.init()
            citizens.push(citizen)
        }
    }

    for (citizen of citizens){
        await citizen.simulate()
        await citizen.save()
    }

    printTable('Citizen')
    printTable('Commercial')
    printTable('Group_Collection')
    printTable('Group_Residential_Collection')
    printTable('Residential')
    printTable('Building')
    printTable('Industrial')
    printTable('Employer')
}
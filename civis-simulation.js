async function simulateCity(cycles){    
    for (let i = 0; i < cycles; i++){
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
        await UpdateAddDB("City_Attribute","attribute_value",1,"city_attribute_id",1)
        await UpdateDB("City_Attribute","attribute_value",(await GetDBElements("Citizen","citizen_id",null,null)).length,"city_attribute_id",2)  
        await UpdateDB("City_Attribute","attribute_value",await GetGlobalHappiness(), "city_attribute_id",14)
        updateProgressBars(100,"Completed all tasks",100,"Returning to simulation screen")
    }



    await checkCityStatus()
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
    PrepareDesktop()
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

    //reset happiness
    await UpdateDB("Citizen","happiness",100,null,null)

    //reset service buildings 
    const policyCollectionIds = await GetDBElements("Service_Building","policy_collection_id",null,null)
    for (id of policyCollectionIds){
        //printTable("Service_Building")
        //printTable("Policy_Collection")
        const clearCollectionId = await GetDBElementsDoubleCondition("Policy_Collection","policy_collection_id","policy_collection_id",id,"policy_active",0)[0]
        if (clearCollectionId != null){
            const serviceId = await GetDBElements("Service_Building","service_building_id","policy_collection_id",clearCollectionId)
            const serviceBuilding = await LoadObject.constructService(serviceId)
            await serviceBuilding.deleteObject()
        }
    }
}

async function demandCalculations(){
    await UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",106)
    await UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",107)
    await UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",108)
    await UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",109)
    await UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",110)
    await UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",111)
    await UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",112)
    await UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",113)
    await updateProgressBars(10 + (4*(1)),"Calculating demand",(100), "")
}

async function creationPolicySimulation(){
    const collections = await GetDBElements("Policy_Collection","policy_collection_id","policy_active",1);
    let attributeIteration = 0;
    const total = collections.length
    let serviceBuildings = []
    const serviceIds = await GetDBElements("Service_Building","service_building_id",null,null)
    for (const id of serviceIds){
        const service = await LoadObject.constructService(id)
        serviceBuildings.push(service)
    }
    for (const collection of collections){
        const policy = await GetDBElements("Policy_Collection","policy_id","policy_collection_id",collection)[0]


        const serviceModelId = await GetDBElements("Service_Building_Model","service_building_model_id","policy_id",policy)[0]

        if (serviceModelId != null){
            const serviceId = await GetDBElements("Service_Building","building_id","policy_collection_id",collection)[0]
            if (serviceId == null){
                const service = await new Service(null,null,null,null,serviceModelId,collection)
                await service.init()
                serviceBuildings.push(service)
            }
        }

        attributeIteration++;
        await updateProgressBars(14 + (10 * (attributeIteration/total)),"Implementing policies",100 * (attributeIteration/total), "Calculating: " + String(await GetDBElements("Policy","policy_name","policy_id",policy)[0]))
        const effects = await GetDBElements("Policy_Effect","policy_effect_id","policy_id",policy);
        for (const effect of effects){
            const attributeId = await GetDBElements("Policy_Effect","city_attribute_id","policy_effect_id",effect)[0]
            let dynamicDelta = 1
            const dynamicDeltaId = await GetDBElements("Policy_Effect","dynamic_attribute_id","policy_effect_id",effect)[0]
            if (dynamicDeltaId != null){
                dynamicDelta = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",dynamicDeltaId)[0]
            }
            switch (await GetDBElements("Policy_Effect","method","policy_effect_id",effect)[0].toString().toLowerCase()){
                case "add":
                    await UpdateDB("City_Attribute", "attribute_value",
                        Number(await GetDBElements("City_Attribute","attribute_value","city_attribute_id",attributeId)[0])+
                        (Number(await GetDBElements("Policy_Effect","delta_value","policy_effect_id",effect)[0]) * dynamicDelta)
                        ,"city_attribute_id",attributeId
                    )
                    break;
                case "multi":
                    await UpdateDB("City_Attribute","attribute_value",
                        Number(await GetDBElements("City_Attribute","attribute_value","city_attribute_id",attributeId)[0])*
                        (Number(await GetDBElements("Policy_Effect","delta_value","policy_effect_id",effect)[0]) * dynamicDelta),
                        "city_attribute_id",attributeId
                    )
                    break;
            }
            //await new Promise(res => setTimeout(res, 10));
        }
    }
    for (const service of serviceBuildings){
        await service.simulate()
        await service.save()
    }
}

async function industrialSimulation(){

    let attributeIds = {
        16:0,
        17:0,
        18:0,
        19:0,
        20:0,
        21:0,
        22:0,
        23:0,
        24:0,
        25:0,
        26:0,
        27:0,
    }

    let industrialBuildings = [[],[],[],[],[]]
    const currentIndustrialIds = GetDBElements('Industrial','industrial_id',null,null)

    for (const id of currentIndustrialIds){
        const building = await LoadObject.constructIndustrial(id)
        industrialBuildings[await building.getOrderIndex()].push(building)
        attributeIds[await building.getStockMadeMaterialId() + 15] -= 1
    }

    for (const id of Object.keys(attributeIds)){
        const count = GetDBElements('City_Attribute','attribute_value','city_attribute_id',id)[0]
        attributeIds[id] += count
    }

    let potentialIndustrialModelsMaterial = []
    for (const[key,value] of Object.entries(attributeIds)){
        for (let i = 0; i < value; i++){
            potentialIndustrialModelsMaterial.push(Number(key) - 15)
        }
    }

    if (potentialIndustrialModelsMaterial != null){
        potentialIndustrialModelsMaterial = await SortingObject.shuffle(potentialIndustrialModelsMaterial)
        const loopLength = potentialIndustrialModelsMaterial.length
        const happiness = await Limit( (await GetDBElements("City_Attribute","attribute_value","city_attribute_id",14)[0]) / 100,0,1)
        //f(h) = 3.1log(h) {h in Real: 0<= h <=1}
        const chance = Math.log10(happiness + 1)*(4)
        for (let i = 0; i < loopLength; i++){
            if (Math.random() <= chance){
                const chosenMaterial = potentialIndustrialModelsMaterial.pop()
                const building = await industrialSimulationCreateRandomiser(chosenMaterial)
                industrialBuildings[await building.getOrderIndex()].push(building)
            }
        }
    }


    let industrialIteration = 0
    const total = industrialBuildings.flat().length
    for (let industrialCategory of industrialBuildings){
        industrialCategory = SortingObject.shuffle(industrialCategory)
        for (const industrial of industrialCategory){
            industrialIteration++
            await industrial.simulate()
            await industrial.save()
            updateProgressBars(24 + (19*(industrialIteration/total)),"Simulating Industrial", 100 * (industrialIteration/total), "Simulating " + industrial.getName() + ": ")
        }
    }
    //incase they got deleted gotta do this seperately

    //sell excess stock internationally
    const industrialIds = GetDBElements("Industrial","industrial_id",null,null)
    for (const id of industrialIds){
        let object = await LoadObject.constructIndustrial(id)
        await object.sellLeftOverStock()
        await object.save()
    }
}

async function industrialSimulationCreateRandomiser(materialId){
    const possibleModels = GetDBElements('Industrial_Model','industrial_model_id','stock_made_material_id',Number(materialId))
    let industrialBuilding = await (new Industrial(null,null,null,possibleModels[Math.floor(Math.random() * possibleModels.length)],2000))
    await industrialBuilding.init()
    return industrialBuilding
}

async function commercialSimulation(){
    const commercialAttributeValues = [300,302,304,306,308,310,312,314,316]
    const commercialTitles = ["essential_early","normal_early","luxury_early","essential_mid","normal_mid","luxury_mid","essential_late","normal_late","luxury_late"]
    let commercialBuidlings = []
    

    for (const id of commercialAttributeValues){
        const goalTitle = commercialTitles[(id-300)/2]
        const alikeModels = await GetDBElements('Commercial_Model','commercial_model_id','category',goalTitle)
        let currentCommercialModels = []
        for (const modelId of alikeModels){
            currentCommercialModels.push(... await GetDBElements('Commercial','commercial_id','commercial_model_id',modelId))
        }
        const currentCommercialModelsAmount = currentCommercialModels.length
        const deltaLowerCommercialAmount = await GetDBElements('City_Attribute','attribute_value','city_attribute_id',id) - currentCommercialModelsAmount

        // you can add the delete thing here if over populated

        for (const realId of currentCommercialModels){
            commercialBuidlings.push(await LoadObject.constructCommercial(realId))
        }

        for (let i = 0; i < deltaLowerCommercialAmount; i++){
            const modelId = alikeModels[Math.floor(Math.random() * alikeModels.length)]
            const building = await new Commercial(null,null,null,modelId,0,25000)
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
    commercialBuidlings = await SortingObject.shuffle(commercialBuidlings)
    for (commercial of commercialBuidlings){
        await commercial.simulate()
        await commercial.save()
        commercialIteration++
        updateProgressBars(43 + (19*(commercialIteration/total)),"Simulating Industrial", 100 * (commercialIteration/total), "Simulating " + commercial.getName() + ": ")
    }
}

async function residentialSimulation(){
    const types = [6,7,8,9,10,11,12,13]
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
    const types = ['budget','lower','middle','upper','lowrent','affordable','regular','luxury']
    //models based off type (not called class cause class is already a 'thing' with OOP)
    let models = GetDBElements('Residential_Model','residential_model_id','type',types[type - 6])
    let residentialBuidlings = []

    //add each number of residential buildings that have that model in the type/ class
    for (model of models){
        numberOfResidentialAccomodation += Number(GetDBElements("Residential","residential_id","residential_model_id",model).length)
    }
    const capacity = await GetDBElements('City_Attribute','attribute_value','city_attribute_id',Number(type)) - numberOfResidentialAccomodation
    for (let n = 0; n < capacity; n++){
        const prob = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",type + 100)
        if (Math.random() * 100 <= prob){
            let residentialBuilding = null
            const model = models[Math.floor(models.length * Math.random())]
            let chosenName = ""
            const names = await loadNames()
            //add object based on its type/ class
            switch (types[type - 6]){
                case 'budget':
                    chosenName = await names.residentialBudgetNames.generate()
                    break
                case 'lower':
                    chosenName = await names.residentialLowerNames.generate()
                    break
                case 'middle':
                    chosenName = await names.residentialBudgetNames.generate()
                    break
                case 'upper':
                    chosenName = await names.residentialBudgetNames.generate()
                    break
                case 'affordable':
                    chosenName = await names.residentialBudgetNames.generate()
                    break
                case 'regular':
                    chosenName = await names.residentialBudgetNames.generate()
                    break
                case 'luxury':
                    chosenName = await names.residentialBudgetNames.generate()
                    break
            }
            residentialBuilding = await new Residential(chosenName,null,null,model,null)
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
    const happiness = await Limit((await GetDBElements("City_Attribute","attribute_value","city_attribute_id",14)[0]) / 100,0,1)
    //f(h) = 3.1log(h) {h in Real: 0<= h <=1}
    const chance = Math.log10(happiness + 1)*(3.1)

    //get the population that needs to be topped up
    const possibleGroupPopulationResidentialModelId = await GetDBElements("Residential","residential_model_id",null,null)
    let possibleGroupPopulation = 0
    for (residentialId of possibleGroupPopulationResidentialModelId){
        possibleGroupPopulation += GetDBElements("Residential_Model","max_groups","residential_model_id",residentialId)[0] || 0;
    }
    const actualGroupPopulationList = await GetDBElements("Group_Collection","group_id",null,null)
    const actualGroupPopulation = actualGroupPopulationList.length

    const potentialdeltaGroupPopulation =  possibleGroupPopulation - actualGroupPopulation

    const turn = await GetDBElements('City_Attribute','attribute_value','city_attribute_id','1')[0]
    for (let i = 0; i < potentialdeltaGroupPopulation; i++){
        const assignedRandomValue = Math.random()
        if (assignedRandomValue <= chance){
            const citizen = await new Citizen(null,null,null,null,turn - Math.floor(((Math.random() * 20) + 20)*52),500 * 0.7,null,Math.floor(Math.random()*52*2) + 26,100)
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

async function checkCityStatus(){
    const populationTitles = [
        ["Isolated Dwelling", 0, 50, [3,4,5,6]],
        ["Settlement", 15, 70, [7,8,32,11,60]],
        ["Hamlet", 50, 150,[35,45,61]],
        ["Outpost", 100, 225,[12,25,48,62]],
        ["Village", 150, 300,[13,33,46,49,69]],
        ["Large Village", 250, 350,[9,14,29,38,41]],
        ["Rural Town", 500, 400,[10,15,33,26,52,63,70]],
        ["Small Town", 1500, 500,[16,17,30,50,47,64]],
        ["Market Town", 4000, 650,[18,36,27,53,71]],
        ["Bustling Town", 7000, 800,[28,56,54,65]],
        ["Small City", 15000, 1000,[19,39,42,34,72]],
        ["City", 45000, 2500,[20,44,51,57,55]],
        ["Large City", 100000, 3500,[21,40,37,66]],
        ["Metropolis", 250000, 5000,[22,31,58]],
        ["Regional Metropolis", 450000, 8000,[23,59]],
        ["National Metropolis", 700000, 10000,[24,67]],
        ["Continental City", 1000000, 15000,[68]],
        ["Mega City", 2000000, 30000,[]],
        ["Global City", 5000000, 45000,[]],
        ["Megalopsis", 10000000, 75000,[]],
        ["Gigalopsis", 100000000, 100000,[]],
        ["Utopia", 1000000000, 100000,[]]
    ];

    const population = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",2)[0]
    const currentStatus = await GetDBElements("City","status","city_id",1)[0]

    let newStatus = currentStatus;
    let newBonus = 0;
    let newUnlockedPacks = [];

    for (const parameter of populationTitles){
        if (population >= parameter[1]) {
            newStatus = parameter[0];
            newBonus += Number(parameter[2]);
            newUnlockedPacks.push(...parameter[3])
        }
    }

    if (newStatus !== currentStatus){
        await UpdateAddDB("City_attribute","attribute_value",Number(newBonus),"city_attribute_id",4);
        await UpdateDB("City","status",newStatus,"city_id",1);

        for (const packId of newUnlockedPacks){
            await UpdateDB("Policy_Pack","policy_pack_unlocked",1,"policy_pack_id",packId)
        }
        StatusCongratulations();
    }
}

async function payTax(money,tax){
    if (tax === 0) {
        return money
    }
    await UpdateAddDB("City_Attribute","attribute_value",await Round(money * tax,2),"city_attribute_id",3)
    return await Round(money * (1-tax),2)
}
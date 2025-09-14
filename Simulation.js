async function Simulate(){
    await ResetCityAttributes()
    await DemandCalculations()
    await CreationPolicySimulation()
    await ResidentialSimulation()
    return
} 

async function CreationPolicySimulation(){
    //document elements
    //policies to use
    const policies = GetDBElements("Policy_Collection","policy_id","policy_active",1);
    let attribute_iteration = 0;
    for (policy of policies){
        console.log(policy)
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
    return
}

async function ResetCityAttributes(){
    let attribute_iteration = 0
    const attribute_ids = GetDBElements("City_attribute","city_attribute_id","clear_on_simulation",1)
    document.getElementById("SimulationProgressBarsDetail").innerHTML = "Setting Up Simulations"
    for (attribute of attribute_ids){
        attribute_iteration++;
        SimulationProgressBarsDetailSpecificsProgressIndicator.style.width = (attribute_iteration/attribute_ids.length) * 100 + "%";
        SimulationProgressBarsDetailSpecifics.innerHTML = "Preparing: " + GetDBElements("City_Attribute","attribute_name","city_attribute_id",attribute)
        UpdateDB("City_Attribute","attribute_value",0,"city_attribute_id",attribute)
    }
    return
}

function DemandCalculations(){
    if (GetDBElements("Citizens","citizen_id",null,null).length == 0){
        UpdateDB("City_Attribute","attribute_value",100,"city_attribute_id",106)
    }
}

async function ResidentialSimulation(){
    await ResidentialSimulationCreateRandomiser([1],6)
}


function ResidentialSimulationCreateRandomiser(models,attribute_id){
    let numberOfResidentialAccomodation = 0
    for (model of models){
        numberOfResidentialAccomodation += GetDBElements("Residential","residential_id","house_model_id",models).length
    }
    console.log((GetDBElements("City_Attribute","attribute_value","city_attribute_id",attribute_id) - numberOfResidentialAccomodation.length))
    for (n in (GetDBElements("City_Attribute","attribute_value","city_attribute_id",attribute_id) - numberOfResidentialAccomodation.length)){
        console.log(GetDBElements("City_Attribute","attribute_value","city_attribute_id",100+Number(attribute_id)) + " - " + Math.random() * 100)
        if (Math.random() * 100 <= GetDBElements("City_Attribute","attribute_value","city_attribute_id",100+Number(attribute_id))){
            AddBuilding("residential",'Budget class')
        }
    }
}

/*
function AddBuilding (type,model){
    let descriptor = []
    let building = []
    let name = ""
    let result = ""
    switch (type){

        case "residential":

            switch (model){

                case "Budget class":
                    descriptor = ["Sunny","Pleasant","Green","Happy","Friendly","Cozy","Bright","Meadow","Maple","Willow","Shady","Rusty","Dusty","Hollow","Cracked","Faded","Low"]
                    building = ["homes","shack","residence"]
                    name = descriptor[Math.floor(Math.random() * descriptor.length)] + " " + building[Math.floor(Math.random * building.length)]
                    InsertDB("Building","(city_id,name)","(1,"+ name +")")
                    result = db.exec("SELECT last_insert_rowid() FROM Building as id");
                    console.log(result)
                    InsertDB("Residential","(building_id)",result)
                    result.free()
                    break;

                case "Budget class":
                    descriptor = ["Sunny","Pleasant","Green","Happy","Friendly","Cozy","Bright","Meadow","Maple","Willow","Shady","Rusty","Dusty","Hollow","Cracked","Faded","Low"]
                    building = ["homes","shack","residence"]
                    name = descriptor[Math.floor(Math.random() * descriptor.length)] + " " + building[Math.floor(Math.random * building.length)]
                    InsertDB("Building","(city_id,name)","(1,"+ name +")")
                    result = db.exec("SELECT last_insert_rowid() FROM Building as id");
                    console.log(result)
                    InsertDB("Residential","(building_id)",result)
                    result.free()
                    break;
            break;
            }
    }
}*/

class building {
    #name;

    constructor (name){
        this.#name = name;
    }

    debug(){
        console.log(`This building is called ` + this.#name)
    }
}

class residential extends building {
    #population;

    constructor()
}
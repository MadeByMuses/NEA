class NameGenerator{
    #firstNames = [];
    #lastNames = [];
    #owning = false;

    constructor(firstNames,lastNames,owning){
        this.#firstNames = firstNames;
        this.#lastNames = lastNames;
        //just incase owning is not defined or null
        if (owning === undefined || owning === null || owning === false){
            this.#owning = false
        }
        else{
            this.#owning = true
        }
    }

    generate(){
        //pick random first name from array
        const firstNameToReturn = this.#firstNames[Math.floor(this.#firstNames.length * Math.random())]

        let owningToReturn = " "
        if (this.#owning === true){
            owningToReturn = firstNameToReturn.endsWith('s') ? "' " : "'s " /// apostrophe rule
        }

        //pick random last name from array
        const lastNameToReturn = this.#lastNames[Math.floor(this.#lastNames.length * Math.random())];
        return String(firstNameToReturn + owningToReturn + lastNameToReturn);
    }
}

async function loadNames(lastName) {

    const residenceNames = ["home","residence","house"];
    const commercialFirstNames = ["Local","Small","Independent","Quiet","Busy","Super","Mini","Quaint","Little","Pretty"]
    const commercialLastNames = ["store","shop"]
    const industrialLastNames = ["inc","industries","ltd"]

    const jsonFileRaw = await fetch('Assets/Json/Names.json');
    //get the file of all names from the census
    const jsonFile = await jsonFileRaw.json();

    const humanFirstNames = jsonFile.firstNames;
    const humanLastNames = jsonFile.lastNames;

    //non-specialised names
    const entityNames = new NameGenerator(["Undefined"],["entity"],false);
    const buildingNames = new NameGenerator(["Unnamed"],["building"],false);
    const residentialNames = new NameGenerator(["Unnamed"],["house"],false);

    //specialised names
    const residentialBudgetNames = new NameGenerator(humanFirstNames,["shack","trailer","shed","caravan","camper","cabin","hut","RV"],true);
    const residentialLowerNames = new NameGenerator(humanFirstNames,[...residenceNames,"hytte","bungalow","cottage"],true);

    //industrial names
    const industrialForestry = new NameGenerator(["Greenside","Natural","Eco","Raw","Homely","Leafy","Barking","Hard","Wooden","Grown"],[...industrialLastNames,"forests","forestry","woods","woodlands","lumber","planks","logs","bark","trees"],false)
    const industrialAgriculture = new NameGenerator([...humanFirstNames,...humanLastNames],["farm","crops","fields","land","goods"],true)
    const industrialOre = new NameGenerator(["Ore","Rocky","Mineral","Shiny","Gem","Sapphire","Coal","Earthy","Gaia","Mining"],[...industrialLastNames,"mines","extracters","excavaters","excavation","quarry","diggings","seam","deposit","mineshaft","veins"],false)
    const industrialCrudeOil = new NameGenerator(["Black","Oily","Petroleum"],[...industrialLastNames,"fracking","fracked!","oil","extractors","pumps","frackers"],false)
    const industrialRawFish = new NameGenerator(["Fresh","Ocean","Blubber","Bubbles","Salty","Scaley"],[...industrialLastNames,"boats","ships","fishers","catchers","nets","scales"],false)
    const industrialFurniture = new NameGenerator(["Wood","Table","Oak","Birch","Spruce"],[...industrialLastNames,"makers","chippers","carpenters","crafts"],false)
    const industrialPaper = new NameGenerator(["Paper","Sheet","Panel","Writing"],[...industrialLastNames,"mills","sawmill","creek","precision"],false)
    const industrialMetals = new NameGenerator(["Shiny","Sparkle","Strong","Compacted"],[...industrialLastNames,"cutters","smelters","metals"],false)
    const industrialOil = new NameGenerator(["Oily","Petro"],["Distillation"],false)
    const industrialProcessedFish = new NameGenerator(["Shucked","Clammed","Tasty"],[...industrialLastNames,"shuckers","fishers"],false)
    const industrialBakedGoods = new NameGenerator(humanFirstNames,["bakes","goods","products"],true)
    const industrialMeat = new NameGenerator(humanFirstNames,["steaks","cows","lambs","meats","chops"],true)
    const industrialMeals = new NameGenerator(["Super","Quick","Organic","Tasty","Your","99","Wonder"],["meals","dishes","to-go","chef","food","plates"],false)
    const industrialElectronics = new NameGenerator(["64","Powerful","Sparky","Buzzing","32","16"],["bits","tech","world","gadgets"],false)
    const industrialPlastics = new NameGenerator(["Perfect","Clear","Cut","Controlled","Perfected"],["molds","plastics","utensils"],false)
    const industrialChemicals = new NameGenerator(["Gassy","Organic","Natural","Super","Amazing"],["drugs","pills","bottles","liquids"],false)
    const industrialVehicles = new NameGenerator(["Speedy","Fast"],["Cars"],false)
    const industrialSpaceships = new NameGenerator(["Moon","Planet"],["Explorers"],false)
    const industrialSoftware = new NameGenerator(["Bit","Cell","Creative","Industrial"],["solutions","designs","software","tech","creations"],false)
    const industrialMedia = new NameGenerator(["Creative","Purposeful","Meaningful","Modern","Indie","Unique","Special"],[...industrialLastNames,"films","content","photos","designs","creations","designs"],false)

    //commercial names
    const commercialFurnitureStore = new NameGenerator(["Wood","Table","Desk","Bed","Oak","Furniture","Local"],[...commercialLastNames,"carpenters","land","world","makers","creators"],false)
    const commercialPaperStore = new NameGenerator(["Sheets","Thin","Pretty","Oragami","Graph"],[...commercialLastNames,"papers","materials","stationery"],false)
    const commercialOilStore = new NameGenerator(["Powerful","Organic",'Fossil',"Raw"],["oil","fuel","power","station"],false)
    const commercialFishStore = new NameGenerator(["Fish","Fishy","Seafood","Prawn","Squid","Fish-finger","Seafarer","Blue"],[...commercialLastNames,"monger","shack","bar","ocean","catch"],false)
    const commercialBakedStore = new NameGenerator([...commercialFirstNames,"Pudding","Sweet","Baking","Treat","Sugar","Bready","Toasty",""],[...commercialLastNames,"bakery","hut","emporium","paradise","oven"],false)
    const commercialButcherStore = new NameGenerator(["Slaughter","Meaty","Meat","Raw","Red","Slicing","Cut"],[...commercialLastNames,"house","butchers","butchery","cow","pig","chicken","meat","bits","chunks"],false)
    const commercialMealStore = new NameGenerator(...humanFirstNames,[...commercialLastNames,"cafe","restaurant","dinner","bar"],true)
    const commercialElectronicStore = new NameGenerator(["Tech","IT","Electro","PC"],["guru","support"],false)
    const commercialPlasticStore = new NameGenerator(["Big","Small","Colourful","Truly","Pro"],["molds","bottles","tools","trinkets","whim-whams"],false)
    const commercialChemicalStore = new NameGenerator(...commercialFirstNames,["drugs","pharmacy","pills"],false)
    const commercialVehicleStore = new NameGenerator(...humanFirstNames,["cars","vehicles","wheels"],true)
    const commercialSoftwareStore = new NameGenerator(["Bit","Cell","Creative","Industrial"],["solutions","designs","software","tech","creations"],false)
    const commercialMediaStore = new NameGenerator(["Creative","Purposeful","Meaningful","Modern","Indie","Unique","Special"],[...commercialLastNames,"films","content","photos","designs","creations","designs"],false)

    //

    //for the citizens
    const humanNames = new NameGenerator(humanFirstNames,humanLastNames,false)
    const humanNamesChild = new NameGenerator(humanFirstNames,[lastName],false)

    return {entityNames,buildingNames,residentialNames,
        residentialBudgetNames,residentialLowerNames,
        humanNames,humanNamesChild,
        industrialForestry,industrialAgriculture,industrialOre,industrialCrudeOil,industrialRawFish,industrialFurniture,industrialPaper,industrialMetals,industrialOil,industrialProcessedFish,
        industrialBakedGoods,industrialMeat,industrialMeals,industrialElectronics,industrialPlastics,industrialChemicals,industrialVehicles,industrialSpaceships,industrialSoftware,industrialMedia,
        commercialFurnitureStore,commercialPaperStore,commercialOilStore,commercialFishStore,commercialBakedStore,commercialButcherStore,commercialMealStore,commercialElectronicStore,
        commercialPlasticStore,commercialChemicalStore,commercialVehicleStore,commercialSoftwareStore,commercialMediaStore}
}

//Simulates protected variables
const protectedData = new WeakMap();

class Entity{
    //name; 

    constructor (name){
        this.insertIntoProtectedData('name',name || null)
    }

    getProtectedData (){
        return protectedData.get(this);
    }

    insertIntoProtectedData(key,data){
        if (data == undefined && key == 'money'){
            //window.alert("error: " + data)
        }
        //set protected Data to be what it currently is AND the new data with its key
        protectedData.set(this,{...this.getProtectedData(),[key] : data})
        return
    }

    //initialisation funciton
    async init(){
        await this.createName()
    }

    async createName() {
        if (this.getName() === null){
            const names = await loadNames();
            const newName = names.entityNames.generate();
            await this.insertIntoProtectedData('name',newName)
        }
        return
    }

    getName (){
        return this.getProtectedData().name;
    }

    async save() {
        //pass
    }
}

class Building extends Entity{
    //buildingId;
    constructor (name,buildingId,cityVisualisationChar){
        super(name)

        this.insertIntoProtectedData('buildingId',buildingId)
        this.insertIntoProtectedData('cityVisualisationChar',cityVisualisationChar)
    }

    //initialisation funciton
    async init() {
        await super.init()

        await this.createName()

        await this.createBuilding();
    }

    async createName() {
        if (this.getName() == null){
            const names = await loadNames();
            const newName = names.buildingNames.generate();
            await this.insertIntoProtectedData('name',newName)
        }
    }

    async createBuilding(){
        if (this.getBuildingId() === null) {
            const id = await nextAttributeValue('building','building_id')
            await InsertDB('Building','(building_id,name)',`(${id},"`+String(this.getName())+`")`)
            this.insertIntoProtectedData("buildingId", id);
        }
    }

    getcityVisualisationChar(){
        return this.getProtectedData().cityVisualisationChar;
    }
    getBuildingId(){
        return this.getProtectedData().buildingId;
    }

    async save() {
        const buildingId = await this.getBuildingId();
        const buildingcityVisualisationChar = await this.getcityVisualisationChar();
        const buildingName = await this.getName();

        saveBuilding(buildingId, buildingName, buildingcityVisualisationChar)
    }

    async deleteObject(){
        const buildingId = await this.getBuildingId()
        await eraseBuilding(buildingId)
    }
}

class Service extends Building {
    constructor (name,serviceId,buildingId,cityVisualisationChar, serviceBuildingModelId, policyCollectionId){
        super(name, buildingId, cityVisualisationChar)
        this.insertIntoProtectedData('serviceId',serviceId)
        this.insertIntoProtectedData('serviceBuildingModelId',serviceBuildingModelId)
        this.insertIntoProtectedData('policyCollectionId',policyCollectionId)

    }

    async init(){
        await this.importValues()

        await super.init()

        await this.createServiceId()

        await this. createJobs()
    }

    async importValues(){
        if (this.getName() == null){
            const name = await GetDBElements("Service_Building_Model","name","service_building_model_id",await this.getServiceModelId())[0]
            this.insertIntoProtectedData('name',name)
            const cityVisualisationChar = await GetDBElements("Service_Building_Model","city_visualisation_char","service_building_model_id",await this.getServiceModelId())[0]
            this.insertIntoProtectedData('cityVisualisationChar',cityVisualisationChar)
        }
    }

    async createServiceId(){
        if (this.getServiceId() == null){
            await InsertDB("Service_Building","(building_id)",`(${Number(await this.getBuildingId())})`)
            const id = await GetDBElements("Service_Building","service_building_id","building_id",this.getBuildingId())
            await this.insertIntoProtectedData('serviceId',id)
        }
    }

    async createJobs(){
        const listedJobsCount = await GetDBElements("Employer","employer_listing_id","building_id",await this.getBuildingId()).length
        if (listedJobsCount == 0){
            let jobsToAdd = await GetDBElements('Employer_Template_Service','job_id','service_building_model_id',await this.getServiceModelId())
            for (const job of jobsToAdd){
                const loop = await GetDBElementsDoubleCondition('Employer_Template_Service','amount','service_building_model_id',await this.getServiceModelId(),'job_id',job)[0]
                for (let i = 0; i < loop; i++){
                    await InsertDB('Employer','(building_id,job_id,citizen_id)','('+this.getBuildingId()+','+job+',-1)')
                }
            }
        }
    }

    getServiceModelId(){
        return this.getProtectedData().serviceBuildingModelId
    }
    getPolicyCollectionId(){
        return this.getProtectedData().policyCollectionId
    }
    getServiceId(){
        return this.getProtectedData().serviceId
    }

    async applicationForJob(citizen,job){  
        const jobId = await GetDBElements('Employer','job_id','employer_listing_id',job)[0]
        const minWeeks = await GetDBElements('Job','min_education_weeks','job_id', jobId)[0]
        const importance = await GetDBElements('Job','importance','job_id',jobId)[0]
        const eduDifference = citizen.getEducationTurns() - minWeeks
        let qualificationFactor = 0
        if (eduDifference >= 0){
            qualificationFactor = importance
        }
        else{
            qualificationFactor = Math.pow(Math.E,-1 * (Math.pow(eduDifference,2)/(2*(1-(5*importance/6))*Math.pow(Math.max(1,0.7*minWeeks))),2))
        }
        if (Math.random() <= qualificationFactor){
            //YOU GOT THE JOB YAY!
            UpdateDB('Employer','citizen_id',citizen.getCitizenId(),'employer_listing_id',job)
            return true
        }
        return false
    }

    async payWorkers(){
        //remove this as wages should be paid prior to purchasing
        const jobsCurrent = await GetDBElements("Employer","employer_listing_id","building_id", await this.getBuildingId())

        if (jobsCurrent != null){
            for (const id of jobsCurrent){
                const citizenId = await GetDBElements("Employer","citizen_id","employer_listing_id",id)[0]
                if (citizenId != -1){
                    const jobId = await GetDBElements("Employer","job_id","employer_listing_id",id)[0]
                    const wage = await GetDBElements('Job','wage','job_id',jobId)[0]
                    let citizen = await LoadObject.constructCitizen(citizenId)
                    await citizen.payDay(wage)
                    await citizen.save()
                    await UpdateAddDB('City_Attribute','attribute_value',-1 * wage,"city_attribute_id",3)
                }
            }
        }
    }

    async simulate(){
        await this.payWorkers()
    }

    async save(){
        await super.save()
        const serviceId = await this.getServiceId()
        const buildingId = await this.getBuildingId()
        const serviceBuildingModelId = await this.getServiceModelId()
        const policyCollectionId = await this.getPolicyCollectionId()

        saveService(serviceId,buildingId,serviceBuildingModelId,policyCollectionId)
    }

    async deleteObject(){
        await super.deleteObject()
        const serviceId = await this.getServiceId()
        const buildingId = await this.getBuildingId()
        await eraseService(serviceId,buildingId)
    }
}

class Residential extends Building {
    //residentialModelId;
    //residentialId;
    //maxResidents;
    //rent;
    constructor(name,buildingId,cityVisualisationChar,residentialModelId,residentialId){
        super(name,buildingId,cityVisualisationChar)
        this.insertIntoProtectedData('residentialModelId',residentialModelId)
        this.insertIntoProtectedData('residentialId',residentialId || null)
        this.insertIntoProtectedData('maxResidents',0)
        this.insertIntoProtectedData('rent',0)
    }

    //initialisation funciton
    async init() {
        //polymorphic functions
        await this.importModelValues()

        await this.createName()

        //get the unchanged functions
        await super.init()

        //this is here cause I need the buildingId
        await this.createResidential()
    }

    async importModelValues(){
        //based on this object's residentialModelId, get the attributes
        this.insertIntoProtectedData('maxResidents',await GetDBElements('Residential_Model','max_groups','residential_model_id',this.getResidentialModelId())[0])
        this.insertIntoProtectedData('rent',await GetDBElements('Residential_Model','rent','residential_model_id',this.getResidentialModelId())[0])
        this.insertIntoProtectedData('cityVisualisationChar',await GetDBElements('Residential_Model','city_visualisation_char','residential_model_id',this.getResidentialModelId()))
    } 
    
    async createName() {
        if (this.getName() == null){
            const names = await loadNames();
            const newName = names.residentialNames.generate();
            await this.insertIntoProtectedData('name',newName)
        }
    }

    async createResidential(){
        if (this.getResidentialId() == null){
            const id = nextAttributeValue('Residential','residential_id')

            await InsertDB('Residential','(building_id,residential_model_id)',"("+String(this.getBuildingId())+","+String(this.getResidentialModelId())+")")
            this.insertIntoProtectedData("residentialId", id);
        }
    }


    getResidentialId() {
        return this.getProtectedData().residentialId;
    }
    getResidentialModelId() {
        return this.getProtectedData().residentialModelId;
    }
    getRent() {
        return this.getProtectedData().rent;
    }

    async simulate(){
        const residentialId = await this.getResidentialId();
        const citizenIds = await GetDBElements('Citizen','citizen_id','residential_id',residentialId)
        for (const citizenId of citizenIds){
            const citizen = LoadObject.constructCitizen(citizenId)
            await citizen.payRentShare(this.getRent())
            await citizen.save()
        }
    }

    async save() {
        await super.save()
        const buildingId = await this.getBuildingId();
        const residentialModelId = await this.getResidentialModelId();
        const residentialId = await this.getResidentialId();

        saveResidential(residentialId, buildingId ,residentialModelId)
    }
}

class Citizen extends Entity{
    //citizenId;
    //parentId; 
    //groupId;
    //turnOfBirth;
    //money;
    //residentialId;
    //educationTurns;
    constructor(name,citizenId,parentId,groupId,turnOfBirth,money,residentialId,educationTurns,happiness){
        super(name)

        this.insertIntoProtectedData('citizenId',citizenId)
        this.insertIntoProtectedData('parentId',parentId)
        this.insertIntoProtectedData('groupId',groupId)
        this.insertIntoProtectedData('turnOfBirth',turnOfBirth)
        this.insertIntoProtectedData('money',money)
        this.insertIntoProtectedData('residentialId',residentialId)
        this.insertIntoProtectedData('educationTurns',educationTurns)
        this.insertIntoProtectedData('happiness',happiness)
    }

    async init(){

        await this.createName()

        await this.createCitizenId()

        await this.createGroupId()
    }

    async createName() {
        if (this.getName() == null){
            let newName = null;
            if (this.getParentId() == null){
                const names = await loadNames();
                newName = names.humanNames.generate();
            }
            else{
                const names = await loadNames(this.getParentId());
                newName = names.humanNamesChild.generate();
            }
            await this.insertIntoProtectedData('name',newName);

        }
        return
    }

    async getParentalLastName(){
        const name = GetDBElements('Citizen','name','citizen_id',this.getParentId())
        if (name != null){
            const namesSplit = name.split(' ')
            return namesSplit[1]
        }
        return null
    }

    async createCitizenId(){
        if (await this.getCitizenId() == null){
            const id = nextAttributeValue("Citizen","citizen_id")
            await InsertDB('Citizen','(name)',`("`+String(this.getName())+`")`)
            await this.insertIntoProtectedData("citizenId", id);
        }
    }

    async createGroupId(){
        if (this.getGroupId() == null){
            if(this.getParentId() != null){
                const parent = await constructCitizen(await this.getParentId())
                this.insertIntoProtectedData('groupId',parent.getGroupId())
            }
            else{
                const id = await nextAttributeValue('Group_Collection','group_id')
                this.insertIntoProtectedData('groupId',id)
                await InsertDB('Group_Collection','(group_id,citizen_id)',`(${this.getGroupId()},${this.getCitizenId()})`)
                await InsertDB('Group_Residential_Collection','(group_id,residential_id)',`(${this.getGroupId()},${this.getResidentialId()})`)
            }
        }
    }

    getParentId(){
        return this.getProtectedData().parentId;
    }
    getGroupId(){
        return this.getProtectedData().groupId;
    }
    getCitizenId(){
        return this.getProtectedData().citizenId;
    }
    getMoney(){
        return this.getProtectedData().money;
    }
    getHappiness(){
        return this.getProtectedData().happiness;
    }
    getResidentialId() {
        return this.getProtectedData().residentialId;
    }
    getEducationTurns() {
        return this.getProtectedData().educationTurns;
    }
    getTurnOfBirth(){
        return this.getProtectedData().turnOfBirth;
    }

    async simulate(){

        const turn = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",1)
        const turnAge = turn - await this.getTurnOfBirth()

        UpdateAddDB("City_Attribute","attribute_value",0.06,"city_attribute_id",203)
        UpdateAddDB("City_Attribute","attribute_value",0.1,"city_attribute_id",205)
        UpdateAddDB("City_Attribute","attribute_value",0.1,"city_attribute_id",207)


        if (turnAge == 18 * 52 ){
            await this.insertIntoProtectedData('residentialId',null)
            const id = await nextAttributeValue('Group_Collection','group_id')
            await this.insertIntoProtectedData('groupId',id)
            await InsertDB('Group_Collection','(group_id,citizen_id)',`(${this.getGroupId()},${this.getCitizenId()})`)
            await InsertDB('Group_Residential_Collection','(group_id,residential_id)',`(${this.getGroupId()},${this.getResidentialId()})`)
            
        }
        if (turnAge >= 18 * 52){
            //check if homeless
            if(this.getResidentialId() == null){
                await this.findHouse()
            }
            //check if unemployed
            if(await GetDBElements('Employer','employer_listing_id','citizen_id',this.getCitizenId()).length == 0){
                await this.findJob()
            }
            await this.getGoods()

            if (GetDBElements("Group_Collection","group_collection_id","group_id",this.getGroupId()).length == 1){
                this.getMarried()
            }
            else{

            }
        }

        if (Math.random() < 0.005){
            UpdateAddDB("City_Attribute","attribute_value",1,"city_attribute_id",215)
        }

        await this.getEducated(turnAge)

        /*
        const deathProbability = (0.0536/7)*Math.pow(Math.E,0.1044*((turnAge/52) - 50)) - 0.008
        if (Math.random() < deathProbability){
            UpdateAddDB("City_Attribute","attribute_value",1,"city_attribute_id",215)
            eraseCitizen(await this.getCitizenId())
        }*/
    }

    async findHouse(){
        //every turn the citizen check a max 20 different properties (residential) and ensures that it is in its budget
        //it will then find the property that it is in the highest quality (based of residential type AND residential quality itself)
        
        //budget
        const budget = ((this.getMoney() * 2) / 3) //TODO when wages are implemnted make sure the budget includes this
        let selectionOfHomes = []
        const homes = await availableHouses();
        selectionOfHomes = homes.slice(0,20);


        let housesInBudget = []
        for (const home of selectionOfHomes){
            const homeModelId = await GetDBElements('Residential','residential_model_id','residential_id',home)[0]
            const rentPrice = await GetDBElements('Residential_Model','rent','residential_model_id',homeModelId)[0]
            if (rentPrice < budget){
                housesInBudget.push(home)
            }
        }

        //TODO quality of buildings
        const pickedHouse = housesInBudget[0]
        this.insertIntoProtectedData('residentialId',pickedHouse)
        UpdateAddDB("City_Attribute","attribute_value",1,"city_attribute_id",201)
    }

    async findJob(){
        if (await GetDBElements("Employer","employer_listing_id","citizen_id",await this.getCitizenId()).length != 0)
        {
            return
        }
        const jobsAvailable = SortingObject.shuffle(await GetDBElements('Employer','employer_listing_id','citizen_id',-1)).slice(0,25)
        if (!Array.isArray(jobsAvailable)){
            jobsAvailable = [jobsAvailable]
        }
        let jobs = []
        for (let i = 0; i < jobsAvailable.length; i++){
            let listingId = jobsAvailable[i]
            let jobId = await GetDBElements('Employer','job_id','employer_listing_id',listingId)[0]
            const jobWeeks = await GetDBElements('Job','min_education_weeks','job_id',jobId)[0]
            const jobWage = await GetDBElements('Job','wage','job_id',jobId)[0]
            const rating = (Math.pow(Math.E,-1 * (Math.pow((this.getEducationTurns() - jobWeeks),2))/(2*Math.pow((Math.max(1,jobWeeks)),2))) * Math.min((Math.log(jobWage+1))/(Math.log(1000 * (jobWeeks + 1))),1)) + (Math.random() * 0.2)
            jobs.push([listingId,rating])
        }

        
        SortingObject.mergeSort(jobs,1)
        jobs.reverse()
        
        for (const job of jobs){
            const buildingId = GetDBElements('Employer','building_id','employer_listing_id',job[0])[0]
            if (GetDBElements('Commercial','commercial_id','building_id',buildingId).length != 0){
                const employer = await LoadObject.constructCommercial(await GetDBElements('Commercial','commercial_id','building_id',buildingId)[0])
                if (await employer.applicationForJob(this,job[0])){
                    return
                }
            }
            else if (GetDBElements('Industrial','industrial_id','building_id',buildingId).length != 0){
                const employer = await LoadObject.constructIndustrial(await GetDBElements('Industrial','industrial_id','building_id',buildingId)[0])
                if (await employer.applicationForJob(this,job[0])){
                    return
                }
            }
            else {
                const employer = await LoadObject.constructService(await GetDBElements('Service_Building','service_building_id','building_id',buildingId)[0])
                if (await employer.applicationForJob(this,job[0])){
                    return
                }
            }
        }

        UpdateAddDB("City_Attribute","attribute_value",1,"city_attribute_id",201)
    }

    async payRentShare(rent) {
        const group = GetDBElements("Group_Collection","citizen_id","group_id",this.getGroupId()) 
        let adultGroup = []
        for (const citizenId of group){
            if ((18 * 52) > GetDBElements("Citizen","turnOfBirth","citizen_id",citizenId)){
                adultGroup.push(citizenId)
            }
        }
        const rentShare = rent/(adultGroup.length)
        this.insertIntoProtectedData('money',this.getMoney()-rentShare)
    }

    async save() {
        //(name,citizenId,parentId,groupId,turnOfBirth,money,residentialId,educationTurns)
        await super.save()
        const name = await this.getName();
        const citizenId = await this.getCitizenId();
        const parentId = await this.getParentId();
        const groupId = await this.getGroupId();
        const turnOfBirth = await this.getTurnOfBirth();
        const money = await this.getMoney();
        const educationTurns = await this.getEducationTurns();
        const residentialId = await this.getResidentialId();
        const happiness = await this.getHappiness();

        //TODO dead mechanic
        await saveCitizen(citizenId,name,parentId,turnOfBirth,money,residentialId,educationTurns,happiness,false,groupId)
    }

    async payDay(wage){
        this.insertIntoProtectedData('money',Number(this.getMoney()) + Number(wage))
    }

    async getGoods(){
        const typeAndHappiness = [['essential',1,-2,35],['normal',3,0,3],['luxury',10,0,1]]

        for (const block of typeAndHappiness){
            //needs to get checked every new purchase
            let buyingPower = await this.getMoney()
            const buyingPowerReasonable = buyingPower * 0.4

            const commercialModelIds = await GetDBElements("Commercial_Model","commercial_model_id","type",block[0])
            let commercialIds = []
            for (const id of commercialModelIds){
                commercialIds.push(... await GetDBElements("Commercial","commercial_id","commercial_model_id",id))
            }
            commercialIds = SortingObject.shuffle(commercialIds)
            let potentialStore = []
            for (const id of commercialIds){
                const modelId = await GetDBElements("Commercial","commercial_model_id","commercial_id",id)[0]
                const comMaterialId = await GetDBElements("Commercial_Model","stock_material_id","commercial_model_id",modelId)[0]
                const materialCostRaw = await GetDBElements("Material","local_price","material_id",comMaterialId)
                const markUpPercentage = await GetDBElements("Markup","markup","type",block[0])[0]
                const materialCost = materialCostRaw * markUpPercentage
                const count = Math.max(0,Math.min(block[3],await Round(buyingPowerReasonable/materialCost,0)))
                if (count > 0){
                    const store = await LoadObject.constructCommercial(id)
                    const maxProduct = store.getStockQuantity()
                    if (maxProduct < count){
                        potentialStore.push([store,maxProduct,maxProduct * materialCost])
                        if (potentialStore.length > 50){
                            break
                        }
                    }
                    else{
                        potentialStore.unshift([store,count,count * materialCost])
                        break    
                    }
                }
            }
            
            if (potentialStore.length == 0){
                await this.insertIntoProtectedData("happiness",this.getHappiness() + (block[2] * (block[3] - 0)))
                break
            }

            await this.insertIntoProtectedData("happiness",this.getHappiness() + (block[2] * (block[3] - potentialStore[0][2])))

            const store = potentialStore[0][0]
            await store.sell(potentialStore[0][1])
            await this.insertIntoProtectedData("money",buyingPower - potentialStore[0][2])
            await this.insertIntoProtectedData("happiness",this.getHappiness() + block[1])
        }
    }

    async getMarried(){
        const potentialPartners = await GetBach()
        const partnerToGet = potentialPartners[Math.floor(potentialPartners.length * Math.random())]

        if (Math.random() < Math.pow(400,-1)){
            const partner = await LoadObject.constructCitizen(partnerToGet)
            UpdateDB("Group_Collection","group_id",this.getGroupId(),"citizen_id",partnerToGet)
            DeleteDB("Group_Residential_Collection","group_id",partner.getGroupId())
        }
    }

    async tryForBaby(){
        const familySize = await GetDBElements("Group_Collection","group_collection_id","group_id",await this.getGroupId()).length
        const babySize = familySize - 2
        if (babySize > 3){
            return
        }
        const probability = Math.pow(Math.pow(4.5,babySize+1) * 100,1)
        if (Math.random() < probability){
            const turn = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",1)[0]
            const baby = await new Citizen(null,null,this.getParentId(),this.getGroupId(),turn,2000,this.getResidentialId(),0,100)
            await baby.init()
            await baby.save()
        }
    }

    async getEducated(turnAge){
        const educationWeeks = await this.getEducationTurns()
        if (turnAge > 52 * 5){
            if (educationWeeks < 80){
                if(Math.random() < 0.22){
                    if (!(await IsThereADeficit(208))){
                        UpdateAddDB("City_Attribute","attribute_value",0.06,"city_attribute_id",209)
                        this.insertIntoProtectedData("educationTurns",educationWeeks + 1)
                    }
                }
            }
            else if (educationWeeks < 150){
                if(Math.random() < 0.22){
                    if (!(await IsThereADeficit(210))){
                        UpdateAddDB("City_Attribute","attribute_value",0.06,"city_attribute_id",211)
                        this.insertIntoProtectedData("educationTurns",educationWeeks + 1)
                    }
                }
            }
            else if (educationWeeks < 240){
                if(Math.random() < 0.22){
                    if (!(await IsThereADeficit(212))){
                        UpdateAddDB("City_Attribute","attribute_value",0.06,"city_attribute_id",213)
                        this.insertIntoProtectedData("educationTurns",educationWeeks + 1)
                    }
                }
            }
            else{
                if(Math.random() < 0.1){
                    if (!(await IsThereADeficit(214))){
                        UpdateAddDB("City_Attribute","attribute_value",0.06,"city_attribute_id",215)
                        this.insertIntoProtectedData("educationTurns",educationWeeks + 1)
                    }
                }
            }
        }
        else if (turnAge > 52 * 45){
            if (educationWeeks < 80){
                if(Math.random() < 0.1){
                    if (!(await IsThereADeficit(208))){
                        UpdateAddDB("City_Attribute","attribute_value",1,"city_attribute_id",209)
                        this.insertIntoProtectedData("educationTurns",educationWeeks + 1)
                    }
                }
            }
            else if (educationWeeks < 150){
                if(Math.random() < 0.1){
                    if (!(await IsThereADeficit(210))){
                        UpdateAddDB("City_Attribute","attribute_value",1,"city_attribute_id",211)
                        this.insertIntoProtectedData("educationTurns",educationWeeks + 1)
                    }
                }
            }
            else if (educationWeeks < 240){
                if(Math.random() < 0.05){
                    if (!(await IsThereADeficit(212))){
                        UpdateAddDB("City_Attribute","attribute_value",1,"city_attribute_id",213)
                        this.insertIntoProtectedData("educationTurns",educationWeeks + 1)
                    }
                }
            }
            else{
                if(Math.random() < 0.01){
                    if (!(await IsThereADeficit(214))){
                        UpdateAddDB("City_Attribute","attribute_value",1,"city_attribute_id",215)
                        this.insertIntoProtectedData("educationTurns",educationWeeks + 1)
                    }
                }
            }
        }
    }
}

class Commercial extends Building{
    //commercialId
    //commercialModelId;
        //stockMaterialId
        //maxStaff
        //minStock
    //stockQuantity
    //money;

    constructor(name, buildingId,commercialId,commercialModelId,cityVisualisationChar,stockQuantity,money){
        super(name,buildingId,cityVisualisationChar)
        this.insertIntoProtectedData('commercialId',commercialId)
        this.insertIntoProtectedData('commercialModelId',Number(commercialModelId))
        this.insertIntoProtectedData('stockQuantity',stockQuantity)
        this.insertIntoProtectedData('money',money)
        this.insertIntoProtectedData('stockMaterialId',null)
        this.insertIntoProtectedData('type',null)
        this.insertIntoProtectedData('minStock',0)
    }    

    async init(){
        //import has to come first since names are dependent on stockId
        await this.importModelValues()

        await this.createName()

        await super.init();

        await this.createCommercial()

        await this.createJobs()
    }
    
    async importModelValues(){
        this.insertIntoProtectedData('stockMaterialId',Number(await GetDBElements('Commercial_Model','stock_material_id','commercial_model_id',this.getCommercialModelId())[0]))
        this.insertIntoProtectedData('minStock',Number(await GetDBElements('Commercial_Model','min_stock','commercial_model_id',this.getCommercialModelId())[0]))
        this.insertIntoProtectedData('type',await GetDBElements('Commercial_Model','type','commercial_model_id',this.getCommercialModelId())[0])
        this.insertIntoProtectedData('cityVisualisationChar',await GetDBElements('Commercial_Model','city_visualisation_char','commercial_model_id',this.getCommercialModelId())[0])
    }
    
    async createName() {
        if (this.getName() == null){
            const names = await loadNames();
            let newName = 'Regular Store'
            switch (Number(await this.getStockMaterialId())){
                case(6):
                    newName = names.commercialFurnitureStore.generate();
                    break;
                case(7):
                    newName = names.commercialPaperStore.generate();
                    break;
                case(9):
                    newName = names.commercialOilStore.generate();
                    break;
                case(10):
                    newName = names.commercialFishStore.generate();
                    break;
                case(11):
                    newName = names.commercialBakedStore.generate();
                    break;
                case(12):
                    newName = names.commercialMealStore.generate();
                    break;
                case(13):
                    newName = names.commercialMealStore.generate();
                    break;
                case(14):
                    newName = names.commercialElectronicStore.generate();
                    break;
                case(15):
                    newName = names.commercialPlasticStore.generate();
                    break;
                case(16):
                    newName = names.commercialChemicalStore.generate();
                    break;
                case(17):
                    newName = names.commercialVehicleStore.generate();
                    break;
                case(19):
                    newName = names.commercialSoftwareStore.generate();
                    break;
                case(20):
                    newName = names.commercialMediaStore.generate();
                    break;
                }
            await this.insertIntoProtectedData('name',newName)
        }
    }

    async createCommercial(){
        if (this.getCommercialId() == null){
            await InsertDB('Commercial','(building_id,commercial_model_id)',"("+String(this.getBuildingId())+","+String(this.getCommercialModelId())+")")
            const id = await GetDBElements('Commercial','commercial_id','building_id',await this.getBuildingId())
            this.insertIntoProtectedData("commercialId", id);
        }
    }
    
    async createJobs(){
        const listedJobsCount = await GetDBElements("Employer","employer_listing_id","building_id",await this.getBuildingId()).length
        if (listedJobsCount == 0){
            let jobsToAdd = await GetDBElements('Employer_Template_Commercial','job_id','commercial_model_id',await this.getCommercialModelId())
            for (const job of jobsToAdd){
                const loop = await GetDBElementsDoubleCondition('Employer_Template_Commercial','amount','commercial_model_id',await this.getCommercialModelId(),'job_id',job)[0]
                for (let i = 0; i < loop; i++){
                    await InsertDB('Employer','(building_id,job_id,citizen_id)','('+this.getBuildingId()+','+job+',-1)')
                }
            }
        }
    }

    getCommercialId() {
        return this.getProtectedData().commercialId;
    }
    getStockQuantity() {
        return this.getProtectedData().stockQuantity;
    }
    getMoney() {
        return this.getProtectedData().money;
    }
    getCommercialModelId() {
        return this.getProtectedData().commercialModelId;
    }
    getStockMaterialId() {
        return this.getProtectedData().stockMaterialId;
    }
    getMinStock(){
        return this.getProtectedData().minStock
    }
    getType(){
        return this.getProtectedData().type
    }

    async applicationForJob(citizen,job){  
        const jobId = await GetDBElements('Employer','job_id','employer_listing_id',job)[0]
        const minWeeks = await GetDBElements('Job','min_education_weeks','job_id', jobId)[0]
        const importance = await GetDBElements('Job','importance','job_id',jobId)[0]
        const eduDifference = citizen.getEducationTurns() - minWeeks
        let qualificationFactor = 0
        if (eduDifference >= 0){
            qualificationFactor = importance
        }
        else{
            qualificationFactor = Math.pow(Math.E,-1 * (Math.pow(eduDifference,2)/(2*(1-(5*importance/6))*Math.pow(Math.max(1,0.7*minWeeks))),2))
        }
        if (Math.random() <= qualificationFactor){
            //YOU GOT THE JOB YAY!
            UpdateDB('Employer','citizen_id',citizen.getCitizenId(),'employer_listing_id',job)
            return true
        }
        return false
    }

    async simulate(){
        //purchase simulation
        await this.payWorkers()
        await this.purchase()

        UpdateAddDB("City_Attribute","attribute_value",0.07,"city_attribute_id",203)
    }

    async payWorkers(){
        //remove this as wages should be paid prior to purchasing
        const jobsCurrent = GetDBElements("Employer","employer_listing_id","building_id", this.getBuildingId())
        if (jobsCurrent != null){
            for (const id of jobsCurrent){
                const citizenId = GetDBElements("Employer","citizen_id","employer_listing_id",id)[0]
                if (citizenId != -1){
                    const jobId = GetDBElements("Employer","job_id","employer_listing_id",id)[0]
                    const wage = await GetDBElements('Job','wage','job_id',jobId)
                    let citizen = await LoadObject.constructCitizen(citizenId)
                    await citizen.payDay(wage)
                    await citizen.save()
                    this.insertIntoProtectedData('money', Round(Number(this.getMoney() - wage),2))
                }
            }
        }
    }

    async purchase(){
        const stockQuantity = await this.getStockQuantity()
        const minStock = await this.getMinStock()
        const importStockPrice = await GetDBElements("Material","trade_price","material_id",await this.getStockMaterialId())[0]
        const localStockPrice = await GetDBElements("Material","local_price","material_id",await this.getStockMaterialId())[0]
        let stockToBuy = stockQuantity - minStock

        if (stockToBuy >= 0){
            return
        }
        stockToBuy *= -2

        let budget = await this.getMoney() * 0.45
        if (budget <= 0){
            return
        }

        const listOfPossiblePlacesToBuy = await GetDBElements("Inventory","inventory_id","material_id",await this.getStockMaterialId())
        let listOfPlacesToBuy = []
        for (const id of listOfPossiblePlacesToBuy){
            const industrialId = await GetDBElements('Inventory','industrial_id','inventory_id',id)[0]
            const modelId = await GetDBElements('Industrial','industrial_model_id','industrial_id',industrialId)[0]
            if (await GetDBElements('Industrial_Model','stock_made_material_id','industrial_model_id',modelId)[0]  == await this.getStockMaterialId()){
                listOfPlacesToBuy.push(id)
            }
        }

        await SortingObject.shuffle(listOfPlacesToBuy)

        for (let i = 0; i < listOfPlacesToBuy.length; i++){
            let inventoryId = listOfPlacesToBuy[i]
            //theortical max is how much could they spend if they spent ALL of their money?
            const theoreticalMax = budget / localStockPrice
            //how much does the seller have
            const sellerStockQuantity = await GetDBElements("Inventory","quantity","inventory_id",inventoryId)[0]
            if (sellerStockQuantity > 0){
                const industrialSeller = await LoadObject.constructIndustrial(await GetDBElements("Inventory","industrial_id","inventory_id",inventoryId)[0])
                await industrialSeller.buyStock(inventoryId,Math.min(sellerStockQuantity, stockToBuy, theoreticalMax))
                await industrialSeller.save()
                this.insertIntoProtectedData('stockQuantity',this.getStockQuantity() + Math.min(sellerStockQuantity, stockToBuy, theoreticalMax))
                this.insertIntoProtectedData('money',await Round(this.getMoney() - Math.min(sellerStockQuantity, stockToBuy, theoreticalMax) * localStockPrice,2))
                stockToBuy -= Math.min(sellerStockQuantity, stockToBuy, theoreticalMax)
            }

            //checks to get out of loop

            if (stockToBuy <= 0){
                return
            }
            if (budget <= 0){
                return
            }
        }


        const stockPlannedToBuy = Math.max(0,Math.min(stockToBuy,Math.round(budget/importStockPrice)))
        this.insertIntoProtectedData('stockQuantity',this.getStockQuantity() + stockPlannedToBuy)
        this.insertIntoProtectedData('money',await Round(this.getMoney() - (stockPlannedToBuy * importStockPrice),2))
        
    }

    async sell(quantity){
        const stockPriceRaw = await GetDBElements("Material","trade_price","material_id",this.getStockMaterialId())[0]
        const stockPrice = await GetDBElements("Markup","markup","type",this.getType())[0] * stockPriceRaw
        await this.insertIntoProtectedData("money",await Round(await this.getMoney() + await payTax(Round(stockPrice * quantity,2), await GetDBElements("City_Attribute","attribute_value","city_attribute_id",906)[0]),2))
        await this.insertIntoProtectedData("stockQuantity",Math.max(0,await this.getStockQuantity() - quantity))
        await this.save()
    }

    async save() {
        //commercialId
        //commercialModelId;
            //stockMaterialId
            //maxStaff
        //stockQuantity
        //money;
        await super.save()
        const buildingId = await this.getBuildingId();
        const commercialModelId = await this.getCommercialModelId();
        const commercialId = await this.getCommercialId();
        const stockQuantity = await this.getStockQuantity();
        const money = await this.getMoney();

        saveCommercial(commercialId, buildingId, commercialModelId, stockQuantity, money)
    }
}

class Industrial extends Building{
    //industrialId;
        //inventory
    //industrialModelId;
        //requirements
        //stockMadeId
        //stockMadeQuantity
        //stockMadeMax
    //money;

    constructor(name, buildingId,industrialId,industrialModelId,cityVisualisationChar,money){
        super(name,buildingId,cityVisualisationChar)
        this.insertIntoProtectedData('industrialId',industrialId)
        this.insertIntoProtectedData('inventory',null)
        this.insertIntoProtectedData('industrialModelId',industrialModelId)
        this.insertIntoProtectedData('requirements',null)
        this.insertIntoProtectedData('stockMadeMaterialId',null)
        this.insertIntoProtectedData('stockMadeQuantity',null)
        this.insertIntoProtectedData('money',money)
    }    

    async init(){
        //import has to come first since names are dependent on stockId

        await this.importModelValues()

        await this.createName()

        await super.init();

        await this.createIndustrial()

        await this.requirementsInventoryImport()

        await this.createJobs()
    }
    
    async importModelValues(){
        const modelId = await this.getIndustrialModelId()
        await this.insertIntoProtectedData('stockMadeMaterialId',Number(await GetDBElements('Industrial_Model','stock_made_material_id','industrial_model_id',modelId)[0]))
        await this.insertIntoProtectedData('stockMadeQuantity',Number(await GetDBElements('Industrial_Model','stock_made_quantity','industrial_model_id',modelId)[0]))
        await this.insertIntoProtectedData('stockMadeMax',Number(await GetDBElements('Industrial_Model','stock_made_max','industrial_model_id',modelId)[0]))
        await this.insertIntoProtectedData('orderIndex',Number(await GetDBElements('Industrial_Model','order_index','industrial_model_id',modelId)[0]))
        await this.insertIntoProtectedData('cityVisualisationChar',await GetDBElements('Industrial_Model','city_visualisation_char','industrial_model_id',modelId)[0])
    }

    async requirementsInventoryImport(){ 
        const requirementIds = await GetDBElements('Industrial_Model_Requirement','industrial_model_requirement_id','industrial_model_id',await this.getIndustrialModelId())

        for (const id of requirementIds){
            const minQuantity = await GetDBElements('Industrial_Model_Requirement','min_quantity','industrial_model_requirement_id',id)[0]
            const materialId = await GetDBElements('Industrial_Model_Requirement','material_id','industrial_model_requirement_id',id)[0]
            const usedQuantity = await GetDBElements('Industrial_Model_Requirement','quantity_used','industrial_model_requirement_id',id)[0]
            const current = this.getRequirements()
            if (current == null){
                this.insertIntoProtectedData('requirements',[id,materialId,minQuantity,usedQuantity])
                continue
            }
            current.push([id,materialId,minQuantity,usedQuantity])
            this.insertIntoProtectedData('requirements',current)
        }
        if (await this.getRequirements() != null){
            if (!Array.isArray(await this.getRequirements()[0])){
                this.insertIntoProtectedData('requirements',[await this.getRequirements()])
            }
        }
        //create Inventory slots in inventory table
        const industrialId = Number(await this.getIndustrialId())
        const requirements = await this.getRequirements()
        if (await GetDBElements("Inventory","inventory_id","industrial_id",industrialId).length == 0){
            if (requirements != null){
                for (let i = 0; i < requirements.length; i++){
                    await InsertDB('Inventory','(industrial_id,material_id,quantity)','(' + industrialId + ',' + requirements[i][1] + ',0)')
                }
            }
            await InsertDB('Inventory','(industrial_id,material_id,quantity)','(' + industrialId + ',' + await this.getStockMadeMaterialId() + ',0)')
        }
        const inventoryIds = await GetDBElements("Inventory","inventory_id","industrial_id",industrialId)
        let inventoryArray = []
        for (const id of inventoryIds){
            const materialId = await GetDBElements("Inventory","material_id","inventory_id",id)[0]
            const quantity = await GetDBElements("Inventory","quantity","inventory_id",id)[0]
            inventoryArray.push([id,materialId,quantity])
        }
        this.insertIntoProtectedData('inventory',inventoryArray)
        if (!Array.isArray(await this.getInventory()[0])){
            this.insertIntoProtectedData('inventory',[await this.getInventory()])
        }
    }
    
    async createName() {
        if (this.getName() == null){
            const names = await loadNames();
            let newName = 'Untitled Industrial'
            switch (Number(this.getStockMadeMaterialId())){
                case(1):
                    newName = names.industrialForestry.generate();
                    break;
                case(2):
                    newName = names.industrialAgriculture.generate();
                    break;
                case(3):
                    newName = names.industrialOre.generate();
                    break;
                case(4):
                    newName = names.industrialCrudeOil.generate();
                    break;
                case(5):
                    newName = names.industrialRawFish.generate();
                    break;
                case(6):
                    newName = names.industrialFurniture.generate();
                    break;
                case(7):
                    newName = names.industrialPaper.generate();
                    break;
                case(8):
                    newName = names.industrialMetals.generate();
                    break;
                case(9):
                    newName = names.industrialoil.generate();
                    break;
                case(10):
                    newName = names.industrialProcessedFish.generate();
                    break;
                case(11):
                    newName = names.industrialBakedGoods.generate();
                    break;
                case(12):
                    newName = names.industrialMeat.generate();
                    break;
                case(13):
                    newName = names.industrialMeals.generate();
                    break;
                case(14):
                    newName = names.industrialElectronics.generate();
                    break;
                case(15):
                    newName = names.industrialPlastics.generate();
                    break;
                case(16):
                    newName = names.industrialChemicals.generate();
                    break;
                case(17):
                    newName = names.industrialVehicles.generate();
                    break;
                case(18):
                    newName = names.industrialSpaceships.generate();
                    break;
                case(19):
                    newName = names.industrialSoftware.generate();
                    break;
                case(20):
                    newName = names.industrialMedia.generate();
                    break;
                }
            await this.insertIntoProtectedData('name',newName)
        }
    }

    async createIndustrial(){
        if (this.getIndustrialId() == null){
            await InsertDB('Industrial','(building_id,industrial_model_id)',"("+String(this.getBuildingId())+","+String(this.getIndustrialModelId())+")")
            const id = await GetDBElements('Industrial','industrial_id','building_id',await this.getIndustrialId())
            this.insertIntoProtectedData("industrialId", id);
        }
    }
    
    async createJobs(){
        const listedJobsCount = await GetDBElements("Employer","employer_listing_id","building_id",await this.getBuildingId()).length
        if (listedJobsCount == 0){
            const jobsToAdd = await GetDBElements('Employer_Template_Industrial','job_id','industrial_model_id',await this.getIndustrialModelId())
            for (const job of jobsToAdd){
                for (let i = 0; i < await GetDBElementsDoubleCondition('Employer_Template_Industrial','amount','industrial_model_id',await this.getIndustrialModelId(),'job_id',job)[0]; i++){
                    await InsertDB('Employer','(building_id,job_id,citizen_id)','('+this.getBuildingId()+','+job+',-1)')
                }
            }
        }
    }

    getInventory() {
        return this.getProtectedData().inventory;
    }
    getRequirements() {
        return this.getProtectedData().requirements;
    }
    getIndustrialId() {
        return this.getProtectedData().industrialId;
    }
    getMoney() {
        return this.getProtectedData().money;
    }
    getIndustrialModelId() {
        return this.getProtectedData().industrialModelId;
    }
    getStockMadeMaterialId() {
        return this.getProtectedData().stockMadeMaterialId;
    }
    getStockMadeQuantity() {
        return this.getProtectedData().stockMadeQuantity;
    }
    getStockMadeMax() {
        return this.getProtectedData().stockMadeMax;
    }
    getOrderIndex(){
        return this.getProtectedData().orderIndex
    }

    async applicationForJob(citizen,job){   
        const jobId = await GetDBElements('Employer','job_id','employer_listing_id',job)[0]
        const minWeeks = await GetDBElements('Job','min_education_weeks','job_id', jobId)[0]
        const importance = await GetDBElements('Job','importance','job_id',jobId)[0]
        const eduDifference = citizen.getEducationTurns() - minWeeks
        let qualificationFactor = 0
        if (eduDifference >= 0){
            qualificationFactor = importance
        }
        else{
            qualificationFactor = Math.pow(Math.E,-1 * (Math.pow(eduDifference,2)/(2*(1-(5*importance/6))*Math.pow(Math.max(1,0.7*minWeeks))),2))
        }
        if (Math.random() <= qualificationFactor){
            //YOU GOT THE JOB YAY!
            UpdateDB('Employer','citizen_id',citizen.getCitizenId(),'employer_listing_id',job)
            return true
        }
        return false
    } 

    async simulate(){

        //purchase simulation
        for(let i = 0; i < this.getInventory().length; i++){
            const inv = this.getInventory()[i]
            if (inv[1] == await this.getStockMadeMaterialId()){
                continue
            }
            await this.purchase(inv,i)
        }
        await this.payWorkers()
        await this.produce()
        //window.alert("Post Sim: " + this.getMoney())
        await UpdateAddDB("City_Attribute","attribute_value",0.1,"city_attribute_id",203)
    }


    async payWorkers(){
        //remove this as wages should be paid prior to purchasing
        const jobsCurrent = GetDBElements("Employer","employer_listing_id","building_id", this.getBuildingId())
        if (jobsCurrent != null){
            for (const id of jobsCurrent){
                const citizenId = GetDBElements("Employer","citizen_id","employer_listing_id",id)[0]
                if (citizenId != -1){
                    const jobId = GetDBElements("Employer","job_id","employer_listing_id",id)[0]
                    const wage = await GetDBElements('Job','wage','job_id',jobId)
                    let citizen = await LoadObject.constructCitizen(citizenId)
                    await citizen.payDay(wage)
                    await citizen.save()
                    this.insertIntoProtectedData('money', await Round(Number(this.getMoney() - wage),2))
                    //window.alert("money PW:" + this.getMoney())
                }
            }
        }
    }

    async produce(){
        const creationMaterialId = await this.getStockMadeMaterialId()
        const creationQuantity = await this.getStockMadeQuantity()
        const creationMax = await this.getStockMadeMax()
        let requirements = await this.getRequirements()
        let inventory = await this.getInventory()
        if (requirements != null){
            requirements = await SortingObject.mergeSort(requirements,1)
            for (let i = 0; i < creationMax; i++){
                inventory = await SortingObject.mergeSort(inventory,1)
                //CHECK IT
                let arrayFixDigit = 0
                for (let j = 0; j < inventory.length; j++){
                    if (inventory[j][1] == creationMaterialId){
                        arrayFixDigit += 1
                        continue
                    }
                    if (inventory[j][1] < requirements[j - arrayFixDigit][3]){
                        return
                    }
                }

                //PRODUCE IT

                //DEDUCT
                let indexOfMaterial = 0
                for (let j = 0; j < inventory.length; j++){
                    if (inventory[j][1] == creationMaterialId){
                        indexOfMaterial = j
                        continue
                    }
                    inventory[j][2] -= requirements[j][3]
                }

                inventory[indexOfMaterial][2] += creationQuantity 
            }
        }
        else{
            inventory[0][2] = (creationQuantity) * creationMax
        }
        this.insertIntoProtectedData('inventory',inventory)
    }

    async sellLeftOverStock(){
        const inventory = this.getInventory()
        const materialId = inventory[inventory.length - 1][1]
        const quantity = inventory[inventory.length - 1][2]
        tryLog("getting export price")
        const exportPrice = Number(await GetDBElements("Material","trade_price","material_id",materialId)[0])
        tryLog(exportPrice)        
       //window.alert("money SLOS:" + this.getMoney())
        this.insertIntoProtectedData('money',await Round(this.getMoney() + await payTax(Number(exportPrice*quantity), await GetDBElements("City_Attribute","attribute_value","city_attribute_id",909)[0]),2))

        inventory[inventory.length - 1][2] = 0
        this.insertIntoProtectedData('inventory',inventory)
    }

    async purchase(inv,index){
        const stockQuantity = inv[2]
        const minStock = await GetDBElements("Industrial_Model_Requirement","min_quantity","industrial_model_id",await this.getIndustrialModelId())[0]
        const importStockPrice = await GetDBElements("Material","trade_price","material_id",inv[1])[0]
        const localStockPrice = await GetDBElements("Material","local_price","material_id",inv[1])[0]
        let stockToBuy = stockQuantity - minStock

        if (stockToBuy >= 0){
            return
        }
        stockToBuy *= -2.5
        stockToBuy = await Round(stockToBuy,0)

        let budget = await this.getMoney() * 0.45
        if (budget <= 0){
            return
        }

        const listOfPossiblePlacesToBuy = await GetDBElements("Inventory","inventory_id","material_id",inv[1])
        let listOfPlacesToBuy = []
        for (const id of listOfPossiblePlacesToBuy){
            const industrialId = await GetDBElements('Inventory','industrial_id','inventory_id',id)[0]
            const modelId = await GetDBElements('Industrial','industrial_model_id','industrial_id',industrialId)[0]
            if (await GetDBElements('Industrial_Model','stock_made_material_id','industrial_model_id',modelId)[0]  == inv[1]){
                listOfPlacesToBuy.push(id)
            }
        }

        await SortingObject.shuffle(listOfPlacesToBuy)

        for (let i = 0; i < listOfPlacesToBuy.length; i++){
            let inventoryId = listOfPlacesToBuy[i]
            //theortical max is how much could they spend if they spent ALL of their money?
            const theoreticalMax = budget / localStockPrice
            //how much does the seller have
            const sellerStockQuantity = await GetDBElements("Inventory","quantity","inventory_id",inventoryId)[0]
            if (sellerStockQuantity > 0){
                const industrialSeller = await LoadObject.constructIndustrial(await GetDBElements("Inventory","industrial_id","inventory_id",inventoryId)[0])
                await industrialSeller.buyStock(inventoryId,Math.min(sellerStockQuantity, stockToBuy, theoreticalMax))
                await industrialSeller.save()
                let inventoryToInsert = this.getInventory()
                inventoryToInsert[index][2] += Math.min(sellerStockQuantity, stockToBuy, theoreticalMax)
                this.insertIntoProtectedData('inventory',inventoryToInsert)
                this.insertIntoProtectedData('money', await Round(Number(this.getMoney() - Math.min(sellerStockQuantity, stockToBuy, theoreticalMax) * localStockPrice),2))
                //window.alert("money P:" + this.getMoney())

                stockToBuy -= Math.min(sellerStockQuantity, stockToBuy, theoreticalMax)
            }

            //checks to get out of loop

            if (stockToBuy <= 0){
                return
            }
            if (budget <= 0){
                return
            }
        }


        while (budget > importStockPrice && stockToBuy > 0) {
            stockToBuy -= 1
            let inventoryToInsert = this.getInventory()
            inventoryToInsert[index][2] += 1
            this.insertIntoProtectedData('inventory',inventoryToInsert)
            budget -= importStockPrice
            this.insertIntoProtectedData('money',this.getMoney() - importStockPrice)
            //window.alert("money PI:" + this.getMoney())
        }
    }
    //buyStock refers to another source buying your goods, not yourself buying somebody else's goods
    async buyStock(inventoryId,quantity){
        let inventory = await this.getInventory()
        for (let i = 0; i < inventory.length; i++){
            if (inventory[i][0] == inventoryId){
                inventory[i][2] -= quantity
                await this.insertIntoProtectedData('inventory',inventory)
                await this.insertIntoProtectedData('money',await Round(this.getMoney() + await payTax(quantity * await GetDBElements('Material','local_price','material_id',inventory[i][1])[0], await GetDBElements("City_Attribute","attribute_value","city_attribute_id",909)[0]),2))
                //window.alert("money BS:" + this.getMoney())
                await this.save()
                return
            }

        }
    }

    async save() {
    //industrialId;
        //inventory
    //industrialModelId;
        //requirements
        //stockMadeId
        //stockMadeQuantity
    //money;
        await super.save()
        const buildingId =  await this.getBuildingId();
        const industrialId = await this.getIndustrialId()
        const industrialModelId = await this.getIndustrialModelId();
        const inventory = await this.getInventory()
        const money = await this.getMoney();

        saveIndustrial(industrialId, buildingId, industrialModelId, money, inventory)
    }
}

class LoadObject{

    static async constructCitizen(citizenId){
        const citizenName = await GetDBElements("Citizen","name","citizen_id",citizenId)[0];
        const citizenParentId = await GetDBElements("Citizen","parent_id","citizen_id",citizenId)[0] || null;
        const citizenGroupId = await GetDBElements("Group_Collection","group_id","citizen_id",citizenId)[0];
        const citizenTurnOfBirth = await GetDBElements("Citizen","turn_of_birth","citizen_id",citizenId)[0] || 0;
        const citizenMoney = await GetDBElements("Citizen","money","citizen_id",citizenId)[0];
        const citizenResidentialId = await GetDBElements("Group_Residential_Collection","residential_id","group_id",citizenGroupId)[0];
        const citizenEducationTurns = await GetDBElements("Citizen","education_weeks","citizen_id",citizenId)[0];
        const citizenHappiness = await GetDBElements("Citizen","happiness","citizen_id",citizenId)[0];

        let object = (new Citizen(citizenName,citizenId,citizenParentId,citizenGroupId,citizenTurnOfBirth,citizenMoney,citizenResidentialId,citizenEducationTurns,citizenHappiness))
        await object.init()
        return object
    }

    static async constructResidential(residentialId){
        const buildingId = GetDBElements("Residential","building_id","residential_id",residentialId)[0];
        const residentialName = GetDBElements("Building","name","building_id",buildingId)[0] || null;
        const cityVisualisationChar = GetDBElements("Building","city_visualisation_char","building_id",buildingId)[0];
        const residentialModelId = GetDBElements("Residential","residential_model_id","residential_id",residentialId)[0];
        
        let object = (new Residential(residentialName, buildingId, cityVisualisationChar,residentialModelId,residentialId))
        await object.init()
        return object
    }

    static async constructCommercial(commercialId){
        const buildingId = await GetDBElements('Commercial','building_id','commercial_id',commercialId)[0]
        const name = await GetDBElements('Building','name','building_id',buildingId)[0]
        const cityVisualisationChar = await GetDBElements('Building','city_visualisation_char','building_id',buildingId)[0]
        const commercialModelId = await GetDBElements('Commercial','commercial_model_id','commercial_id',commercialId)[0]
        const stockQuantity = await GetDBElements('Commercial','stock_quantity','commercial_id',commercialId)[0]
        const money = await GetDBElements('Commercial','money','commercial_id',commercialId)[0]

        let object = await (new Commercial(name,buildingId,commercialId,commercialModelId,cityVisualisationChar,stockQuantity,money))
        await object.init()
        return object
    }

    static async constructIndustrial(industrialId){
        const buildingId = GetDBElements('Industrial','building_id','industrial_id',industrialId)[0]
        const name = GetDBElements('Building','name','building_id',buildingId)[0]
        const cityVisualisationChar = GetDBElements('Building','city_visualisation_char','building_id',industrialId)[0]
        const IndustrialModelId = GetDBElements('Industrial','industrial_model_id','industrial_id',industrialId)[0]
        const money = GetDBElements('Industrial','money','industrial_id',industrialId)[0]
        //window.alert("Loading Object:" + money)

        let object = (new Industrial(name,buildingId,industrialId,IndustrialModelId,cityVisualisationChar,money))
        await object.init()
        return object
    }
    
    static async constructService(serviceId){
        const buildingId = await GetDBElements("Service_Building","building_id","service_building_id",Number(serviceId))[0]
        const name = await GetDBElements("Building","name","building_id",buildingId)[0]
        const cityVisualisationChar = await GetDBElements("Building","city_visualisation_char","building_id",buildingId)[0]
        const modelId = await GetDBElements("Service_Building","service_building_model_id","service_building_id",serviceId)[0]
        const policyCollectionId = await GetDBElements("Service_Building","policy_collection_id","service_building_id",serviceId)[0]

        let object = new Service(name,serviceId,buildingId,cityVisualisationChar,modelId,policyCollectionId)
        await object.init()
        return object
    }
}

class SortingObject{
    static mergeSort(array, indexOfComparison) {
        if (array.length <= 1) 
            {return array}
        let middle = Math.floor(array.length / 2)
        
        let left = SortingObject.mergeSort(array.slice(0, middle),indexOfComparison)
        let right = SortingObject.mergeSort(array.slice(middle),indexOfComparison)

        return SortingObject.merge(left, right, indexOfComparison)
    }

    static merge(left, right, indexOfComparison) {
    let sortedArray = []
    while (left.length && right.length) {
        
        if (left[0][indexOfComparison] < right[0][indexOfComparison]) {
        sortedArray.push(left.shift())
        } else {
        sortedArray.push(right.shift())
        }
    }
    
    return [...sortedArray, ...left, ...right]
    }

    static shuffle(array) {
        if (array.length <= 1){
            return array
        }
        let currentIndex = array.length;

        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        return array
    }
}
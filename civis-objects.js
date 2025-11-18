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

    //commercial names
    const commercialFishStore = new NameGenerator(["Fish","Fishy","Seafood","Prawn","Squid","Fish-finger","Seafarer","Blue"],[...commercialLastNames,"monger","shack","bar","ocean","catch"],false)
    const commercialBakedStore = new NameGenerator([...commercialFirstNames,"Pudding","Sweet","Baking","Treat","Sugar","Bready","Toasty",""],[...commercialFirstNames,"bakery","hut","emporium","paradise","oven"],false)
    const commercialButcherStore = new NameGenerator(["Slaughter","Meaty","Meat","Raw","Red","Slicing","Cut"],[...commercialLastNames,"house","butchers","butchery","cow","pig","chicken","meat","bits","chunks"],false)

    //for the citizens
    const humanNames = new NameGenerator(humanFirstNames,humanLastNames,false)
    const humanNamesChild = new NameGenerator(humanFirstNames,[lastName],false)

    return {entityNames,buildingNames,residentialNames,residentialBudgetNames,residentialLowerNames,humanNames,humanNamesChild,industrialForestry,industrialAgriculture,commercialFishStore,commercialBakedStore,commercialButcherStore}
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
    //cityVisulationChar;
    constructor (name,buildingId,cityVisulisationChar){
        super(name)

        this.insertIntoProtectedData('buildingId',buildingId)
        this.insertIntoProtectedData('cityVisulisationChar',cityVisulisationChar)
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
            await InsertDB('Building','(name)',`("`+String(this.getName())+`")`)
            const id = await returnRecentlyAddedEntity('Building','building_id')
            this.insertIntoProtectedData("buildingId", id);
        }
    }

    getCityVisulisationChar(){
        return this.getProtectedData().cityVisulisationChar;
    }
    getBuildingId(){
        return this.getProtectedData().buildingId;
    }

    async save() {
        const buildingId = await this.getBuildingId();
        const buildingCityVisulisationChar = await this.getCityVisulisationChar();
        const buildingName = await this.getName();

        saveBuilding(buildingId, buildingName, 0)
    }
}

class Residential extends Building {
    //residentialModelId;
    //residentialId;
    //maxResidents;
    //rent;
    constructor(name,buildingId,cityVisulationChar,residentialModelId,residentialId){
        super(name,buildingId,cityVisulationChar)
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
        this.insertIntoProtectedData('maxResidents',GetDBElements('Residential_Model','max_groups','residential_model_id',this.getResidentialModelId()))
        this.insertIntoProtectedData('rent',GetDBElements('Residential_Model','rent','residential_model_id',this.getResidentialModelId()))
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
            await InsertDB('Residential','(building_id,residential_model_id)',"("+String(this.getBuildingId())+","+String(this.getResidentialModelId())+")")
            const id = returnRecentlyAddedEntity('Residential','residential_id')
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
        for (citizenId of citizenIds){
            const citizen = LoadObject.constructCitizen(citizenIds)
            await citizen.payRentShare(this.getRent())
        }
    }

    async save() {
        //(name,buildingId,cityVisulationChar,residentialModelId,residentialId)
        await super.save()
        const buildingId = await this.getBuildingId();
        const residentialModelId = await this.getResidentialModelId();
        const residentialId = await this.getResidentialId();

        saveResidential(residentialId, buildingId ,residentialModelId)
    }
}

class ResidentialBudget extends Residential{
    constructor(name,buildingId,cityVisulationChar,residentialModelId,residentialId){
        super(name,buildingId,cityVisulationChar,residentialModelId,residentialId)
    }

    //initialisation funciton
    async init(){
        await this.createName()

        await super.init()
    }

    async createName() {
        if (this.getName() == null){
            const names = await loadNames();
            const newName = names.residentialBudgetNames.generate();
            await this.insertIntoProtectedData('name',newName)
        }
        return
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
    constructor(name,citizenId,parentId,groupId,turnOfBirth,money,residentialId,educationTurns){
        super(name)

        this.insertIntoProtectedData('citizenId',citizenId)
        this.insertIntoProtectedData('parentId',parentId)
        this.insertIntoProtectedData('groupId',groupId)
        this.insertIntoProtectedData('turnOfBirth',turnOfBirth)
        this.insertIntoProtectedData('money',money)
        this.insertIntoProtectedData('residentialId',residentialId)
        this.insertIntoProtectedData('educationTurns',educationTurns)
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
        if (this.getCitizenId() == null){
            await InsertDB('Citizen','(name)',`("`+String(this.getName())+`")`)
            const id = await returnRecentlyAddedEntity('Citizen','citizen_id')
            this.insertIntoProtectedData("citizenId", id);
        }
    }

    async createGroupId(){
        if (this.getGroupId() == null){
            if(this.getParentId() != null){
                const parent = await createCitizen(await this.getParentId())
                this.insertIntoProtectedData('groupId',parent.getGroupId())
            }
            else{
                const id = await returnRecentlyAddedEntity('Group_Collection','group_id')
                this.insertIntoProtectedData('groupId',id + 1)
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
        //check if homeless
        if(this.getResidentialId() == null){
            await this.findHouse()
        }
        //check if unemployed
        if(await GetDBElements('Employer','employer_listing_id','citizen_id',this.getCitizenId()).length == 0){
            await this.findJob()
        }
    }

    async findHouse(){
        //every turn the citizen check a max 20 different properties (residential) and ensures that it is in its budget
        //it will then find the property that it is in the highest quality (based of residential type AND residential quality itself)
        
        //budget
        const budget = ((this.getMoney() * 2) / 3) //TODO when wages are implemnted make sure the budget includes this
        let selectionOfHomes = []
        selectionOfHomes = availableHouses().slice(0,20)

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
    }

    async findJob(){
        const jobsAvailable = GetDBElements('Employer','employer_listing_id','citizen_id',null).slice(0,25)
        let jobs = []
        for (const job of jobsAvailable){
            const jobWeeks = GetDBElements('Job','min_education_weeks','job_id',GetDBElements('Employer','job_id','employer_listing_id',job)[0])
            const jobWage = GetDBElements('Job','wage','job_id',GetDBElements('Employer','job_id','employer_listing_id',job)[0])
            const rating = (Math.pow(Math.E,-1 * (Math.pow((this.getEducationTurns() - jobWeeks),2))/(2*Math.pow((Math.max(1,jobWeeks)),2))) * Math.min((Math.log(jobWage+1))/(Math.log(1000 * (jobWeeks + 1))),1))
            jobs.push([job,rating])
        }

        jobs = SortingObject.mergeSort(jobs,1)
        
        for (const job of jobs){
            const buildingId = GetDBElements('Employer','building_id','employer_listing_id',job[0])[0]
            if (GetDBElements('Commercial','commercial_id','building_id',buildingId).length != 0){
                const employer = await LoadObject.constructCommmercial(GetDBElements('Commercial','commercial_id','building_id',buildingId)[0])
                const result = await employer.applicationForJob(this,job[0])
                if (result){
                    return
                }
            }
            else{
                const employer = await LoadObject.constructIndustrial(GetDBElements('Industrial','industrial_id','building_id',buildingId)[0])
                const result = await employer.applicationForJob(this,job[0])
                if (result){
                    return
                }
            }
        }
    }

    async payRentShare(rent) {
        const group = GetDBElements("Group_Collection","citizen_id","group_id",this.getGroupId()) 
        let adultGroup = []
        for (citizenId of group){
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

        //TODO dead mechanic
        await saveCitizen(citizenId,name,parentId,turnOfBirth,money,residentialId,educationTurns,false,groupId)
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

    constructor(name, buildingId,commercialId,commercialModelId,stockQuantity,money){
        super(name,buildingId)
        this.insertIntoProtectedData('commercialId',commercialId)
        this.insertIntoProtectedData('commercialModelId',Number(commercialModelId))
        this.insertIntoProtectedData('stockQuantity',stockQuantity)
        this.insertIntoProtectedData('money',money)
        this.insertIntoProtectedData('stockMaterialId',null)
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
        this.insertIntoProtectedData('stockMaterialId',Number(GetDBElements('Commercial_Model','stock_material_id','commercial_model_id',this.getCommercialModelId())))
        this.insertIntoProtectedData('minStock',Number(GetDBElements('Commercial_Model','min_stock','commercial_model_id',this.getCommercialModelId())))
    }
    
    async createName() {
        if (this.getName() == null){
            const names = await loadNames();
            let newName = 'Regular Store'
            switch (Number(this.getStockMaterialId())){
                case(10):
                    newName = names.commercialFishStore.generate();
                case(11):
                    newName = names.commercialBakedStore.generate();
                case(12):
                    newName = names.commercialButcherStore.generate();
                }
            await this.insertIntoProtectedData('name',newName)
        }
    }

    async createCommercial(){
        if (this.getCommercialId() == null){
            await InsertDB('Commercial','(building_id,commercial_model_id)',"("+String(this.getBuildingId())+","+String(this.getCommercialModelId())+")")
            const id = returnRecentlyAddedEntity('Commercial','commercial_id')
            this.insertIntoProtectedData("commercialId", id);
        }
    }
    
    async createJobs(){
        

        if (GetDBElements("Employer","employer_listing_id","building_id",this.getBuildingId()).length == 0){
            let jobsToAdd = GetDBElements('Employer_Template_Commercial','job_id','commercial_model_id',await this.getCommercialModelId())
            for (let job of jobsToAdd){
                for (let i = 0; i < GetDBElementsDoubleCondition('Employer_Template_Commercial','amount','commercial_model_id',await this.getCommercialModelId(),'job_id',job)[0]; i++){
                    InsertDB('Employer','(building_id,job_id,citizen_id)','('+this.getBuildingId()+','+job+',null)')
                }
            }
        }
        printTable('Employer')
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

    applicationForJob(citizen,job){
        const minWeeks = GetDBElements('Job','min_education_weeks','job_id',GetDBElements('Employer','job_id','employer_listing_id',job)[0])[0]
        const importance = GetDBElements('Job','importance','job_id',GetDBElements('Employer','job_id','employer_listing_id',job)[0])[0]
        const eduDifference = citizen.getEducationTurns() - minWeeks
        let qualificationFactor = 0
        if (eduDifference >= 0){
            qualificationFactor = GetDBElements('Job','importance','job_id',GetDBElements('Employer','job_id','employer_listing_id',job)[0])[0]
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
        await this.purchase()
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
        stockToBuy *= 2

        //remove this as wages should be paid prior to purchasing
        const jobsCurrent = GetDBElements("Employer","employer_listing_id","building_id",await this.getBuildingId())
        let jobsWorking = []
        jobsCurrent.forEach(job => {
            if (GetDBElements("Employer","citizen_id","employer_listing_id",job)[0] !== null){
            jobsWorking.push(GetDBElements("Employer","job_id","employer_listing_id",job)[0])
            }
        });
        let currentExplicitCosts = 0
        jobsWorking.forEach( job => {
            currentExplicitCosts += GetDBElements("Job","wage","job_id",job)[0]
        })

        let budget = await this.getMoney() - currentExplicitCosts
        if (budget <= 0){
            return
        }

        const listOfPossiblePlacesToBuy = GetDBElementsDoubleCondition("Inventory","inventory_id","material_id",await this.getStockMaterialId())
        let listOfPlacesToBuy = []
        for (const id of listOfPossiblePlacesToBuy){
            if (GetDBElements('Industrial_Model','stock_made_material_id','industrial_model_id',await GetDBElements('Industrial','industrial_model_id','industrial_id',await GetDBElements('Inventory','industrial_id','inventory_id',id)[0])[0])[0]  == this.getStockMaterialId()){
                listOfPlacesToBuy.push(id)
            }
        }
        //the list is then shuffled to ensure that there is no bias towards the oldest sellers

        for (const inventory of listOfPlacesToBuy){
            //theortical max is how much could they spend if they spent ALL of their money?
            const theoreticalMax = budget / localStockPrice
            //how much does the seller have
            const sellerStockQuantity = GetDBElements("Inventory","inventory_amount","inventory_id",inventory)[0]
            if (sellerStockQuantity > 0){
                const industrialSeller = LoadObject.constructIndustrial(await GetDBElements("Inventory","industrial_id","inventory_id",inventory)[0])
                await industrialSeller.init()
                await industrialSeller.buyStock(inventory,Math.min(sellerStockQuantity, stockToBuy, theoreticalMax))
                await industrialSeller.save()
                this.insertIntoProtectedData('stockQuantity',this.getStockQuantity() + Math.min(sellerStockQuantity, stockToBuy, theoreticalMax))
                this.insertIntoProtectedData('money',this.getMoney() - Math.min(sellerStockQuantity, stockToBuy, theoreticalMax) * localStockPrice)
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

        /*
        while (budget > importStockPrice && stockToBuy > 0) {
            budget -= importStockPrice;
        }*/
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
    //money;

    constructor(name, buildingId,industrialId,industrialModelId,money){
        super(name,buildingId)
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

        await this.createJobs()
    }
    
    async importModelValues(){
        this.insertIntoProtectedData('stockMadeMaterialId',Number(GetDBElements('Industrial_Model','stock_made_material_id','industrial_model_id',this.getIndustrialModelId())[0]))
        this.insertIntoProtectedData('stockMadeQuantity',Number(GetDBElements('Industrial_Model','stock_made_quantity','industrial_model_id',this.getIndustrialModelId())[0]))

        const requirementIds = await GetDBElements('Industrial_Model_Requirement','industrial_model_requirement_id','industrial_model_id', this.getIndustrialModelId())

        for (const id of requirementIds){
            const minQuantity = await GetDBElements('Industrial_Model_Requirement','min_quantity','industrial_model_requirement_id',id)
            const materialId = await GetDBElements('Industrial_Model_Requirement','material_id','industrial_model_requirement_id',id)
            const current = this.getRequirements()
            if (current == null){
                this.insertIntoProtectedData('nventory',[id,materialId,minQuantity])
                continue
            }
            this.insertIntoProtectedData('inventory',[...current,[id,materialId,minQuantity]])
            console.log(this.getInventory())
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
                }
            await this.insertIntoProtectedData('name',newName)
        }
    }

    async createIndustrial(){
        if (this.getIndustrialId() == null){
            await InsertDB('Industrial','(building_id,industrial_model_id)',"("+String(this.getBuildingId())+","+String(this.getIndustrialModelId())+")")
            const id = returnRecentlyAddedEntity('Industrial','industrial_id')
            this.insertIntoProtectedData("industrialId", id);
        }
    }
    
    async createJobs(){
        
        if (GetDBElements("Employer","employer_listing_id","building_id",this.getBuildingId()).length == 0){
            let jobsToAdd = GetDBElements('Employer_Template_Industrial','job_id','industrial_model_id',await this.getIndustrialModelId())
            for (let job of jobsToAdd){
                for (let i = 0; i < GetDBElementsDoubleCondition('Employer_Template_Industrial','amount','industrial_model_id',await this.getIndustrialModelId(),'job_id',job)[0]; i++){
                    InsertDB('Employer','(building_id,job_id,citizen_id)','('+this.getBuildingId()+','+job+',null)')
                }
            }
        }
    }


    getInventory() {
        return this.getProtectedData().getInventory;
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

    applicationForJob(citizen,job){
        const minWeeks = GetDBElements('Job','min_education_weeks','job_id',GetDBElements('Employer','job_id','employer_listing_id',job)[0])[0]
        const importance = GetDBElements('Job','importance','job_id',GetDBElements('Employer','job_id','employer_listing_id',job)[0])[0]
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
        //await this.purchase()
    }

    async purchase(){
        /*
        const stockQuantity = await this.getStockQuantity()
        const minStock = await this.getMinStock()
        const stockToBuy = stockQuantity - minStock
        if (stockToBuy >= 0){
            return
        }
        const jobsCurrent = GetDBElements("Employer","employer_listing_id","employer_id",this.getEmployerId())
        let jobsWorking = []
        jobsCurrent.forEach(job => {
            if (GetDBElements("Employer","citizen_id","employer_listing_id",job)[0] !== null){
            jobsWorking.push(GetDBElements("Employer","job_id","employer_listing_id",job)[0])
            }
        });
        let currentExplicitCosts = 0
        jobsWorking.forEach( job => {
            currentExplicitCosts += GetDBElements("Job","wage","job_id",job)
        })
        console.log(currentExplicitCosts)
        const importStockPrice = GetDBElements()*/
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
        const buildingId =  this.getBuildingId();
        const industrialId = this.getIndustrialId()
        const industrialModelId =  this.getIndustrialModelId();
        const inventory =  this.getInventory()
        const money =  this.getMoney();

        saveIndustrial(industrialId, buildingId, industrialModelId, money, inventory)
    }
}

class LoadObject{

    static async constructCitizen(citizenId){
        const citizenName = GetDBElements("Citizen","name","citizen_id",citizenId);
        const citizenParentId = GetDBElements("Citizen","parent_id","citizen_id",citizenId) || null;
        const citizenGroupId = GetDBElements("Group_Collection","group_id","citizen_id",citizenId);
        const citizenTurnOfBirth = GetDBElements("Citizen","turn_of_birth","citizen_id",citizenId) || 0;
        const citizenMoney = GetDBElements("Citizen","money","citizen_id",citizenId);
        const citizenResidentialId = GetDBElements("Citizen","residentialId","citizen_id",citizenId);
        const citizenEducationTurns = GetDBElements("Citizen","educationTurns","citizen_id",citizenId);

        return new Citizen(citizenName,citizenParentId,citizenGroupId,citizenTurnOfBirth,citizenMoney,citizenResidentialId,citizenEducationTurns)
    }

    static async constructResidential(residentialId){
        const buildingId = GetDBElements("Residential","building_id","residential_id",residentialId);
        const residentialName = GetDBElements("Building","name","building_id",buildingId);
        const residentialChar = GetDBElements("Building","name","city_visulisation_char",buildingId);
        const residentialModelId = GetDBElements("Residential","residential_model_id","residential_id",residentialId);
        
        return new Residential(residentialName, buildingId, residentialChar,residentialModelId,residentialId)
    }

    static async constructCommmercial(commercialId){
        const buildingId = GetDBElements('Commercial','building_id','commercial_id',commercialId)[0]
        const name = GetDBElements('Building','name','building_id',buildingId)[0]
        const commercialModelId = GetDBElements('Commercial','commercial_model_id','commercial_id',commercialId)[0]
        const stockQuantity = GetDBElements('Commercial','stock_quantity','commercial_id',commercialId)[0]
        const money = GetDBElements('Commercial','money','commercial_id',commercialId)[0]

        return new Commercial(name,buildingId,commercialId,commercialModelId,stockQuantity,money)
    }

    static async constructIndustrial(industrialId){
        const buildingId = GetDBElements('Industrial','building_id','industrial_id',industrialId)[0]
        const name = GetDBElements('Building','name','building_id',buildingId)[0]
        const IndustrialModelId = GetDBElements('Industrial','industrial_model_id','industrial_id',industrialId)[0]
        const money = GetDBElements('Industrial','money','industrial_id',industrialId)[0]

        return new Industrial(name,buildingId,industrialId,IndustrialModelId,money)
    }
}

class SortingObject{
    static mergeSort(array, indexOfComparison) {

        if (array.length <= 1) 
            {return array}
        let middle = Math.floor(array.length / 2)
        
        let left = mergeSort(array.slice(0, middle),indexOfComparison)
        let right = mergeSort(array.slice(middle),indexOfComparison)

        return merge(left, right, indexOfComparison)
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


}
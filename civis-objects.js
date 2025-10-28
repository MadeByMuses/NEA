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

    //commercial names
    const commercialFishStore = new NameGenerator(["Fish","Fishy","Seafood","Prawn","Squid","Fish-finger","Seafarer","Blue"],[...commercialLastNames,"monger","shack","bar","ocean","catch"],false)
    const commercialBakedStore = new NameGenerator([...commercialFirstNames,"Pudding","Sweet","Baking","Treat","Sugar","Bready","Toasty",""],[...commercialFirstNames,"bakery","hut","emporium","paradise","oven"],false)
    const commercialButcherStore = new NameGenerator(["Slaughter","Meaty","Meat","Raw","Red","Slicing","Cut"],[...commercialLastNames,"house","butchers","butchery","cow","pig","chicken","meat","bits","chunks"],false)

    //for the citizens
    const humanNames = new NameGenerator(humanFirstNames,humanLastNames,false)
    const humanNamesChild = new NameGenerator(humanFirstNames,[lastName],false)

    return {entityNames,buildingNames,residentialNames,residentialBudgetNames,residentialLowerNames,humanNames,humanNamesChild,commercialFishStore,commercialBakedStore,commercialButcherStore}
}

//Simulates protected variables
const protectedData = new WeakMap();

class Entity{
    //name; 

    constructor (name){
        this.insertIntoProtectedData('name',name || null)
    }

    //initialisation funciton
    async init(){
        await this.createName()
    }

    getProtectedData (){
        return protectedData.get(this);
    }

    insertIntoProtectedData(key,data){
        //set protected Data to be what it currently is AND the new data with its key
        protectedData.set(this,{...this.getProtectedData(),[key] : data})
        return
    }

    getName (){
        return this.getProtectedData().name;
    }
    
    async createName() {
        if (this.getName() === null){
            const names = await loadNames();
            const newName = names.entityNames.generate();
            await this.insertIntoProtectedData('name',newName)
        }
        return
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

    getCityVisulisationChar(){
        return this.getProtectedData().cityVisulisationChar;
    }

    getBuildingId(){
        return this.getProtectedData().buildingId;
    }

    async createBuilding(){
        if (this.getBuildingId() === null) {
            await InsertDB('Building','(name)',`("`+String(this.getName())+`")`)
            const id = await returnRecentlyAddedEntity('Building','building_id')
            this.insertIntoProtectedData("buildingId", id);
        }
    }

    async createName() {
        if (this.getName() == null){
            const names = await loadNames();
            const newName = names.buildingNames.generate();
            await this.insertIntoProtectedData('name',newName)
        }
    }

    //initialisation funciton
    async init() {
        await super.init()

        await this.createName()

        await this.createBuilding();
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

    async createResidential(){
        if (this.getResidentialId() == null){
            await InsertDB('Residential','(building_id,residential_model_id)',"("+String(this.getBuildingId())+","+String(this.getResidentialModelId())+")")
            const id = returnRecentlyAddedEntity('Residential','residential_id')
            this.insertIntoProtectedData("residentialId", id);
        }
    }
    
    async createName() {
        if (this.getName() == null){
            const names = await loadNames();
            const newName = names.residentialNames.generate();
            await this.insertIntoProtectedData('name',newName)
        }
    }

    async importModelValues(){
        //based on this object's residentialModelId, get the attributes
        this.insertIntoProtectedData('maxResidents',GetDBElements('Residential_Model','max_groups','residential_model_id',this.getResidentialModelId()))
        this.insertIntoProtectedData('rent',GetDBElements('Residential_Model','rent','residential_model_id',this.getResidentialModelId()))
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
        const loader = new LoadObject();
        for (citizenId of citizenIds){
            const citizen = loader.constructCitizen(citizenIds)
            await citizen.payRentShare(this.getRent())
        }
    }

    //initialisation funciton
    async init() {
        //polymorphic functions
        await this.createName()

        await this.importModelValues()

        //get the unchanged functions
        await super.init()

        //this is here cause I need the buildingId
        await this.createResidential()
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

    async createName() {
        if (this.getName() == null){
            const names = await loadNames();
            const newName = names.residentialBudgetNames.generate();
            await this.insertIntoProtectedData('name',newName)
        }
        return
    }

    //initialisation funciton
    async init(){
        await this.createName()

        await super.init()
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

    async createCitizenId(){
        if (this.getCitizenId() == null){
            await InsertDB('Citizen','(name)',`("`+String(this.getName())+`")`)
            const id = await returnRecentlyAddedEntity('Citizen','citizen_id')
            this.insertIntoProtectedData("citizenId", id);
        }
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
        console.log(this.getResidentialId() == null)
        if(this.getResidentialId() == null){
            await this.findHouse()
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

    async init(){

        await this.createName()

        await this.createCitizenId()

        await this.createGroupId()
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
    //employerId;
    //commercialId
    //commercialModelId;
        //stockMaterialId
        //maxStaff
    //stockQuantity
    //money;

    constructor(name, buildingId,commercialId,commercialModelId,employerId,stockQuantity,money){
        super(name,buildingId)
        this.insertIntoProtectedData('commercialId',commercialId)
        this.insertIntoProtectedData('commercialModelId',commercialModelId)
        this.insertIntoProtectedData('stockQuantity',stockQuantity)
        this.insertIntoProtectedData('money',money)
        this.insertIntoProtectedData('employerId',employerId)
        this.insertIntoProtectedData('stockMaterialId',null)
        this.insertIntoProtectedData('maxStaff',0)
    }    
    
    async importModelValues(){
        this.insertIntoProtectedData('stockMaterialId',GetDBElements('Commercial_Model','stock_material_id','commercial_model_id',this.getCommercialModelId()))
        this.insertIntoProtectedData('maxStaff',GetDBElements('Commercial_Model','max_staff','commercial_model_id',this.getCommercialModelId()))
    }

    async createCommercial(){
        if (this.getCommercialId() == null){
            await InsertDB('Commercial','(building_id,commercial_model_id)',"("+String(this.getBuildingId())+","+String(this.getCommercialModelId())+")")
            const id = returnRecentlyAddedEntity('Commercial','commercial_id')
            this.insertIntoProtectedData("commercialId", id);
        }
    }
    
    async createName() {
        if (this.getName() == null){
            const names = await loadNames();
            let newName = 'Regular Store'
            switch (this.getStockMaterialId()){
                case (10):
                    names.commercialFishStore.generate();
                case(11):
                    names.commercialBakedStore.generate();
                case(12):
                    names.commercialButcherStore.generate();
                }
            await this.insertIntoProtectedData('name',newName)
        }
    }

    getEmployerId() {
        return this.getProtectedData().employerId;
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

    async init(){
        //import has to come first since names are dependent on stockId
        await this.importModelValues()

        await this.createName()

        await super.init();

        await this.createCommercial()
    }

    async save() {
        //employerId;
        //commercialId
        //commercialModelId;
            //stockMaterialId
            //maxStaff
        //stockQuantity
        //money;
        await super.save()
        const buildingId = await this.getBuildingId();
        const employerId = await this.getEmployerId();
        const commercialModelId = await this.getCommercialModelId();
        const commercialId = await this.getCommercialId();
        const stockQuantity = await this.getStockQuantity();
        const money = await this.getMoney();

        saveCommercial(commercialId, buildingId, commercialModelId, employerId, stockQuantity, money)
    }
}

class LoadObject{

    async constructCitizen(citizenId){
        const citizenName = GetDBElements("Citizen","name","citizen_id",citizenId);
        const citizenParentId = GetDBElements("Citizen","parent_id","citizen_id",citizenId) || null;
        const citizenGroupId = GetDBElements("Group_Collection","group_id","citizen_id",citizenId);
        const citizenTurnOfBirth = GetDBElements("Citizen","turn_of_birth","citizen_id",citizenId) || 0;
        const citizenMoney = GetDBElements("Citizen","money","citizen_id",citizenId);
        const citizenResidentialId = GetDBElements("Citizen","residentialId","citizen_id",citizenId);
        const citizenEducationTurns = GetDBElements("Citizen","educationTurns","citizen_id",citizenId);

        return new Citizen(citizenName,citizenParentId,citizenGroupId,citizenTurnOfBirth,citizenMoney,citizenResidentialId,citizenEducationTurns)
    }

    async constructResidential(residentialId){
        const buildingId = GetDBElements("Residential","building_id","residential_id",residentialId);
        const residentialName = GetDBElements("Building","name","building_id",buildingId);
        const residentialChar = GetDBElements("Building","name","city_visulisation_char",buildingId);
        const residentialModelId = GetDBElements("Residential","residential_model_id","residential_id",residentialId);
        
        return new Residential(residentialName, buildingId, residentialChar,residentialModelId,residentialId)
    }

    async constructCommmercial(commercialId){
        const buildingId = GetDBElements('Commercial','building_id','commercial_id',commercialId)
        const name = GetDBElements('Building','name','building_id',buildingId)
        const employerId = GetDBElements('Commercial','employerId','commercial_id',commercialId)
        const commercialModelId = GetDBElements('Commercial','commercialModelId','commercial_id',commercialId)
        const stockQuantity = GetDBElements('Commercial','stockQuantity','commercial_id',commercialId)
        const money = GetDBElements('Commercial','money','commercial_id',commercialId)

        return new Commercial(name,buildingId,commercialId,commercialModelId,employerId,stockQuantity,money)
    }
}
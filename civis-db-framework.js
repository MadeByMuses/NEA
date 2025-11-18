//This needs to be global, as every script may need to use the database
let db;


// ADAPTED FROM SQL.JS DOCS
async function NewDB(CityName) {
  if (db){
    console.warn('Database already exists');
    return;
  }
  const SQL = await initSqlJs({
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
  })
  db = new SQL.Database(); // Creates new empty DB

  // Run a query

  //City Database
  db.run('CREATE TABLE City (city_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(24) NOT NULL, start_date T, money_symbol VARCHAR(1));')
  //Prepare the SQL
  const CITYSQL = db.prepare("INSERT INTO City (name, start_date,money_symbol) VALUES (?,?,'$');")
  //SQL Injection prevention
  CITYSQL.run([CityName, Date.now()])

  //City_attribute table
  db.run(`CREATE TABLE City_Attribute (city_attribute_id INTEGER PRIMARY KEY, attribute_name VARCHAR(64), attribute_key_word VARCHAR(16), attribute_description VARCHAR(128), attribute_value FLOAT, clear_on_simulation BOOLEAN);`)
  db.run(`INSERT INTO City_Attribute (city_attribute_id, attribute_name, attribute_key_word, attribute_description, attribute_value, clear_on_simulation) VALUES 
    (1,"Current turn number","turn","What is the current turn number for the game? Used for date calculations and recording events",0,0),
    (2,"Population","population","How many people live in your town",0,0),
    (3,"Current funds","money","How much money does the city own",5000,0),
    (4,"Incre funds","incre","How much political strength does the city have?",50,0),
    (5,"Currently Purchasing","purchasing","Used to prevent warns - 1 is true and 0 is false",0,0),
    
    (6,"Budget Class House Capacity","budgetc","The limit of the number of Budget Class Houses",0,1),
    (106,"Budget Class House Demand","budgetd","Percentage based demand for Budget Class Houses",0,1),
    (7,"Lower Class House Capacity","lowerc","The limit of the number of Lower Class Houses",0,1),
    (107,"Lower Class House Demand","lowerd","Percentage based demand for Lower Class Houses",0,1),
    (8,"Middle Class House Capacity","middlec","The limit of the number of Middle Class Houses",0,1),
    (108,"Middle Class House Demand","middled","Percentage based demand for Middle Class Houses",0,1),
    (9,"Upper Class House Capacity","upperc","The limit of the number of Upper Class Houses",0,1),
    (109,"Upper Class House Demand","upperd","Percentage based demand for Upper Class Houses",0,1),

    (10,"Low-rent Apartments Capacity","lowrentc","The limit of the number of Low-rent Apartments",0,1),
    (110,"Low-rent Apartments Demand","lowrentd","Percentage based demand for Low-rent Apartments",0,1),
    (11,"Affordable Flats Capacity","affordablec","The limit of the number of Affordable Flats",0,1),
    (111,"Affordable Flats Demand","affordabled","Percentage based demand for Affordable Flats",0,1),
    (12,"Regular Highrise Capacity","regularc","The limit of the number of Regular Highrise",0,1),
    (112,"Regular Highrise Demand","regulard","Percentage based demand for Regular Highrise",0,1),
    (13,"Luxury Skyscraper Capacity","luxuryc","The limit of the number of Luxury Skyscraper",0,1),
    (113,"Luxury Skyscraper Demand","luxuryd","Percentage based demand for Luxury Skyscraper",0,1),

    (14,"Low-Commercial Capacity","lowcomc","The limit of low-commercials",0,1),
    (114,"Low-Commercial Demand","lowcomd","The demand of low-commercials",0,1),
    (15,"High-Commercial Capacity","highcomc","The limit of high-commercials",0,1),
    (115,"High-Commercial Demand","highcomd","The demand of high-commercials",0,1),

    (16,"Forest Industry Capacity","forestc","The limit of forest-industries",0,1),
    (116,"Forest Industry Demand","forestd","The amount of available wood in the city for buying",0,1),
    (17,"Agriculture Industry Capacity","agric","The limit of Agriculture-industries",0,1),
    (117,"Agriculture Industry Demand","agrid","The amount of available agriculture in the city for buying",0,1),

    (100,"Vehicle Capacity","vehiclec","The limit of vehicles on roads",0,1),
    (101,"Vehicle's in use","vehicleu","The number of vehicles on roads",0,1)`)

  //Tutorial Table
  db.run(`CREATE TABLE Tutorial (tutorial_id INTEGER PRIMARY KEY AUTOINCREMENT, completed BOOL NOT NULL, tutorial_title VARCHAR(32), tutorial_description TEXT, tutorial_category TEXT);`)
  db.run(`INSERT INTO Tutorial (completed, tutorial_title, tutorial_description, tutorial_category) VALUES
    (0,"End tutorial","You have finished the tutorial 🎊, please continue enjoying the project and see how large you can make your town","N/A"),
    (0,"Open window","Before we start, welcome to Civis!<br>This is the tutorial window which will be your guide to how to use this website. As you can see the UI is very similiar to your desktop... try to open the <u>'Overview Window' by pressing on the 'Overview' icon</u>.","Windows"),
    (0,"✅ Close window","Wow you learn fast! That is the overview window where you can get data on all things that are vital for planning your town out. You can close the 'Overview Window' now by sliding it off screen (recommended for 📲 mobile users) or by pressing the x ","Windows"),
    (0,"Close tutorial window","You can also close this window, but please remember that the tutorial window can always be popped back up by going into the settings tab. Practise by closing this 'non-draggable' window and reopening it.<br><br><h4 style='margin-top:0px'>Reopen via the 'Settings' icon</h4>","Window");`)
  //This has to be done since the button contains JS
  db.run(`INSERT INTO Tutorial (completed, tutorial_title, tutorial_description, tutorial_category) VALUES (?,?,?,?)`,[
    0,
    "Finish tutorial window",
    `Hey! :D<br>You seem to be pretty good using the 'windows' just press the button below to move onto the REAL fun </p><br><button onclick="UpdateDB('Tutorial','completed',1,'tutorial_id',5)">Continue</button>`,
    "Windows"])
  db.run(`INSERT INTO Tutorial (completed, tutorial_title, tutorial_description, tutorial_category) VALUES
    (0,"Policies","Policies is how your town will grow! Policies can help promote development, add quality of life services, or help tailor your town to your own preference. To get started you need to 'have' policies, let's click on the 'policy purchase' icon to the side","Policies"),
    (0,"Buy policy pack","As you can see, there is only one 'policy pack' for you to purchase. Purchase the 'founding pack'.","Policies"),
    (0,"Open policy window","Good job! You got a nice selection of policies 😉.<br>Notice how you didn't purchase it with your money? Policies are purchased by a different form of currency, the Incre (§), we will discuss how to gain Incre later.<br>Now click the 'Policy Panel' icon and then 'All'","Policies"),
    (0,"Act the policies","In this panel you can look at all of the policies you have collected over the game and choose which ones to implement. You can add or remove active policies, why not pressing on 'Activate Policy'","Policies"),
    (0,"Act all the policies","Great job! You have activated your first policy, continue activating all your unlocked policies.","Policies");`)
  //This has to be done since the button contains JS
  db.run(`INSERT INTO Tutorial (completed, tutorial_title, tutorial_description, tutorial_category) VALUES (?,?,?,?)`,[
    0,
    "Policy Tip",
    `You have added a policy for residential, commercial and industry (as well as roads)- these are all vital for a city to thrive! More information about each of these topics can be found in the "Docs" icon, and more tips too!</p><br><button onclick="UpdateDB('Tutorial','completed',1,'tutorial_id',11)">Continue</button>`,
    "Policies"])
  db.run(`INSERT INTO Tutorial (completed, tutorial_title, tutorial_description, tutorial_category) VALUES
    (0,"Running the simulation","You have your policies set, so let's go and make it all happen. Click the 'Simulate' icon","Policies")`)

  //Policy Pack table
  db.run(`CREATE TABLE Policy_Pack (policy_pack_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_pack_name VARCHAR(64), policy_pack_description VARCHAR(64),policy_pack_cost float,policy_pack_unlocked BOOL);`)
  db.run(`INSERT INTO Policy_Pack (policy_pack_name,policy_pack_description,policy_pack_cost,policy_pack_unlocked) VALUES
    ("Founding Pack","Vital to start your city",50,1),
    ("warn PACK","This an warn 🚫",0,1);`)

  //Policies
  db.run(`CREATE TABLE Policy (policy_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_name VARCHAR(64), policy_category VARCHAR(64), policy_description VARCHAR (128), policy_act_cost float, dynamic_attribute_id INTEGER, cost_multiplier FLOAT);`)
  db.run(`INSERT INTO Policy (policy_name, policy_description, policy_category,policy_act_cost,dynamic_attribute_id, cost_multiplier) VALUES
    ("This should only be seen for debugging","If you are seeing this then I apologise, something VERY BAD has happened- this is a debug policy which SHOULD NOT BE HAPPENING","Debug",0,null,0),
    ("Roadhouse","lower residential capacity is increased by +3","Building",50,null,0),
    ("Mini-conviniece store","lower commercial capacity is increased by +1","Building",50,null,0),
    ("Small forest site","forest industry capacity is increased by +1","Building",50,null,0),
    ("Wheat garden","agriculture commercial capacity is increased by +1","Building",50,null,0),
    ("Dirt Road initiative","vehicle capacity on roads is increased by +100<br>Upkeep is based on number of vehicles used","Infrastructure",1000,101,5)`)

  //Policy_Pack_Policy for Many to Many relationships
  db.run(`CREATE TABLE Policy_Pack_Policy (policy_pack_policy_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_pack_id INTEGER, policy_id INTEGER, slot INTEGER,FOREIGN KEY (policy_pack_id) REFERENCES Policy_Pack(policy_pack_id), FOREIGN KEY (policy_id) REFERENCES Policy(policy_id))`)
  db.run(`INSERT INTO Policy_Pack_Policy (policy_pack_id,policy_id,slot) VALUES
    (2,1,1),
    (1,2,1),
    (1,3,2),
    (1,4,3),
    (1,5,3),
    (1,6,4)`)
  
  db.run(`CREATE TABLE Policy_Effect (policy_effect_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_id INTEGER, city_attribute_id INTEGER, delta_value FLOAT, method VARCHAR, FOREIGN KEY (policy_id) REFERENCES Policy(policy_id), FOREIGN KEY (city_attribute_id) REFERENCES City_Attribute(city_attribute_id))`)
  db.run(`INSERT INTO Policy_Effect (policy_id,city_attribute_id,delta_value, method) VALUES
  (2,6,3,'add'),
  (3,14,1,'add'),
  (4,16,1,'add'),
  (5,17,1,'add'),
  (6,100,100,'add')`)

  db.run(`CREATE TABLE Policy_Collection (policy_collection_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_id INTEGER, policy_active BOOL, FOREIGN KEY (policy_id) REFERENCES Policy(policy_id))`)

  db.run(`CREATE TABLE Building (building_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(128), city_visulisation_char CHAR(1))`)
  db.run(`CREATE TABLE Inventory (inventory_id INTEGER PRIMARY KEY AUTOINCREMENT, industrial_id INTEGER, material_id INTEGER, quantity INTEGER, FOREIGN KEY (industrial_id) REFERENCES Industrial(industrial_id), FOREIGN KEY (material_id) REFERENCES Material(material_id))`)
  db.run(`CREATE TABLE Industrial (industrial_id INTEGER PRIMARY KEY AUTOINCREMENT, building_id INTEGER, industrial_model_id INTEGER, money FLOAT, FOREIGN KEY (building_id) REFERENCES building(building_id))`)
  db.run(`CREATE TABLE Industrial_Model (industrial_model_id INTEGER PRIMARY KEY AUTOINCREMENT, stock_made_material_id INTEGER, stock_made_quantity INTEGER NOT NULL, FOREIGN KEY (stock_made_material_id) REFERENCES Material(material_id))`)
  db.run(`INSERT INTO Industrial_Model (industrial_model_id, stock_made_material_id, stock_made_quantity) VALUES
    (1,1,100),
    (2,2,100)`)
  db.run(`CREATE TABLE Industrial_Model_Requirement (industrial_model_requirement_id INTEGER PRIMARY KEY AUTOINCREMENT, industrial_model_id INTEGER, material_id INTEGER NOT NULL, min_quantity INTEGER, quantity_used INTEGER, FOREIGN KEY (material_id) REFERENCES Material(material_id), FOREIGN KEY (industrial_model_id) REFERENCES Industrial_Model(industrial_model_id))`)
  db.run(`INSERT INTO Industrial_Model_Requirement (industrial_model_id, material_id, min_quantity, quantity_used) VALUES
    (0,0,0,0)`)
  db.run(`CREATE TABLE Commercial (commercial_id INTEGER PRIMARY KEY AUTOINCREMENT, building_id INTEGER, commercial_model_id INTEGER, stock_quantity INTEGER, money FLOAT, FOREIGN KEY (building_id) REFERENCES building(building_id))`)
  db.run(`CREATE TABLE Commercial_Model (commercial_model_id INTEGER PRIMARY KEY AUTOINCREMENT, stock_material_id INTEGER, min_stock INTEGER NOT NULL, type VARCHAR(16), FOREIGN KEY (stock_material_id) REFERENCES Material(material_id))`)
  db.run(`INSERT INTO Commercial_Model (stock_material_id, min_stock ,type) VALUES 
    (1,25,'primary'),
    (2,25,'primary'),
    
    (10,35,'regular'),
    (11,35,'regular'),
    (12,35,'regular')`)  
  db.run(`CREATE TABLE Employer_Template_Commercial (employer_template_commercial_id INTEGER PRIMARY KEY AUTOINCREMENT, commercial_model_id INTEGER, job_id INTEGER, amount INTEGER, FOREIGN KEY (commercial_model_id) REFERENCES Commercial_Model(commercial_model_id), FOREIGN KEY (job_id) REFERENCES Job(job_id))`)
  db.run(`INSERT INTO Employer_Template_Commercial (commercial_model_id, job_id, amount) VALUES
    (3,3,4),
    (4,2,2),
    (4,4,3),
    (5,2,2),
    (5,5,2)`)
  db.run(`CREATE TABLE Employer_Template_Industrial (employer_template_industrial_id INTEGER PRIMARY KEY AUTOINCREMENT, industrial_model_id INTEGER, job_id INTEGER, amount INTEGER, FOREIGN KEY (industrial_model_id) REFERENCES Industrial_Model(industrial_model_id), FOREIGN KEY (job_id) REFERENCES Job(job_id))`)
  db.run(`INSERT INTO Employer_Template_Industrial (industrial_model_id, job_id, amount) VALUES
  (1,6,5),
  (2,7,5)`)
  db.run(`CREATE TABLE Employer (employer_listing_id INTEGER PRIMARY KEY AUTOINCREMENT, building_id INTEGER,job_id INTEGER, citizen_id INTEGER, FOREIGN KEY (citizen_id) REFERENCES Citizen(citizen_id), FOREIGN KEY (job_id) REFERENCES Job(job_id), FOREIGN KEY (building_id) REFERENCES Building(building_id))`)
  db.run(`CREATE TABLE Job (job_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(24), wage FLOAT, min_education_weeks INTEGER, importance FLOAT)`)
  db.run(`INSERT INTO Job (name,wage,min_education_weeks,importance) VALUES
    ("CEO",500,200,1),
    ("Store clerk",150,0,0.5),
    ("Fishmonger",155,10,0.8),
    ("Baker",155,10,0.8),
    ("Butcher",155,10,0.8),
    ("Lumberjack",155,15,0.6),
    ("Farmer",155,25,0.6)
    `)
  db.run(`CREATE TABLE Material (material_id INTEGER PRIMARY KEY, name VARCHAR(128), local_price FLOAT, trade_price FLOAT)`)
  db.run(`INSERT INTO Material (material_id,name, local_price, trade_price) VALUES
    (1,'Wood', 3, 5),
    (2,'Agriculture', 2, 5),
    (10,'Processed Fish', 4, 7),
    (11,'Baked Goods', 4, 8),
    (12,'Meat', 3, 8)`)
  db.run(`CREATE TABLE Residential (residential_id INTEGER PRIMARY KEY AUTOINCREMENT, building_id INTEGER, residential_model_id INTEGER, FOREIGN KEY (residential_model_id) REFERENCES Residential_Model(residential_model_id))`)
  db.run(`CREATE TABLE Residential_Model (residential_model_id INTEGER PRIMARY KEY AUTOINCREMENT, max_groups INTEGER, rent FLOAT, type VARCHAR(16))`)
  db.run(`INSERT INTO Residential_Model (max_groups, rent, type) VALUES
    (2,25,'budget'),
    (3,25,'budget'),
    (4,25,'budget'),
    (5,20,'budget')`)
  db.run(`CREATE TABLE Citizen (citizen_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(32), parent_id INTEGER,turn_of_birth INTEGER, money FLOAT, residential_id INTEGER, education_weeks INTEGER, dead BOOLEAN)`)
  db.run(`CREATE TABLE Group_Collection (group_collection_id INTEGER PRIMARY KEY AUTOINCREMENT, group_id INTEGER, citizen_id INTEGER, FOREIGN KEY (citizen_id) REFERENCES Citizen(citizen_id))`)
  db.run(`CREATE TABLE Group_Residential_Collection (group_residential_id INTEGER PRIMARY KEY AUTOINCREMENT, group_id INTEGER, residential_id INTEGER, FOREIGN KEY (group_id) REFERENCES Group_Collection(group_id), FOREIGN KEY (residential_id) REFERENCES Residential(residential_id))`)

  if (!debugMode){
    StartUp()
  };
}


//LOAD function
function LoadDB(){
  initSqlJs({
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
  }).then(SQL => {
  const file = document.getElementById('FormLoadDB').files[0];
  if (!file) {
    console.warn('No file selected');
    document.getElementById('Formwarn').textContent = 'Invalid File'
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const Uints = new Uint8Array(event.target.result);
    db = new SQL.Database(Uints);
    printTable('City');
    document.getElementById('ForFormLoadDB').textContent = 'Successfully imported!'
    document.getElementById('FormContent').innerHTML += `
    <br>
    <button onclick="StartUp()" style="margin-left:130px">Begin</button>`
  }
  reader.readAsArrayBuffer(file)})
}

//EXPORT function
function ExportDB() {
    //Name of file that is gonna get exported
    const filename = 'CIVIS.sqlite'
    //Export function
    const binaryArray = db.export();
    //Blob download in Uint8Array
    const blob = new Blob([binaryArray], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    //Sneaky download
    const downloadlink = document.createElement('a');
    downloadlink.href = url;
    downloadlink.download = filename;
    document.body.appendChild(downloadlink);
    //This seems sketchy tbh - but it isn't 🤷
    downloadlink.click();
    document.body.removeChild(downloadlink); //And like that it is gone
    URL.revokeObjectURL(url);
}

//CRUD PRINCIPLES
//CREATE
function InsertDB(table, attribute_reference, attribute_value){
  console.log("Adding " + attribute_value + " into " + table)
  const stmt = db.prepare(`INSERT INTO ${table} ${attribute_reference} VALUES ${attribute_value}`)
  stmt.step()
  stmt.free()
  return
}

async function returnRecentlyAddedEntity(table, attribute_primary_key){
  const output = await GetDBElements(table,attribute_primary_key,null,null)
  return Math.max(output.length)
}

//READ
function GetDBElements(table,attribute,whereAttribute,whereAttributeValue) {
  let result = []
  let stmt = null
  //This is mainly implemented for the city table since there will never need to be a where clause
  if (whereAttribute === null || whereAttributeValue === null){
    console.log('Getting data in the table ' + table + ' under the attribute: ' + attribute)
    stmt = db.prepare('SELECT '+ attribute +' FROM ' + table)
    while (stmt.step()){
      let row = stmt.getAsObject()
      result.push(row[attribute])
    }
    if (result.length === 0){
      console.warn('There was no data in ' + table + ' that refers to ' + attribute)
    }
  }
  //
  else{
    console.log('Getting data in the ' + table + ' under the attribute: ' + attribute + '; the data is also expecetd to have an attribute ' + whereAttribute + ' of ' + whereAttributeValue)
    stmt = db.prepare('SELECT '+ attribute + ' FROM ' + table + ' WHERE ' + whereAttribute + ' = ?')
    stmt.bind([whereAttributeValue])
    while (stmt.step()){
      let row = stmt.getAsObject()
      result.push(row[attribute])
    }
    if (result.length === 0){
      console.warn('There was no data in ' + table + ' that refers to ' + attribute + ' with a ' + whereAttribute + ' of ' + whereAttributeValue)
    }
  }
  stmt.free()
  return result;
};

function GetDBElementsDoubleCondition(table,attribute,whereAttribute1,whereAttributeValue1,whereAttribute2,whereAttributeValue2){
  let result = []
  let stmt = null
  console.log("Getting data in the " + table + " under the attribute: " + attribute + "; the data is also expecetd to have an attribute " + whereAttribute1 + " of " + whereAttributeValue1 + " and " + whereAttribute2 + " of " + whereAttributeValue2)
  stmt = db.prepare('SELECT '+ attribute +' FROM ' + table + ' WHERE ' + whereAttribute1 + ' = ' + whereAttributeValue1 + ' AND ' + whereAttribute2 + ' = ' + whereAttributeValue2)
  while (stmt.step()){
    let row = stmt.getAsObject()
    result.push(row[attribute])
  }
  if (result.length === 0){
    console.warn("There was no data in " + table + " that refers to " + attribute + " with a " + whereAttribute1 + " of " + whereAttributeValue1 + " and " + whereAttribute2 + " of " + whereAttributeValue2)
  }
  stmt.free()
  return result;
}

//UPDATE
function UpdateDB(table,attribute,attributeReplacement,whereAttribute,whereAttributeValue) {
  console.log("Updating " + table + " where " + whereAttribute + " is " + whereAttributeValue + " so " + attribute + " is now " + attributeReplacement)
  db.run("UPDATE " + table + " SET " + attribute + " = '" + attributeReplacement + "' " + " WHERE " + whereAttribute + " = " + whereAttributeValue)
  //Update the Tutorial Window if it exists
  if (table === 'Tutorial' && document.getElementById("TutorialWindowContent")){
    UpdateTutorial()
  }
  else if (table === 'City'){
    document.getElementById("TaskbarCurrentFunds").innerText = "Current funds: " + GetDBElements("City","money_symbol",null,null)[0] + FormattedNumber(GetDBElements("City_Attribute","attribute_value","city_attribute_id",3),"currency")
  }
  return
}


//DEBUG

//CONSOLE PRINT function
function printTable(tableName) {
  console.log('The following is the current data in the table ' + tableName)
    if (!db) {
    console.warn('db is undefined, stop trying to run queries!');
    return;
    }
    //Get it all
  const printTableSQL = db.prepare(`SELECT * FROM ${tableName}`);
  //Each row
  while (printTableSQL.step()) {
    //log it 🪵
    console.log(printTableSQL.getAsObject());
  } 
}



//POLICIES
function PoliciesInPolicyPack(id) {
  let result = [];

  const stmt = db.prepare(`SELECT DISTINCT Policy_Pack_Policy.policy_id FROM Policy_Pack_Policy INNER JOIN Policy ON Policy_Pack_Policy.policy_id = Policy.policy_id WHERE policy_pack_id = ` + id + ` ORDER BY policy_category DESC, policy_name DESC`);

  while (stmt.step()) {
    const row = stmt.getAsObject();
    result.push(row.policy_id);
  }

  stmt.free();
  return result;
}

function PoliciesInPolicyPackSlot(id,slot){
  let result = [];
  const stmt = db.prepare(`SELECT policy_id FROM Policy_Pack_Policy WHERE policy_pack_id = ` + id + ` AND slot = ` + slot);

  while (stmt.step()) {
    const row = stmt.getAsObject();
    result.push(row.policy_id);
  }

  stmt.free();
  return result;
}

function UnlockedPolicies(category){
  let result = [];
  let stmt;
  if (category !== null){
   stmt = db.prepare(`SELECT DISTINCT Policy_Collection.policy_id FROM Policy_Collection INNER JOIN Policy ON Policy_Collection.policy_id = Policy.policy_id WHERE policy_category = ` + category + ` ORDER BY policy_name DESC`);
  }
  else{
    stmt = db.prepare(`SELECT DISTINCT Policy_Collection.policy_id FROM Policy_Collection INNER JOIN Policy ON Policy_Collection.policy_id = Policy.policy_id ORDER BY policy_name DESC`);
  }
  while (stmt.step()) {
    const row = stmt.getAsObject();
    result.push(row.policy_id);
  }

  stmt.free();
  return result;
}

//db.run(`CREATE TABLE Building (building_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(128), city_visulisation_char CHAR(1))`)
function saveBuilding(buildingId, buildingName, buildingCityVisulisationChar){
  if (buildingCityVisulisationChar == null) {
    buildingCityVisulisationChar = ' '
  }

  console.log(`building of buildingId ${buildingId} is being saved`)
  if (!buildingId){
    console.error("BuildingId is not valid")
    return
  }

  db.run(`UPDATE Building SET name = "${buildingName}", city_visulisation_char = ${Number(buildingCityVisulisationChar)} WHERE building_id = ${Number(buildingId)}`)

}

//db.run(`CREATE TABLE Residential (residential_id INTEGER PRIMARY KEY AUTOINCREMENT, building_id INTEGER, residential_model_id INTEGER, FOREIGN KEY (residential_model_id) REFERENCES Residential_Model(residential_model_id))`)
function saveResidential(residentialId, buildingId, residentialModelId){
  console.log(`residential of residentialId ${residentialId} is being saved`)
  if (!residentialId){
    console.error("residentialId is not valid")
    return
  }
  db.run(`UPDATE Residential SET building_id = ${Number(buildingId)}, residential_model_id = ${Number(residentialModelId)} WHERE residential_id = ${Number(residentialId)}`)
}

function saveCommercial(commercialId,buildingId,commercialModelId, stockQuantity, money){
  console.log(`commercial of commercialId ${commercialId} is being saved`)
  if (!commercialId){
    console.error("commercialId is not valid")
    return
  }

  db.run(`UPDATE Commercial SET building_id = ${Number(buildingId)}, commercial_model_id = ${Number(commercialModelId)}, stock_quantity = ${Number(stockQuantity)}, money = ${Number(money)} WHERE commercial_id = ${Number(commercialId)}`)
}

function saveIndustrial(industrialId, buildingId, industrialModelId, money, inventory){
  console.log(`industrial of industrialId ${industrialId} is being saved`)
  if (!industrialId){
    console.error("industrialId is not valid")
    return
  }
  db.run(`UPDATE Industrial SET building_id = ${Number(buildingId)}, industrial_model_id = ${Number(industrialModelId)}, money = ${Number(money)} WHERE industrial_id = ${Number(industrialId)}`)
  for (inv of inventory){
    db.run(`UPDATE Inventory SET quantity = ${Number(inv[2])}, material_id = ${Number(inv[1])} WHERE inventory_id = ${Number(inv[0])}`)
  }
}

//db.run(`CREATE TABLE Citizen (citizen_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(32), parent_id INTEGER,turn_of_birth INTEGER, money FLOAT, education_weeks INTEGER, dead BOOLEAN)`)
async function saveCitizen(citizenId,name,parentId,turnOfBirth,money,residentialId,educationWeeks,dead,groupId){
  console.log("citizen of citizenId " + citizenId + " is being saved")
  if (!citizenId){
    console.error("citizenId is not valid")
    return
  }
  if (parentId != null){
    parentId = Number(parentId)
  }
  //Citizen Table
  db.run(`UPDATE Citizen SET name = "${name}", parent_id = ${parentId},turn_of_birth = ${Number(turnOfBirth)}, money = ${Number(money)}, education_weeks = ${Number(educationWeeks)}, dead = ${Number(dead)} WHERE citizen_id = ${Number(citizenId)};`)

  //Group Collection Table  
  db.run(`UPDATE Group_Collection SET group_id = ${Number(groupId)} WHERE citizen_id = ${Number(citizenId)}`)

  //Group Collection Table
  db.run(`UPDATE Group_Residential_Collection SET residential_id = ${Number(residentialId)} WHERE group_id = ${Number(groupId)}`)
}


function availableHouses(){
  let availableHouses = [];
  const stmt = db.prepare(`SELECT r.residential_id FROM Residential r LEFT JOIN Residential_Model rm ON rm.residential_model_id = r.residential_model_id LEFT JOIN Group_Residential_Collection gc ON r.residential_id = gc.residential_id GROUP BY r.residential_id HAVING COUNT (gc.group_id) < rm.max_groups`);

  while (stmt.step()) {
    const row = stmt.getAsObject();
    availableHouses.push(row.residential_id);
  }

  stmt.free()
  return shuffle(availableHouses)
}


//based off https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  let currentIndex = array.length

  while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }
  return array;
}
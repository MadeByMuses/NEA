//This needs to be global, as every script may need to use the database
let db;


// ADAPTED FROM SQL.JS DOCS
async function NewDB(CityName) {
  if (db){
    console.error("Database already exists");
    return;
  }
  const SQL = await initSqlJs({
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
  })
  db = new SQL.Database(); // Creates new empty DB

  // Run a query

  //City Database
  db.run("CREATE TABLE City (city_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(24) NOT NULL, start_date T, money_symbol VARCHAR(1));")
  //Prepare the SQL
  const CITYSQL = db.prepare("INSERT INTO City (name, start_date,money_symbol) VALUES (?,?,'$');")
  //SQL Injection prevention
  CITYSQL.run([CityName, Date.now()])

  //City_attribute table
  db.run("CREATE TABLE City_Attribute (city_attribute_id INTEGER PRIMARY KEY, attribute_name VARCHAR(64), attribute_description VARCHAR(128), attribute_value FLOAT, clear_on_simulation BOOLEAN);")
  db.run(`INSERT INTO City_Attribute (city_attribute_id, attribute_name, attribute_description, attribute_value, clear_on_simulation) VALUES 
    (1,"Current turn number","What is the current turn number for the game? Used for date calculations and recording events",0,0),
    (2,"Population","How many people live in your town",0,0),
    (3,"Current funds","How much money does the city own",5000,0),
    (4,"Incre funds","How much political strength does the city have?",50,0),
    (5,"Currently Purchasing","Used to prevent errors - 1 is true and 0 is false",0,0),
    
    (6,"Budget Class House Capacity","The limit of the number of Budget Class Houses",0,1),
    (106,"Budget Class House Demand","Percentage based demand for Budget Class Houses",0,1),
    (7,"Lower Class House Capacity","The limit of the number of Lower Class Houses",0,1),
    (107,"Lower Class House Demand","Percentage based demand for Lower Class Houses",0,1),
    (8,"Middle Class House Capacity","The limit of the number of Middle Class Houses",0,1),
    (108,"Middle Class House Demand","Percentage based demand for Middle Class Houses",0,1),
    (9,"Upper Class House Capacity","The limit of the number of Upper Class Houses",0,1),
    (109,"Upper Class House Demand","Percentage based demand for Upper Class Houses",0,1),

    (10,"Low-rent Apartments Capacity","The limit of the number of Low-rent Apartments",0,1),
    (110,"Low-rent Apartments Demand","Percentage based demand for Low-rent Apartments",0,1),
    (11,"Affordable Flats Capacity","The limit of the number of Affordable Flats",0,1),
    (111,"Affordable Flats Demand","Percentage based demand for Affordable Flats",0,1),
    (12,"Regular Highrise Capacity","The limit of the number of Regular Highrise",0,1),
    (112,"Regular Highrise Demand","Percentage based demand for Regular Highrise",0,1),
    (13,"Luxury Skyscraper Capacity","The limit of the number of Luxury Skyscraper",0,1),
    (113,"Luxury Skyscraper Demand","Percentage based demand for Luxury Skyscraper",0,1),

    (14,"Low-Commercial Capacity","The limit of low-commercials",0,1),
    (114,"Low-Commercial Demand","The demand of low-commercials",0,1),
    (15,"High-Commercial Capacity","The limit of high-commercials",0,1),
    (115,"High-Commercial Demand","The demand of high-commercials",0,1),

    (16,"Forest Industry Capacity","The limit of forest-industries",0,1),
    (17,"Agriculture Industry Capacity","The limit of Agriculture-industries",0,1),
    (100,"Vehicle Capacity","The limit of vehicles on roads",0,1),
    (101,"Vehicle's in use","The number of vehicles on roads",0,1)`)

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
    ("ERROR PACK","This an error 🚫",0,1);`)

  //Policies
  db.run(`CREATE TABLE Policy (policy_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_name VARCHAR(64), policy_category VARCHAR(64), policy_description VARCHAR (128), policy_act_cost float, dynamic_attribute_id INTEGER, cost_multiplier FLOAT);`)
  db.run(`INSERT INTO Policy (policy_name, policy_description, policy_category,policy_act_cost,dynamic_attribute_id, cost_multiplier) VALUES
    ("This should only be seen for debugging","If you are seeing this then I apologies, something VERY BAD has happened- this is a debug policy which SHOULD NOT BE HAPPENING","Debug",0,null,0),
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

  db.run(`CREATE TABLE Policy_Collection (policy_collection_id INTEGER PRIMARY KEY AUTOINCREMENT, city_id INTEGER, policy_id INTEGER, policy_active BOOL, FOREIGN KEY (city_id) REFERENCES City(city_id), FOREIGN KEY (policy_id) REFERENCES Policy(policy_id))`)

  db.run(`CREATE TABLE Building (building_id INTEGER PRIMARY KEY AUTOINCREMENT, city_id INTEGER, name VARCHAR(128) ,FOREIGN KEY (city_id) REFERENCES City(city_id))`)
  db.run(`CREATE TABLE Residential (residential_id INTEGER PRIMARY KEY AUTOINCREMENT, building_id INTEGER, house_model_id INTEGER)`)
  db.run(`CREATE TABLE Residential_Model (residential_model INTEGER PRIMARY KEY AUTOINCREMENT, max_residents INTEGER, rent FLOAT, class VARCHAR(16))`)
  db.run(`INSERT INTO Residential_Model (max_residents, rent, class) VALUES
    (5,10,'budget'),
    (6,10,'budget')`)
  db.run(`CREATE TABLE Citizens (citizen_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name VARCHAR(32), last_name VARCHAR(32),turn_of_birth INTEGER, money FLOAT, residential_id INTEGER, education_weeks INTEGER, dead BOOLEAN)`)
  if (!debugMode){
    StartUp()
  };
}

//EXPORT function
function ExportDB() {
    //Name of file that is gonna get exported
    const filename = "CIVIS.sqlite"
    //Export function
    const binaryArray = db.export();
    //Blob download in Uint8Array
    const blob = new Blob([binaryArray], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    //Sneaky download
    const downloadlink = document.createElement("a");
    downloadlink.href = url;
    downloadlink.download = filename;
    document.body.appendChild(downloadlink);
    //This seems sketchy tbh - but it isn't 🤷
    downloadlink.click();
    document.body.removeChild(downloadlink); //And like that it is gone
    URL.revokeObjectURL(url);
}

//CONSOLE PRINT function
function PrintTable(tableName) {
  console.log("The following is the current data in the table " + tableName)
    if (!db) {
    console.error("db is undefined, stop trying to run queries!");
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

function LoadDB(){
  initSqlJs({
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
  }).then(SQL => {
  const file = document.getElementById("FormLoadDB").files[0];
  if (!file) {
    console.error("No file selected");
    document.getElementById("FormWarning").textContent = "Invalid File"
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const Uints = new Uint8Array(event.target.result);
    db = new SQL.Database(Uints);
    PrintTable("City");
    document.getElementById("ForFormLoadDB").textContent = "Successfully imported!"
    document.getElementById("FormContent").innerHTML += `
    <br>
    <button onclick="StartUp()" style="margin-left:130px">Begin</button>`
  }
  reader.readAsArrayBuffer(file)})
}

function GetDBElements(table,attribute,whereAttribute,whereAttributeValue) {
  let result = []
  let stmt = null
  //This is mainly implemented for the city table since there will never need to be a where clause
  if (whereAttribute === null || whereAttributeValue === null){
    console.log("Getting data in the table " + table + " under the attribute: " + attribute)
    stmt = db.prepare("SELECT "+ attribute +" FROM " + table)
    while (stmt.step()){
      let row = stmt.getAsObject()
      result.push(row[attribute])
    }
    if (result.length == 0){
      console.error("There was no data in " + table + " that refers to " + attribute)
    }
  }
  //
  else{
    console.log("Getting data in the " + table + " under the attribute: " + attribute + "; the data is also expecetd to have an attribute " + whereAttribute + " of " + whereAttributeValue)
    stmt = db.prepare("SELECT "+ attribute +" FROM " + table + " WHERE " + whereAttribute + " IS " + whereAttributeValue)
    while (stmt.step()){
      let row = stmt.getAsObject()
      result.push(row[attribute])
    }
    if (result.length == 0){
      console.error("There was no data in " + table + " that refers to " + attribute + " with a " + whereAttribute + " of " + whereAttributeValue)
    }
  }
  stmt.free()
  return result;
};

function GetDBElementsDoubleCondition(table,attribute,whereAttribute1,whereAttributeValue1,whereAttribute2,whereAttributeValue2){
  let result = []
  let stmt = null
  console.log("Getting data in the " + table + " under the attribute: " + attribute + "; the data is also expecetd to have an attribute " + whereAttribute1 + " of " + whereAttributeValue1 + " and " + whereAttribute2 + " of " + whereAttributeValue2)
  stmt = db.prepare("SELECT "+ attribute +" FROM " + table + " WHERE " + whereAttribute1 + " IS " + whereAttributeValue1 + " AND " + whereAttribute2 + " IS " + whereAttributeValue2)
  while (stmt.step()){
    let row = stmt.getAsObject()
    result.push(row[attribute])
  }
  if (result.length == 0){
    console.error("There was no data in " + table + " that refers to " + attribute + " with a " + whereAttribute1 + " of " + whereAttributeValue1 + " and " + whereAttribute2 + " of " + whereAttributeValue2)
  }
  stmt.free()
  return result;
}

function UpdateDB(table,attribute,attributeReplacement,whereAttribute,whereAttributeValue) {
  console.log("Updating " + table + " where " + whereAttribute + " is " + whereAttributeValue + " so " + attribute + " is now " + attributeReplacement)
  db.run("UPDATE " + table + " SET " + attribute + " = '" + attributeReplacement + "' " + " WHERE " + whereAttribute + " IS " + whereAttributeValue)
  //Update the Tutorial Window if it exists
  if (table == "Tutorial" && document.getElementById("TutorialWindowContent")){
    UpdateTutorial()
  }
  else if (table=="City"){
    document.getElementById("TaskbarCurrentFunds").innerText = "Current funds: " + GetDBElements("City","money_symbol",null,null)[0] + FormattedNumber(GetDBElements("City_Attribute","attribute_value","city_attribute_id",3),"currency")
  }
  return
}

function InsertDB(Table, attribute_reference, attribute_value){
  console.log("Adding " + attribute_value + " into " + Table)
  db.run(`INSERT INTO ` + Table + attribute_reference + ` VALUES` + attribute_value)
}

function GetGameDate(ahead){
  if (ahead == null){
    ahead = 0
  }
  const gameStartDay = GetDBElements("City","start_date",null,null)[0];
  const gameTurn = GetDBElements("City_Attribute","attribute_value","city_attribute_id",1)[0];
  const gameDay = new Date(((gameTurn + ahead) * 604800000) + gameStartDay); //604800000 is the amount of milliseconds in a week (1000*60*60*24*7)
  return gameDay.getDate() + "/" + gameDay.getMonth() + "/" + gameDay.getFullYear()
}

function PoliciesInPolicyPack(id) {
  let result = [];

  const stmt = db.prepare(`SELECT DISTINCT Policy_Pack_Policy.policy_id FROM Policy_Pack_Policy INNER JOIN Policy ON Policy_Pack_Policy.policy_id = Policy.policy_id WHERE policy_pack_id = ` + id + ` ORDER BY policy_category DESC, policy_name DESC`);

  while (stmt.step()) {
    const row = stmt.getAsObject();
    result.push(row.policy_id);
  }

  stmt.free();
  console.log(result)
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
  if (category != null){
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

function FormattedNumber(number, format){
  switch (format.toLowerCase){
    case "percentage":
      return new Intl.NumberFormat(undefined, {minimumIntegerDigits : 2, maximumFractionDigits: 2}).format(number);
    case "currency":
      return new Intl.NumberFormat(undefined, {style : "currency"}).format(number);
    default:
      return new Intl.NumberFormat(undefined).format(number);
  }
}
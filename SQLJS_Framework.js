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
  db.run("CREATE TABLE City (city_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(24) NOT NULL, start_date T, money_symbol CHAR);")
  //Prepare the SQL
  const CITYSQL = db.prepare("INSERT INTO City (name, start_date,money_symbol) VALUES (?,?,'$');")
  //SQL Injection prevention
  CITYSQL.run([CityName, Date.now()])

  //City_attribute table
  db.run("CREATE TABLE City_Attribute (city_attribute_id INTEGER PRIMARY KEY AUTOINCREMENT, attribute_name VARCHAR(64), attribute_description VARCHAR(128), attribute_value FLOAT);")
  db.run(`INSERT INTO City_Attribute (attribute_name, attribute_description, attribute_value) VALUES 
    ("Current turn number","What is the current turn number for the game? Used for date calculations and recording events",0),
    ("Population","How many people live in your town",0),
    ("Current funds","How much money does the city own",5000),
    ("Incre funds","How much political strength does the city have?",50),
    ("Currently Purchasing","Used to prevent errors - 1 is true and 0 is false",0);`)


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
    (0,"Thanks for testing","please tell Louis if you have any queries or preferences","Debug");`)


  //Policy Pack table
  db.run(`CREATE TABLE Policy_Pack (policy_pack_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_pack_name VARCHAR(64), policy_pack_description VARCHAR(64),policy_pack_cost float,policy_pack_unlocked BOOL);`)
  db.run(`INSERT INTO Policy_Pack (policy_pack_name,policy_pack_description,policy_pack_cost,policy_pack_unlocked) VALUES
    ("Founding Pack","Vital to start your city",50,1),
    ("ERROR PACK","This an error 🚫",0,1);`)

  //Policies
  db.run(`CREATE TABLE Policy (policy_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_name VARCHAR(64), policy_category VARCHAR(64), policy_description VARCHAR (128), policy_act_cost float);`)
  db.run(`INSERT INTO Policy (policy_name, policy_description, policy_category,policy_act_cost) VALUES
    ("This should only be seen for debugging","If you are seeing this then I apologies, something VERY BAD has happened- this is a debug policy which SHOULD NOT BE HAPPENING","Debug",0),
    ("Roadhouse","lower residential capacity is increased by +3","Building",50),
    ("Mini-conviniece store","lower commercial capacity is increased by +1","Building",50),
    ("Small forest site","forest industry capacity is increased by +1","Building",50),
    ("Wheat garden","agriculture commercial capacity is increased by +1","Building",50),
    ("Dirt Road initiative","vehicle capacity on roads is increased by +100<br>Upkeep is based on number of vehicles used","Infrastructure",1000)`)

  //Policy_Pack_Policy for Many to Many relationships
  db.run(`CREATE TABLE Policy_Pack_Policy (policy_pack_policy_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_pack_id INTEGER, policy_id INTEGER, slot INTEGER,FOREIGN KEY (policy_pack_id) REFERENCES Policy_Pack(policy_pack_id), FOREIGN KEY (policy_id) REFERENCES Policy(policy_id))`)
  db.run(`INSERT INTO Policy_Pack_Policy (policy_pack_id,policy_id,slot) VALUES
    (2,1,1),
    (1,2,1),
    (1,3,2),
    (1,4,3),
    (1,5,3),
    (1,6,4)`)
  
  db.run(`CREATE TABLE Policy_Collection (policy_collection_id INTEGER PRIMARY KEY AUTOINCREMENT, city_id INTEGER, policy_id INTEGER, policy_active BOOL, FOREIGN KEY (city_id) REFERENCES City(city_id), FOREIGN KEY (policy_id) REFERENCES Policy(policy_id))`)
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
  db.run("UPDATE " + table + " SET " + attribute + " = " + attributeReplacement + " WHERE " + whereAttribute + " IS " + whereAttributeValue)
  //Update the Tutorial Window if it exists
  if (table == "Tutorial" && document.getElementById("TutorialWindowContent")){
    UpdateTutorial()
  }
}

function InsertDB(Table, attribute_reference, attribute_value){
  console.log("Adding " + attribute_value + " into " + Table)
  db.run(`INSERT INTO ` + Table + attribute_reference + ` VALUES` + attribute_value)
}

function GetGameDate(){
  const gameStartDay = GetDBElements("City","start_date",null,null)[0];
  const gameTurn = GetDBElements("City_Attribute","attribute_value","city_attribute_id",1)[0];
  const gameDay = new Date((gameTurn * 604800000) + gameStartDay); //604800000 is the amount of milliseconds in a week (1000*60*60*24*7)
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
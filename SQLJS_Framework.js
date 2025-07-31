const debugMode = true

async function main(){
  if (debugMode){
    document.getElementById("StartBlocker").style.visibility = "hidden"
    await NewDB("Coolville")
    await PrepareDesktop()
  }
}
/*This has to be done to ensure that the other js files are loaded*/
window.addEventListener('load', function() {
  main()
})

//This needs to be global, as every script may need to use the database
var db;


// TAKEN FROM SQL.JS DOCS

// For script tag / CDN
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
  db.run("CREATE TABLE City (CityID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR(24) NOT NULL, StartDate T, CurrentTurnNumber INT);");
  //Prepare the SQL
  const CITYSQL = db.prepare("INSERT INTO City (Name, StartDate, CurrentTurnNumber) VALUES (?,?,0);");
  //SQL Injection prevention
  CITYSQL.run([CityName, Date.now()]);

  PrintTable("City");
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

function GetCityElement(attribute) {
  console.log("Getting data in the city under the attribute: " + attribute)
  const stmt = db.prepare("SELECT "+ attribute +" FROM City")
  let result = null
  if (stmt.step()){
    result = stmt.getAsObject()[attribute]
  }
  return result
};

function GetGameDate(){
  const gameDay = new Date(GetCityElement("CurrentTurnNumber") * (604800000) + GetCityElement("StartDate")); //604800000 is the amount of milliseconds in a week (1000*60*60*24*7)
  return gameDay.getDate() + "/" + gameDay.getMonth() + "/" + gameDay.getFullYear()
}
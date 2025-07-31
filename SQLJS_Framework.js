//This needs to be global, as every script may need to use the database
var db;


// TAKEN FROM SQL.JS DOCS

// For script tag / CDN
async function NewDB(CityName) {
  if (db){
    console.error("Database is already exists");
    return;
  }
  initSqlJs({
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
  }).then(SQL => {
  db = new SQL.Database(); // Creates new empty DB

  // Run a query

  //City Database
  db.run("CREATE TABLE City (CityID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL, StartDate T, CurrentTurnNumber INT);");
  //Prepare the SQL
  const CITYSQL = db.prepare("INSERT INTO City (Name, StartDate, CurrentTurnNumber) VALUES (?,?,0);");
  //SQL Injection prevention
  CITYSQL.run([CityName,new Date().toISOString()]);

  PrintTable("City");
  StartUp();
  });
  return;
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
    if (!db) {
    console.error("db is undefined, stop trying to run queries!");
    return;
    }
    //Get it all
  const PRINTTABLESQL = db.prepare(`SELECT * FROM ${tableName}`);
  //Each row
  while (PRINTTABLESQL.step()) {
    //log it 🪵
    console.log(PRINTTABLESQL.getAsObject());
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

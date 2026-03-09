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
  db.run('CREATE TABLE City (city_id INTEGER PRIMARY KEY , name VARCHAR(24) NOT NULL, start_date T, money_symbol VARCHAR(1), status VARCHAR(48));')
  //Prepare the SQL
  const CITYSQL = db.prepare("INSERT INTO City (name, start_date,money_symbol,status) VALUES (?,?,'$','Developing');")
  //SQL Injection prevention
  CITYSQL.run([CityName, Date.now()])

  //City_attribute table
  db.run(`CREATE TABLE City_Attribute (city_attribute_id INTEGER PRIMARY KEY, attribute_name VARCHAR(64), attribute_key_word VARCHAR(16), attribute_description VARCHAR(128), attribute_value FLOAT, clear_on_simulation BOOLEAN);`)
  db.run(`INSERT INTO City_Attribute (city_attribute_id, attribute_name, attribute_key_word, attribute_description, attribute_value, clear_on_simulation) VALUES 
    (1,"Current turn number","turn","What is the current turn number for the game? Used for date calculations and recording events",0,0),
    (2,"Population","population","How many people live in your town",0,0),
    (3,"Current funds","money","How much money does the city own",50000,0),
    (4,"Incre funds","incre","How much political strength does the city have?",50,0),
    (5,"Currently Purchasing","purchasing","Used to prevent warns - 1 is true and 0 is false",0,0),
    
    (6,"Budget Class House Capacity","budgetc","The limit of the number of Budget Class Houses",0,1),
    (106,"Budget Class House Demand","budgetd","Percentage based demand for Budget Class Houses",100,1),
    (7,"Lower Class House Capacity","lowerc","The limit of the number of Lower Class Houses",0,1),
    (107,"Lower Class House Demand","lowerd","Percentage based demand for Lower Class Houses",100,1),
    (8,"Middle Class House Capacity","middlec","The limit of the number of Middle Class Houses",0,1),
    (108,"Middle Class House Demand","middled","Percentage based demand for Middle Class Houses",100,1),
    (9,"Upper Class House Capacity","upperc","The limit of the number of Upper Class Houses",0,1),
    (109,"Upper Class House Demand","upperd","Percentage based demand for Upper Class Houses",100,1),

    (10,"Low-rent Apartments Capacity","lowrentc","The limit of the number of Low-rent Apartments",0,1),
    (110,"Low-rent Apartments Demand","lowrentd","Percentage based demand for Low-rent Apartments",100,1),
    (11,"Affordable Flats Capacity","affordablec","The limit of the number of Affordable Flats",0,1),
    (111,"Affordable Flats Demand","affordabled","Percentage based demand for Affordable Flats",100,1),
    (12,"Regular Highrise Capacity","regularc","The limit of the number of Regular Highrise",0,1),
    (112,"Regular Highrise Demand","regulard","Percentage based demand for Regular Highrise",100,1),
    (13,"Luxury Skyscraper Capacity","luxuryc","The limit of the number of Luxury Skyscraper",0,1),
    (113,"Luxury Skyscraper Demand","luxuryd","Percentage based demand for Luxury Skyscraper",100,1),

    (14,"Global Happiness","globhap","The statistical points for happiness in your place",100,0),

    (16,"Forest Industry Capacity","forestc","The limit of forest-industries",0,1),
    (116,"Forest Industry Demand","forestd","The demand of forest-industries",0,1),
    (17,"Agriculture Industry Capacity","agric","The limit of agriculture-industries",0,1),
    (117,"Agriculture Industry Demand","agrid","The demand of agriculture-industries",0,1),
    (18,"Ore Industry Capacity","orec","The limit of ore-industries",0,1),
    (118,"Ore Industry Demand","ored","The demand of ore-industries",0,1),
    (19,"Crude Oil Industry Capacity","coilc","The limit of crude-oil-industries",0,1),
    (119,"Crude Oil Industry Demand","coild","The demand of crude-oil-industries",0,1),
    (20,"Raw Fish Industry Capacity","rfishc","The limit of raw-fish-industries",0,1),
    (120,"Raw Fish Industry Demand","rfishd","The demand of raw-fish-industries",0,1),
    (21,"Furniture Industry Capacity","furnc","The limit of furniture-industries",0,1),
    (121,"Furniture Industry Demand","furnd","The demand of furniture-industries",0,1),
    (22,"Paper Industry Capacity","paperc","The limit of paper-industries",0,1),
    (122,"Paper Industry Demand","paperd","The demand of paper-industries",0,1),
    (23,"Metal Industry Capacity","metalc","The limit of metal-industries",0,1),
    (123,"Metal Industry Demand","metald","The demand of metal-industries",0,1),
    (24,"Oil Industry Capacity","oilc","The limit of oil-industries",0,1),
    (124,"Oil Industry Demand","oild","The demand of oil-industries",0,1),
    (25,"Processed Fish Industry Capacity","pfishc","The limit of processed-fish-industries",0,1),
    (125,"Processed Fish Industry Demand","pfishd","The demand of processed-fish-industries",0,1),
    (26,"Baked Goods Industry Capacity","bakedc","The limit of baked-goods-industries",0,1),
    (126,"Baked Goods Industry Demand","bakedd","The demand of baked-goods-industries",0,1),
    (27,"Meat Industry Capacity","meatc","The limit of meat-industries",0,1),
    (127,"Meat Industry Demand","meatd","The demand of meat-industries",0,1),
    (28,"Meal Industry Capacity","mealc","The limit of meal-industries",0,1),
    (128,"Meal Industry Demand","meald","The demand of meal-industries",0,1),
    (29,"Electronic Industry Capacity","electc","The limit of electronic-industries",0,1),
    (129,"Electronic Industry Demand","electd","The demand of electronic-industries",0,1),
    (30,"Plastic Industry Capacity","plastc","The limit of plastic-industries",0,1),
    (130,"Plastic Industry Demand","plastd","The demand of plastic-industries",0,1),
    (31,"Chemical Industry Capacity","chemc","The limit of chemical-industries",0,1),
    (131,"Chemical Industry Demand","chemd","The demand of chemical-industries",0,1),
    (32,"Vehicle Industry Capacity","vehiclec","The limit of Vehicle-industries",0,1),
    (132,"Vehicle Industry Demand","vehicled","The demand of Vehicle-industries",0,1),
    (33,"Spaceship Industry Capacity","spacec","The limit of Spaceship-industries",0,1),
    (133,"Spaceship Industry Demand","spaced","The demand of Spaceship-industries",0,1),
    (34,"Software Industry Capacity","softc","The limit of Software-industries",0,1),
    (134,"Software Industry Demand","softd","The demand of Software-industries",0,1),
    (35,"Media Industry Capacity","media","The limit of Media-industries",0,1),
    (135,"Media Industry Demand","mediad","The demand of Media-industries",0,1),

    (200,"Vehicle Capacity","vehiclec","The limit of vehicles on roads",0,1),
    (201,"Vehicle Demand","vehicleu","The number of vehicles on roads",0,1),
    (202,"Electricty Capacity","elecc","The MW of power produced in the city",0,1),
    (203,"Electricty Demand","elecd","The MW of power used in the city",0,1),
    (204,"Drinking Water Capacity","dwaterc","The litres of water produced in the city",0,1),
    (205,"Drinking Water Demand","dwaterd","The litres of water used in the city",0,1),
    (206,"Sewage Capacity","sewagec","The litres of sewage the city can support",0,1),
    (207,"Sewage Demand","sewaged","The litres of sewage produced in the city",0,1),
    (208,"Primary Education Capacity","peduc","The litres of sewage the city can support",0,1),
    (209,"Primary Education Demand","pedud","The litres of sewage produced in the city",0,1),
    (210,"Secondary Education Capacity","seduc","The litres of sewage the city can support",0,1),
    (211,"Secondary Education Demand","sedud","The litres of sewage produced in the city",0,1),
    (212,"College Education Capacity","ceduc","The litres of sewage the city can support",0,1),
    (213,"College Education Demand","cedud","The litres of sewage produced in the city",0,1),
    (214,"Uni Education Capacity","ueduc","The litres of sewage the city can support",0,1),
    (215,"Uni Education Demand","uedud","The litres of sewage produced in the city",0,1),
    (216,"Healthcare Capacity","healthc","The litres of sewage the city can support",0,1),
    (217,"Healthcare Demand","healthd","The litres of sewage produced in the city",0,1),
    (218,"Deathcare Capacity","deathc","The litres of sewage the city can support",0,1),
    (219,"Deathcare Demand","deathd","The litres of sewage produced in the city",0,1),
    (220,"Garbage Capacity","garbc","The litres of sewage the city can support",0,1),
    (221,"Garbage Demand","garbd","The litres of sewage produced in the city",0,1),
    (222,"Police Capacity","policec","The litres of sewage the city can support",0,1),
    (223,"Police Demand","policed","The litres of sewage produced in the city",0,1),
    (224,"Fire safety Capacity","firec","The litres of sewage the city can support",0,1),
    (225,"Fire safety Demand","fired","The litres of sewage produced in the city",0,1),
    (226,"Government Capacity","govermentd","The production of goverment services",0,1),
    (227,"Government Demand","govermentd","The demand of goverment services",0,1),
    
    (300,"Essential Early Commercial Capacity","comesec","The limit of essential early commercial",0,1),
    (301,"Essential Early Commercial Demand","comesed","The demand of essential early commercial",0,1),
    (302,"Normal Early Commercial Capacity","comnoec","The limit of normal early commercial",0,1),
    (303,"Normal Early Commercial Demand","comnoed","The demand of normal early commercial",0,1),
    (304,"Luxury Early Commercial Capacity","comluec","The limit of luxury early commercial",0,1),
    (305,"Luxury Early Commercial Demand","comlued","The demand of luxury early commercial",0,1),
    (306,"Essential Mid Commercial Capacity","comesmc","The limit of essential mid commercial",0,1),
    (307,"Essential Mid Commercial Demand","comesmd","The demand of essential mid commercial",0,1),
    (308,"Normal Mid Commercial Capacity","comnomc","The limit of normal mid commercial",0,1),
    (309,"Normal Mid Commercial Demand","comnomd","The demand of normal mid commercial",0,1),
    (310,"Luxury Mid Commercial Capacity","comlumc","The limit of luxury mid commercial",0,1),
    (311,"Luxury Mid Commercial Demand","comlumd","The demand of luxury mid commercial",0,1),
    (312,"Essential Late Commercial Capacity","comeslc","The limit of essential late commercial",0,1),
    (313,"Essential Late Commercial Demand","comesld","The demand of essential late commercial",0,1),
    (314,"Normal Late Commercial Capacity","comnolc","The limit of normal late commercial",0,1),
    (315,"Normal Late Commercial Demand","comnold","The demand of normal late commercial",0,1),
    (316,"Luxury Late Commercial Capacity","comlulc","The limit of luxury late commercial",0,1),
    (317,"Luxury Late Commercial Demand","comluld","The demand of luxury late commercial",0,1),
    
    (900,"Residential Tax","restax","The tax for residential buildings",0.08,0),
    (906,"Commercial Tax","comtax","The tax for commercial buildings",0.08,0),
    (909,"Industrial Tax","indutax","The tax for industrial buildings",0.08,0)`)

  //Tutorial Table
  db.run(`CREATE TABLE Tutorial (tutorial_id INTEGER PRIMARY KEY , completed BOOL NOT NULL, tutorial_title VARCHAR(32), tutorial_description TEXT, tutorial_category TEXT);`)
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
    (0,"Running the simulation","You have your policies set, so let's go and make it all happen. Click the 'Simulate' icon","Policies"),
    (0,"Exporting saves","Things are going very well! You have people, jobs, houses, shops, industrial and more all being calculated currently. It would be a shame to lose this progress so let's try learn to export your progress to use later.<br>To do this <u>go to the 'Settings' icon.</u>","Saving")`)
      //This has to be done since the button contains JS
  db.run(`INSERT INTO Tutorial (completed, tutorial_title, tutorial_description, tutorial_category) VALUES (?,?,?,?)`,[
    0,
    "Exporting saves continued...",
    `The bottom most button that says 'export', that is what you press when you want to <u><b>export</b></u> your save, go on press it- it won't hurt.</p><br><button onclick="UpdateDB('Tutorial','completed',1,'tutorial_id',14)">Continue</button>`,
    "Saving"])
  db.run(`INSERT INTO Tutorial (completed, tutorial_title, tutorial_description, tutorial_category) VALUES (?,?,?,?)`,[
    0,
    "Public Sector",
    `The public sector window let's you see if there are any deficit in what you are providing <br>(in the early game you are not expected to provide ALL of these services, so watch out when you little place evolves into a new title!)</p><br><button onclick="UpdateDB('Tutorial','completed',1,'tutorial_id',15)">Continue</button>`,
    "Saving"])
  db.run(`INSERT INTO Tutorial (completed,tutorial_title,tutorial_description,tutorial_category) VALUES
    (0,"End tutorial","You have finished the tutorial 🎊, please continue enjoying the project and see how large you can make your town","N/A")`)


  //Policy Pack table
  db.run(`CREATE TABLE Policy_Pack (policy_pack_id INTEGER PRIMARY KEY , policy_pack_name VARCHAR(64), policy_pack_description VARCHAR(64),policy_pack_cost FLOAT NOT NULL,policy_pack_unlocked BOOL NOT NULL);`)
  db.run(`INSERT INTO Policy_Pack (policy_pack_id, policy_pack_name,policy_pack_description,policy_pack_cost,policy_pack_unlocked) VALUES
    (1,"Founding Pack","Vital to start your city",50,1),
    (2,"Error PACK","This an error 🚫",0,0),
    (3,"Baby's first: Clean Energy","The eco-friendly lifestyle",30,0),
    (4,"Baby's first: Dirty Energy","Power to the people! And to the coal!",30,0),
    (5,"Basic waterworks","Slurp and burp",20,0),
    (6,"Early housing","A booster for the population",8,0),
    (7,"Early shops","A booster for shopping",15,0),
    (8,"Early Industry","A mix bag of primary early industries",15,0),
    (9,"In the details","Get the knowledge that you yearn",45,0),
    (10,"Humble bureaucracy","The stats, the facts, it's all to the max!",60,0),
    (11,"Early Industry (Now with Fish!)","A mix bag of primary early industries with fish!",15,0),
    (12,"Emerging Industry","More complex industries",20,0),
    (13,"Wood working Industry","Wood based industries",25,0),
    (14,"Better Primary Industry","A range of more efficient and larger primary industries",35,0),
    (15,"Ground Operations","Ore and Crude Oil industries!",30,0),
    (16,"Primary Industry Power","All the primary industry policys in one pack! Now get 3 cards in one!",45,0),
    (17,"Cooking Industry","A big boost towards the eating needs",50,0),
    (18,"Elevated Ground Operations","Metal and Oil industries",30,0),
    (19,"The Digital Age","Software and Media",55,0),
    (20,"Techno Materials","Electronic and Plastic industries",50,0),
    (21,"Chemicals on Wheels","Chemical and Vehicle industries",55,0),
    (22,"Normal goods industries pack","All normal industries (get 1 of each)",80,0),
    (23,"Luxury Pack (Limited)","Get policy 1 out of all the possible luxury industries",55,0),
    (24,"Luxury Pack (Boosted)","Get one of each luxury industries' policy",100,0),
    (25,"Road Tier I","Introduces Gravel Road",35,0),
    (26,"Road Tier II","Introduces Stone Road",45,0),
    (27,"Road Tier III","Introduces Concrete Road",55,0),
    (28,"Road Extras","Different elements to improve your road",50,0),
    (29,"Super Solar","Power to the sunshine!",45,0),
    (30,"Oil up","Unlock the power of oil",55,0),
    (31,"Nice and toasty","Heat? As energy? How unique!",70,0),
    (32,"Dump it","Itty Bitty place to legally litter",35,0),
    (33,"Dump it but BIG!","More space to legally litter",45,0),
    (34,"Dump it WITH FIRE","Okay, things are heating up...",60,0),
    (35,"Medicine Introduction","Heal 'em",40,0),
    (36,"Medicine Indoctrination","Cure 'em",50,0),
    (37,"Medicine Eruption","Help 'em",85,0),
    (38,"Bury the dead","A nice resting place",25,0),
    (39,"More room for the dead","Get more space for the bodies",55,0),
    (40,"Burn it with fire","Crematoriums are unlocked",80,0),
    (41,"Stop Crime","Serve Justice quickly",40,0),
    (42,"Fight Crime","Well its only more space for bodies, doesn't 'fight' anything IMHO",65,0),
    (43,"FIRE! FIRE! FIRE!","Ooohhh it is getting hot in here",35,0),
    (44,"Protection Upgrade","Fire away, fire away!",50,0),

    (45,"Council home budget","Fund cheap homes",20,0),
    (46,"Middle class entry","Neat and nice homes",20,0),
    (47,"Land of the wealthy","Let's get some mansions",20,0),
    (48,"Dense homes","Pack them all in",50,0),
    (49,"Growing estate","Fund cheap homes",50,0),
    (50,"Suburb boom","More land for living",50,0),
    (51,"How the rich live","Bigger the land, the bigger the house",50,0),
    (52,"Early towers","Let 'em live up high",20,0),
    (53,"Tall towers","This is starting to look nice",20,0),
    (54,"Grand towers","What a mighty sight",20,0),
    (55,"Breathtaking towers","This should be a pretty sight by itself",20,0),
    (56,"Brutalist pillars","Soviet style",50,0),
    (57,"Pillars of the community","More people the merrier",50,0),
    (58,"Glass beacons","What a stunning view!",50,0),
    (59,"Monumental skyscrapers","Architecture defining",50,0),

    (60,"Local stores","Essential Early capacity is increased by +5",50,0),
    (61,"Village market","Normal Early capacity is increased by +5",50,0),
    (62,"Premium Carpentry","Luxury Early capacity is increased by +3",50,0),
    (63,"Produce Market","Essential Mid capacity is increased by +50",50,0),
    (64,"Highstreet shops","Normal Mid capacity is increased by +50",50,0),
    (65,"Local designer shops","Luxury Mid capacity is increased by +30",50,0),
    (66,"High capacity produce","Essential Late capacity is increased by +50",50,0),
    (67,"Multi-store shops","Normal Late capacity is increased by +50",50,0),
    (68,"International luxury store","Luxury Late capacity is increased by +30",50,0),

    (69,"Primary Education","Give the power of knowledge",50,0),
    (70,"Secondary Education","Oh education is starting for real now",50,0),
    (71,"College level","[Insert some wise quote by Plato]",50,0),
    (72,"Uni dreams","They must thrive! They must know! To know is to thrive!",50,0)
    `)
    //("Error PACK","This an error 🚫",0,1);

  //Policies
  db.run(`CREATE TABLE Policy (policy_id INTEGER PRIMARY KEY, policy_name VARCHAR(64), policy_category VARCHAR(64), policy_description VARCHAR (128), policy_act_cost FLOAT NOT NULL);`)
  db.run(`INSERT INTO Policy (policy_id, policy_name, policy_description, policy_category,policy_act_cost) VALUES
    (1,"This should only be seen for debugging","If you are seeing this then I apologise, something VERY BAD has happened- this is a debug policy which SHOULD NOT BE HAPPENING","Debug",0),
    (2,"Roadhouse","Budget residential capacity is increased by +3","ResidentialZoning",50),
    (3,"Mini-conviniece store","Lower commercial capacity is increased by +1","CommercialZoning",50),
    (4,"Small forest site","Forest industry capacity is increased by +1","IndustrialZoning",50),
    (5,"Wheat garden","Agriculture industry capacity is increased by +1","IndustrialZoning",50),
    (6,"Dirt Road initiative","Vehicle capacity on roads is increased by +100<br>Upkeep of  $/£/€ 250","Roads",750),
    (7,"Cheap wind turbine","Provides 7 MW<br>Upkeep of $/£/€ 100","Electricity",6000),
    (8,"Coal plant","Provides 42MW<br>Upkeep of $/£/€ 600","Electricity",18000),
    (9,"Small pumping station","Provides 125,000L<br>Upkeep of $/£/€ 250","DrinkingWater",3000),
    (10,"Small sewage pipe","Supports 120,000L of waste<br>Upkeep of $/£/€ 250","Sewage",2500),
    (11,"Census station","Allows for citizen census to be deployed<br>Upkeep of $/£/€ 4000","Government",40000),
    (12,"Taxes Department","Allows for the private sector to be analysed<br>Upkeep of $/£/€ 5000","Government",55000),
    (13,"Tree plantation area","Forest industry capacity is increased by +3","IndustrialZoning",50),
    (14,"Community farm","Agriculture industry capacity is increased by +3","IndustrialZoning",50),
    (15,"Small Ore operation","Ore industry capacity is increased by +3","IndustrialZoning",50),
    (16,"Oil Reserves","Crude Oil industry capacity is increased by +3","IndustrialZoning",50),
    (17,"Fishing dock","Raw fish industry capacity is increased by +3","IndustrialZoning",50),
    (18,"Local carpentry","Furniture industry capacity is increased by +3","IndustrialZoning",50),
    (19,"Paper workshop","Paper industry capacity is increased by +3","IndustrialZoning",50),
    (20,"Iron workshop","Metal industry capacity is increased by +8","IndustrialZoning",50),
    (21,"Distillation tower","Oil industry capacity is increased by +8","IndustrialZoning",50),
    (22,"Canning Facility","Processed fish industry capacity is increased by +3","IndustrialZoning",50),
    (23,"Little Bakery","Baked goods industry capacity is increased by +3","IndustrialZoning",50),
    (24,"Butchers' corner","Meat industry capacity is increased by +3","IndustrialZoning",50),
    (25,"Kitchen House","Meal industry capacity is increased by +3","IndustrialZoning",50),
    (26,"Electronic warehouse","Electronic industry capacity is increased by +3","IndustrialZoning",50),
    (27,"Molding station","Plastic industry capacity is increased by +3","IndustrialZoning",50),
    (28,"Chemists","Chemical industry capacity is increased by +3","IndustrialZoning",50),
    (29,"Automotive manufacturer","Vehicle industry capacity is increased by +3","IndustrialZoning",50),
    (30,"Tech Office","Software industry capacity is increased by +3","IndustrialZoning",50),
    (31,"Design Studios","Media industry capacity is increased by +3","IndustrialZoning",50),
    (32,"Fillet Warehouse","Processed fish industry capacity is increased by +10","IndustrialZoning",50),
    (33,"Dough shop","Baked goods industry capacity is increased by +10","IndustrialZoning",50),
    (34,"Slaughterhouse","Meat industry capacity is increased by +10","IndustrialZoning",50),
    (35,"Cooking conveyor belt","Meal industry capacity is increased by +10","IndustrialZoning",50),
    (36,"Pharmaceutical manufacturer","Chemical industry capacity is increased + 10","IndustrialZoning",50),
    (37,"Gravel Road","Vehicle capacity on roads is increased by +500<br>Upkeep of $/£/€ 750","Roads",1300),
    (38,"Stone Road","Vehicle capacity on roads is increased by +5000<br>Upkeep of $/£/€ 5500","Roads",1300),
    (39,"Concrete Road","Vehicle capacity on roads is increased by +15000<br>Upkeep of $/£/€ 10000","Roads",1300),
    (40,"Traffic Lights","Vehicle capacity on roads is increased by 3%","Roads",2000),
    (41,"Lanes and shoulders","Vehicle capacity on roads is increased by 5%","Roads",2500),
    (42,"Solar farm","Large solar panel farm provides 160MW<br>Upkeep of $/£/€ 1850","Electricity",60000),
    (43,"Oil Plant","Provides 200MW<br>Upkeep of $/£/€ 1400","Electricity",70000),
    (44,"Thermal Powerplant","Thermal Powerplant provides 500MW<br>Upkeep of $/£/€ 5000","Electricity",100000),
    (45,"Local Landfill","Landfill where waste is dumped; supports 3 tonnes a week<br>Upkeep of $/£/€ 200","Garbage",20000),
    (46,"Large Landfill","Landfill where waste is dumped; supports 50 tonnes a week<br>Upkeep of $/£/€ 2000","Garbage",50000),
    (47,"Incineration Plant","Where waste is burned; supports 100 tonnes a week<br>Upkeep of $/£/€ 10000","Garbage",120000),
    (48,"Small Clinic","Citizens can go and heal; supports 50 patients a week<br>Upkeep of $/£/€ 250","Healthcare",20000),
    (49,"Health Centre","Citizens can go and heal; supports 300 patients a week<br>Upkeep of $/£/€ 1330","Healthcare",50000),
    (50,"Hospital","Citizens can go and heal; supports 3000 patients a week<br>Upkeep of $/£/€ 12000","Healthcare",100000),
    (51,"Church cemetery","Place to rest the dead; supports 15 bodies a week<br>Upkeep of $/£/€ 350","Deathcare",7000),
    (52,"Burial Catacoumbs","Place to rest the dead; supports 300 bodies a week<br>Upkeep of $/£/€ 1330","Deathcare",22000),
    (53,"Crematorium","Place to rest the dead; supports 3000 bodies a week<br>Upkeep of $/£/€ 12000","Deathcare",70000),
    (54,"Police station","Justice will be served; supports 120 crimes a week<br>Upkeep of $/£/€ 750","Police",35000),
    (55,"Police HQ","Justice will be served; supports 1200 crimes a week<br>Upkeep of $/£/€ 4000","Police",150000),
    (56,"Fire station","Fire protection; protects 1300 houses a week<br>Upkeep of $/£/€ 750","Fire",35000),
    (57,"Fire HQ","Fire protection; protects 50000 houses a week<br>Upkeep of $/£/€ 4000","Fire",150000),

    (58,"Council funded homes","Lower Class residential capacity is increased by +5","ResidentialZoning",50),
    (59,"Middle class homes","Middle Class residential capacity is increased by +5","ResidentialZoning",50),
    (60,"Mansion licensing","Upper Class residential capacity is increased by +5","ResidentialZoning",50),
    (61,"Favelas","Budget Class residential capacity is increased by +40","ResidentialZoning",350),
    (62,"Terrace homes","Lower Class residential capacity is increased by +120","ResidentialZoning",700),
    (63,"Suburb homes","Middle Class residential capacity is increased by +50","ResidentialZoning",400),
    (64,"Manors","Lower Class residential capacity is increased by +30","ResidentialZoning",250),
    (65,"Council Flats","Low-rent apartments capacity is increased by +8","ResidentialZoning",100),
    (66,"Brick Apartments","Affordable apartments capacity is increased by +8","ResidentialZoning",100),
    (67,"Skyrise Architecture","Regular highrise capacity is increased by +8","ResidentialZoning",100),
    (68,"Golden towers","Luxury skyscraper capacity is increased by +5","ResidentialZoning",500),
    (69,"Concrete apartments","Low-rent apartments capacity is increased by +80","ResidentialZoning",500),
    (70,"Budget friendly flats","Affordable apartments capacity is increased by +80","ResidentialZoning",500),
    (71,"Giant metal pillars","Regular highrise capacity is increased by +80","ResidentialZoning",500),
    (72,"Designer glass highrise","Luxury skyscraper capacity is increased by +50","ResidentialZoning",500),

    (73,"Local stores","Essential Early capacity is increased by +5","CommercialZoning",50),
    (74,"Village market","Normal Early capacity is increased by +5","CommercialZoning",50),
    (75,"Premium Carpentry","Luxury Early capacity is increased by +3","CommercialZoning",50),
    (76,"Produce Market","Essential Mid capacity is increased by +50","CommercialZoning",50),
    (77,"Highstreet shops","Normal Mid capacity is increased by +50","CommercialZoning",50),
    (78,"Local designer shops","Luxury Mid capacity is increased by +30","CommercialZoning",50),
    (79,"High capacity produce","Essential Late capacity is increased by +50","CommercialZoning",50),
    (80,"Multi-store shops","Normal Late capacity is increased by +50","CommercialZoning",50),
    (81,"International luxury store","Luxury Late capacity is increased by +30","CommercialZoning",50),

    (82,"Primary School","Provides +500 primary education for citizens","Education",7000),
    (83,"Secondary School","Provides +1500 primary education for citizens","Education",17000),
    (84,"College","Provides +3000 primary education for citizens","Education",50000),
    (85,"University","Provides +5000 primary education for citizens","Education",110000)
    `)

  //Policy_Pack_Policy for Many to Many relationships
  db.run(`CREATE TABLE Policy_Pack_Policy (policy_pack_policy_id INTEGER PRIMARY KEY , policy_pack_id INTEGER, policy_id INTEGER, slot INTEGER,FOREIGN KEY (policy_pack_id) REFERENCES Policy_Pack(policy_pack_id), FOREIGN KEY (policy_id) REFERENCES Policy(policy_id))`)
  db.run(`INSERT INTO Policy_Pack_Policy (policy_pack_id,policy_id,slot) VALUES
    (60,73,1),
    (60,73,2),
    (60,73,3),
    (61,74,1),
    (61,74,2),
    (61,74,3),
    (62,75,1),
    (62,75,2),
    (62,75,3),
    (63,76,1),
    (63,76,2),
    (63,76,3),
    (64,77,1),
    (64,77,2),
    (64,77,3),
    (65,78,1),
    (65,78,2),
    (65,78,3),
    (66,79,1),
    (66,79,2),
    (66,79,3),
    (67,80,1),
    (67,80,2),
    (67,80,3),
    (68,81,1),
    (68,81,2),
    (68,81,3),
    (45,58,1),
    (45,58,2),
    (46,59,1),
    (46,59,2),
    (47,60,1),
    (47,60,2),
    (47,60,3),
    (48,61,1),
    (48,61,2),
    (49,62,1),
    (49,62,2),
    (50,63,1),
    (50,63,2),
    (51,64,1),
    (51,64,2),
    (51,64,3),
    (52,65,1),
    (52,65,2),
    (52,65,3),
    (53,66,1),
    (53,66,2),
    (53,66,3),
    (54,67,1),
    (54,67,2),
    (55,68,1),
    (55,68,2),
    (56,69,1),
    (56,69,2),
    (57,70,1),
    (57,70,2),
    (57,70,3),
    (58,71,1),
    (58,71,2),
    (59,72,1),
    (59,72,2),
    (29,42,1),
    (30,43,1),
    (31,44,1),
    (32,45,1),
    (33,46,1),
    (34,47,1),
    (35,48,1),
    (36,49,1),
    (37,50,1),
    (38,51,1),
    (39,52,1),
    (40,53,1),
    (41,54,1),
    (42,55,1),
    (43,56,1),
    (44,57,1),
    (25,37,1),
    (26,38,1),
    (27,39,1),
    (28,40,1),
    (28,41,1),
    (24,18,1),
    (24,27,2),
    (24,30,3),
    (24,31,4),
    (23,18,1),
    (23,27,1),
    (23,30,1),
    (23,31,1),
    (22,19,1),
    (22,21,2),
    (22,35,3),
    (22,27,4),
    (22,28,5),
    (21,36,1),
    (21,29,1),
    (20,26,1),
    (20,27,1),
    (19,30,1),
    (19,31,1),
    (18,19,1),
    (18,20,1),
    (17,32,1),
    (17,33,1),
    (17,34,1),
    (17,35,2),
    (16,13,1),
    (16,14,1),
    (16,15,2),
    (16,16,2),
    (16,17,3),
    (15,15,1),
    (15,16,1),
    (13,18,1),
    (13,19,1),
    (12,18,1),
    (12,13,1),
    (12,24,1),
    (12,23,1),
    (12,22,1),
    (11,13,1),
    (11,14,1),
    (11,17,1),
    (11,13,1),
    (10,12,1),
    (9,11,1),
    (2,2,1),
    (2,2,2),
    (2,2,3),
    (2,2,4),
    (2,2,5),
    (2,2,6),
    (1,2,1),
    (1,3,2),
    (1,4,3),
    (1,5,3),
    (1,6,4),
    (3,7,1),
    (3,7,2),
    (3,7,3),
    (4,8,1),
    (5,9,1),
    (5,10,2),
    (6,2,1),
    (6,2,2),
    (6,2,3),
    (6,2,4),
    (6,2,5),
    (7,3,1),  
    (8,4,1),
    (8,5,1),
    (8,4,2),
    (8,5,2),
    (69,82,1),
    (70,83,1),
    (71,84,1),
    (72,85,1)`)
  
  db.run(`CREATE TABLE Policy_Effect (policy_effect_id INTEGER PRIMARY KEY , policy_id INTEGER, city_attribute_id INTEGER, delta_value FLOAT, method VARCHAR, dynamic_attribute_id INTEGER, FOREIGN KEY (policy_id) REFERENCES Policy(policy_id), FOREIGN KEY (city_attribute_id) REFERENCES City_Attribute(city_attribute_id))`)
  db.run(`INSERT INTO Policy_Effect (policy_id,city_attribute_id,delta_value, method,dynamic_attribute_id) VALUES
  (1,21,1,'add',null),
  (1,16,1,'add',null),
  (2,6,3,'add',null),
  (3,300,1,'add',null),
  (4,16,1,'add',null),
  (5,17,1,'add',null),
  (6,200,100,'add',null),
  (6,3,-250,'add',null),
  (7,3,-100,'add',null),
  (7,202,7,'add',null),
  (8,3,-600,'add',null),
  (8,202,42,'add',null),
  (9,3,-250,'add',null),
  (9,204,125000,'add',null),
  (10,3,-250,'add',null),
  (10,206,120000,'add',null),
  (11,3,-4000,'add',null),
  (12,3,-5000,'add',null),
  (13,16,3,'add',null),
  (14,17,3,'add',null),
  (15,18,3,'add',null),
  (16,19,3,'add',null),
  (17,20,3,'add',null),
  (18,21,3,'add',null),
  (19,22,3,'add',null),
  (20,23,8,'add',null),
  (21,24,8,'add',null),
  (22,25,3,'add',null),
  (23,26,3,'add',null),
  (24,27,3,'add',null),
  (25,28,3,'add',null),
  (26,29,3,'add',null),
  (27,30,3,'add',null),
  (28,31,3,'add',null),
  (29,32,3,'add',null),
  (30,34,3,'add',null),
  (31,35,3,'add',null),
  (32,25,10,'add',null),
  (33,26,10,'add',null),
  (34,27,10,'add',null),
  (35,28,10,'add',null),
  (36,31,10,'add',null),
  (37,200,500,'add',null),
  (37,3,-750,'add',null),
  (38,200,5000,'add',null),
  (38,3,-5550,'add',null),
  (39,200,15000,'add',null),
  (39,3,-10000,'add',null),
  (40,200,0,'add',null),
  (41,200,0,'add',null),
  (42,202,160,'add',null),
  (42,3,-1850,'add',null),
  (43,202,200,'add',null),
  (43,3,-1400,'add',null),
  (44,202,500,'add',null),
  (44,3,-5000,'add',null),
  (45,220,3,'add',null),
  (45,3,-200,'add',null),
  (46,220,50,'add',null),
  (46,3,-2000,'add',null),
  (47,220,100,'add',null),
  (47,3,-10000,'add',null),
  (48,216,50,'add',null),
  (48,3,-250,'add',null),
  (49,216,300,'add',null),
  (49,3,-1330,'add',null),
  (50,216,3000,'add',null),
  (50,3,-12000,'add',null),
  (51,218,15,'add',null),
  (51,3,-250,'add',null),
  (52,218,300,'add',null),
  (52,3,-1330,'add',null),
  (53,218,3000,'add',null),
  (53,3,-12000,'add',null),
  (54,218,3000,'add',null),
  (54,3,-12000,'add',null),
  (55,222,120,'add',null),
  (55,3,-750,'add',null),
  (56,222,1200,'add',null),
  (56,3,-4000,'add',null),
  (56,224,1300,'add',null),
  (56,3,-750,'add',null),
  (57,224,50000,'add',null),
  (57,3,-4000,'add',null),
  (58,7,5,'add',null),
  (59,8,5,'add',null),
  (60,9,40,'add',null),
  (61,6,120,'add',null),
  (62,7,50,'add',null),
  (63,8,30,'add',null),
  (64,9,5,'add',null),
  (65,11,5,'add',null),
  (66,12,5,'add',null),
  (67,13,5,'add',null),
  (68,10,80,'add',null),
  (69,11,80,'add',null),
  (70,12,80,'add',null),
  (71,13,50,'add',null),
  (72,13,50,'add',null),
  (73,300,5,'add',null),
  (74,302,5,'add',null),
  (75,304,3,'add',null),
  (76,306,50,'add',null),
  (77,308,50,'add',null),
  (78,310,30,'add',null),
  (79,312,50,'add',null),
  (80,314,50,'add',null),
  (81,316,30,'add',null),
  (82,208,500,'add',null),
  (83,210,1500,'add',null),
  (84,212,3000,'add',null),
  (85,208,5000,'add',null)
  `)

  db.run(`CREATE TABLE Service_Building_Model (service_building_model_id INTEGER PRIMARY KEY, policy_id INTEGER, city_visulisation_char CHAR(1), name VARCHAR(48), category VARCHAR(48), FOREIGN KEY (policy_id) REFERENCES Policy(policy_id))`)
  db.run(`INSERT INTO Service_Building_Model (service_building_model_id, policy_id, city_visulisation_char, name, category) VALUES
  (1,7,null,'Wind turbine','Electricity'),
  (2,11,null,'Census HQ','Government'),
  (3,12,null,'Taxes HQ','Government'),
  (4,42,null,'Solar Farm','Electricity'),
  (5,43,null,'Oil Plant','Electricity'),
  (6,44,null,'Thermal Powerplant','Electricity'),
  (7,45,null,'Local Landfill','Garbage'),
  (8,46,null,'Large Landfill','Garbage'),
  (9,47,null,'Incineration Plant','Garbage'),
  (10,48,null,'Small Clinc','Healthcare'),
  (11,49,null,'Health Centre','Healthcare'),
  (12,50,null,'Hospital','Healthcare'),
  (13,51,null,'Cemetery','Deathcare'),
  (14,52,null,'Catacoumbs','Deathcare'),
  (15,53,null,'Crematoium','Deathcare'),
  (16,54,null,'Police Station','Police'),
  (17,55,null,'Police HQ','Police'),
  (18,56,null,'Fire station','Fire'),
  (19,57,null,'Fire HQ','Fire')`)
  db.run(`CREATE TABLE Employer_Template_Service (employer_template_service_id INTEGER PRIMARY KEY , service_building_model_id INTEGER, job_id INTEGER, amount INTEGER, FOREIGN KEY (service_building_model_id) REFERENCES Service_Building_Model(service_building_model_id), FOREIGN KEY (job_id) REFERENCES Job(job_id))`)
  db.run(`INSERT INTO Employer_Template_Service (service_building_model_id, job_id, amount) VALUES
  (1,26,1),
  (2,25,10),
  (3,24,10),
  (4,26,3),
  (5,26,5),
  (6,26,12),
  (7,30,3),
  (8,30,10),
  (9,30,25),
  (10,33,2),
  (10,32,1),
  (11,33,3),
  (11,32,5),
  (12,32,25),
  (12,33,25),
  (13,31,3),
  (14,31,7),
  (15,34,10),
  (16,35,5),
  (17,35,35),
  (18,36,5),
  (19,36,35)
  `)
  db.run(`CREATE TABLE Service_Building (service_building_id INTEGER PRIMARY KEY,service_building_model_id INTEGER, building_id INTEGER, policy_collection_id INTEGER,FOREIGN KEY (service_building_model_id) REFERENCES Service_Building_Model(service_building_model_id), FOREIGN KEY (building_id) REFERENCES Building(building_id), FOREIGN KEY (policy_collection_id) REFERENCES Policy_Collection(policy_collection_id))`)

  db.run(`CREATE TABLE Policy_Collection (policy_collection_id INTEGER PRIMARY KEY , policy_id INTEGER, policy_active BOOL, FOREIGN KEY (policy_id) REFERENCES Policy(policy_id))`)

  db.run(`CREATE TABLE Building (building_id INTEGER PRIMARY KEY , name VARCHAR(128), city_visulisation_char CHAR(1))`)
  db.run(`CREATE TABLE Inventory (inventory_id INTEGER PRIMARY KEY , industrial_id INTEGER, material_id INTEGER, quantity INTEGER, FOREIGN KEY (industrial_id) REFERENCES Industrial(industrial_id), FOREIGN KEY (material_id) REFERENCES Material(material_id))`)
  db.run(`CREATE TABLE Industrial (industrial_id INTEGER PRIMARY KEY , building_id INTEGER, industrial_model_id INTEGER, money FLOAT, FOREIGN KEY (building_id) REFERENCES building(building_id))`)
  db.run(`CREATE TABLE Industrial_Model (industrial_model_id INTEGER PRIMARY KEY, stock_made_material_id INTEGER, stock_made_quantity INTEGER NOT NULL, stock_made_max INTEGER NOT NULL,order_index INTEGER NOT NULL, FOREIGN KEY (stock_made_material_id) REFERENCES Material(material_id))`)
  db.run(`INSERT INTO Industrial_Model (industrial_model_id, stock_made_material_id, stock_made_quantity, stock_made_max,order_index) VALUES
    (1,1,1500,1,1),
    (2,2,2300,1,1),
    (3,3,1500,1,1),
    (4,4,2200,1,1),
    (5,5,1800,1,1),
    (6,6,5  ,40,2),
    (7,7,50,15,2),
    (8,8,65,35,2),
    (9,9,25,100,2),
    (10,10,13,210,2),
    (11,11,13,210,2),
    (12,12,13,210,2),
    (13,13,20,100,3),
    (14,14,8,100,3),
    (15,15,16,100,3),
    (16,16,18,100,3),
    (17,17,35,10,4),
    (18,19,36,10,4),
    (19,20,36,10,4)
    `)
  db.run(`CREATE TABLE Industrial_Model_Requirement (industrial_model_requirement_id INTEGER PRIMARY KEY , industrial_model_id INTEGER, material_id INTEGER NOT NULL, min_quantity INTEGER, quantity_used INTEGER, FOREIGN KEY (material_id) REFERENCES Material(material_id), FOREIGN KEY (industrial_model_id) REFERENCES Industrial_Model(industrial_model_id))`)
  db.run(`INSERT INTO Industrial_Model_Requirement (industrial_model_id, material_id, min_quantity, quantity_used) VALUES
    (0,0,0,0),
    (6,1,650,30),
    (7,1,135,6),
    (8,3,550,12),
    (9,4,1650,12),
    (10,5,1400,3),
    (11,2,1400,3),
    (12,2,1400,3),
    (13,11,800,1),
    (13,12,800,1),
    (14,8,1200,7),
    (15,9,1200,7),
    (16,9,700,5),
    (17,8,1800,32),
    (17,14,600,5),
    (18,14,150,9),
    (19,14,150,9)
    `)
  db.run(`CREATE TABLE Employer_Template_Industrial (employer_template_industrial_id INTEGER PRIMARY KEY , industrial_model_id INTEGER, job_id INTEGER, amount INTEGER, FOREIGN KEY (industrial_model_id) REFERENCES Industrial_Model(industrial_model_id), FOREIGN KEY (job_id) REFERENCES Job(job_id))`)
  db.run(`INSERT INTO Employer_Template_Industrial (industrial_model_id, job_id, amount) VALUES
    (1,3,5),
    (2,4,6),
    (3,5,8),
    (4,6,10),
    (5,7,6),
    (6,8,1),
    (6,27,1),
    (7,9,3),
    (8,10,16),
    (9,11,3),
    (10,12,3),
    (11,13,2),
    (12,14,2),
    (13,15,5),
    (14,16,8),
    (15,17,8),
    (16,18,5),
    (17,19,16),
    (18,21,15),
    (19,22,10)`)
  db.run(`CREATE TABLE Commercial (commercial_id INTEGER PRIMARY KEY , building_id INTEGER, commercial_model_id INTEGER, stock_quantity INTEGER, money FLOAT, FOREIGN KEY (building_id) REFERENCES building(building_id))`)
  db.run(`CREATE TABLE Commercial_Model (commercial_model_id INTEGER PRIMARY KEY, stock_material_id INTEGER, min_stock INTEGER NOT NULL, type VARCHAR(16), category VARCHAR(32), FOREIGN KEY (stock_material_id) REFERENCES Material(material_id), FOREIGN KEY (type) REFERENCES Markup(type))`)
  db.run(`INSERT INTO Commercial_Model (commercial_model_id, stock_material_id, min_stock ,type, category) VALUES 
    (1,10,500,'essential','essential_early'),
    (2,11,500,'essential','essential_early'),
    (3,12,500,'essential','essential_early'),

    (4,13,300,'normal','normal_early'),
    (5,7,300,'normal','normal_early'),
    (6,15,300,'normal','normal_early'),
    (7,16,300,'normal','normal_early'),
    (8,12,300,'normal','normal_early'),
    (9,11,300,'normal','normal_early'),

    (10,6,100,'luxury','luxury_early'),

    (11,10,6500,'essential','essential_mid'),
    (12,11,6500,'essential','essential_mid'),
    (13,12,6500,'essential','essential_mid'),

    (14,13,1100,'normal','normal_mid'),
    (15,7,1100,'normal','normal_mid'),
    (16,15,1100,'normal','normal_mid'),
    (17,16,1100,'normal','normal_mid'),
    (18,12,1100,'normal','normal_mid'),
    (19,11,1100,'normal','normal_mid'),

    (20,6,350,'luxury','luxury_mid'),
    (21,17,350,'luxury','luxury_mid'),
    (22,19,350,'luxury','luxury_mid'),
    (23,20,350,'luxury','luxury_mid'),

    (24,10,30000,'essential','essential_late'),
    (25,11,30000,'essential','essential_late'),
    (26,12,30000,'essential','essential_late'),

    (27,13,3500,'normal','normal_late'),
    (28,7,3500,'normal','normal_late'),
    (29,15,3500,'normal','normal_late'),
    (30,16,3500,'normal','normal_late'),

    (31,6,1750,'luxury','luxury_late'),
    (32,17,1750,'luxury','luxury_late'),
    (33,19,1750,'luxury','luxury_late'),
    (34,20,1750,'luxury','luxury_late')
    
    `)  
    //essential_early 8
    //normal_early 12
    //luxury_early 20
    //essential_mid 120
    //normal_mid 130
    //luxury_mid 150
    //essential_late 800
    //normal_late 900
    //luxury_late 1000
  db.run(`CREATE TABLE Markup (type VARCHAR(16) PRIMARY KEY, markup FLOAT)`)
  db.run(`INSERT INTO Markup (type, markup) VALUES
    ('normal',1.40),
    ('luxury',2),
    ('essential',1.25)`)
  db.run(`CREATE TABLE Employer_Template_Commercial (employer_template_commercial_id INTEGER PRIMARY KEY , commercial_model_id INTEGER, job_id INTEGER, amount INTEGER, FOREIGN KEY (commercial_model_id) REFERENCES Commercial_Model(commercial_model_id), FOREIGN KEY (job_id) REFERENCES Job(job_id))`)
  db.run(`INSERT INTO Employer_Template_Commercial (commercial_model_id, job_id, amount) VALUES
    (1,3,2),
    (2,3,2),
    (3,3,2),

    (4,2,1),
    (5,2,1),
    (6,2,1),
    (7,2,1),
    (8,14,1),
    (9,13,1),

    (10,2,1),

    (11,2,32),
    (11,1,1),
    (11,27,3),
    (12,2,28),
    (12,13,5),
    (12,1,1),
    (12,27,3),
    (13,2,20),
    (13,14,10),
    (13,1,1),
    (13,27,3),

    (14,2,6),
    (14,27,2),
    (14,15,5),
    (15,2,10),
    (15,27,3),
    (15,28,2),
    (16,2,5),
    (16,27,1),
    (16,9,1),
    (17,18,4),
    (17,27,1),
    (17,28,1),
    (18,14,3),
    (18,27,1),
    (19,13,3),
    (19,27,1),

    (20,8,2),
    (20,28,1),
    (20,2,1),
    (20,1,1),
    (21,1,1),
    (21,2,20),
    (21,27,4),
    (21,19,8),
    (22,21,4),
    (22,2,5),
    (23,22,4),
    (23,2,2),
    (23,27,1),

    (24,2,205),
    (24,1,3),
    (24,27,35),
    (24,28,20),
    (24,12,20),
    (24,29,5),
    (25,2,205),
    (25,1,3),
    (25,27,35),
    (25,28,20),
    (25,13,20),
    (25,29,5),
    (26,2,205),
    (26,1,3),
    (26,27,35),
    (26,28,20),
    (26,14,20),
    (26,29,5),


    (27,15,45),
    (27,1,1),
    (27,27,5),
    (27,2,12),
    (28,2,48),
    (28,1,1),
    (28,27,3),
    (28,28,5),
    (29,2,48),
    (29,1,1),
    (29,27,3),
    (29,28,5),
    (30,2,10),
    (30,18,13),
    (30,1,1),
    (30,27,3),
    (30,28,5),

    (31,8,15),
    (31,2,5),
    (31,27,2),
    (31,28,2),
    (32,19,65),
    (32,2,25),
    (32,27,10),
    (32,28,10),
    (32,29,3),
    (32,1,1),
    (33,28,30),
    (33,21,10),
    (33,1,1),
    (33,2,10),
    (34,28,10),
    (34,22,26),
    (34,1,1),
    (34,27,1)
    `)
  db.run(`CREATE TABLE Employer (employer_listing_id INTEGER PRIMARY KEY , building_id INTEGER,job_id INTEGER, citizen_id INTEGER, FOREIGN KEY (citizen_id) REFERENCES Citizen(citizen_id), FOREIGN KEY (job_id) REFERENCES Job(job_id), FOREIGN KEY (building_id) REFERENCES Building(building_id))`)
  db.run(`CREATE TABLE Job (job_id INTEGER PRIMARY KEY, name VARCHAR(24), wage FLOAT, min_education_weeks INTEGER, importance FLOAT, hex_colour CHAR(9))`)
  db.run(`INSERT INTO Job (job_id, name,wage,min_education_weeks,importance,hex_colour) VALUES
    (1,"CEO",800,320,1,"#000000ff"),
    (2,"Store clerk",170,10,0.2,"#355b2d"),

    (3,"Lumber Jack",200,100,0.7, "#694d0c"),
    (4,"Farmer",200,90,0.7,"#446f0c"),
    (5,"Miner",190,80,0.6,"#4d5f67"),
    (6,"Oilfielder",300,160,0.7,"#000000"),
    (7,"Fisherman",230,110,0.6,"#288dcb"),
    (8,"Carpenter",520,230,0.9,"#5f6b00"),
    (9,"Papermaker",320,170,0.6,"#795079"),
    (10,"Blacksmiths",380,220,0.7,"#340f28"),
    (11,"Oil technician",450,270,0.7,"#261348"),
    (12,"Filleter",190,45,0.5,"#51889a"),
    (13,"Baker",230,100,0.9,"#ffee00"),
    (14,"Butchers",240,105,0.8,"#da4343"),
    (15,"Chef",290,155,0.8,"#8d0530"),
    (16,"Electrician",550,290,0.8,"#d1830d"),
    (17,"Plastician",330,190,0.72,"#09a1d4"),
    (18,"Chemist",510,300,0.8,"#1ab25c"),
    (19,"Mechanic",460,250,0.7,"#4b4c4d"),
    (20,"Aerospace Engineer",650,330,0.9,"#610be3"),
    (21,"Programmer",270,150,0.6,"#340df7"),
    (22,"Creative Director",340,200,0.8,"#b20505"),
    (23,"Receptionist",370,220,0.7,"#dd9c11"),

    (24,"Tax Officer",450,260,0.8,"#0e5704"),
    (25,"Census Officer",220,70,0.7,"#83392b"),

    (26,"Electrical Engineer",450,260,0.8,"#eccd1e"),
    (27,"Cleaner",170,5,0.1,"#20e5de"),
    (28,"Customer Service",230,100,0.8,"#d70202"),
    (29,"Mascot",255,120,0.3,"#9abf56"),

    (30,"Garbage Man",230,90,0.8,"#431d1d"),
    (31,"Ground keeper",280,155,0.7,"#5e951a"),
    (32,"Nurse",350,180,0.8,"#f06294"),
    (33,"Doctor",450,380,0.9,"#06fefe"),
    (34,"Crematorium technician",280,160,0.7,"#aeb914"),
    (35,"Police officer",270,170,0.9,"#25189a"),
    (36,"Firefighter",270,170,0.9,"#dd4433"),

    (37,"Teacher",230,180,0.9,"#079886")
    `)
  db.run(`CREATE TABLE Material (material_id INTEGER PRIMARY KEY, name VARCHAR(128), local_price FLOAT, trade_price FLOAT)`)
  db.run(`INSERT INTO Material (material_id,name, local_price, trade_price) VALUES
    (1,'Wood', 0.8, 1.2),
    (2,'Agriculture', 0.6, 0.9),
    (3,'Ore', 1.2, 1.8),
    (4,'Crude Oil', 1.6, 2.4),
    (5,'Raw Fish', 0.8, 1.2),

    (6,'Furniture', 14, 20),
    (7,'Paper', 3, 4.3),
    (8,'Metal', 3.5, 5.0),
    (9,'Oil', 2.5, 3.5),
    (10,'Processed Fish', 1.2, 1.6),
    (11,'Baked Goods', 1.2, 1.6),
    (12,'Meat', 1.2, 1.6),

    (13,'Meals', 3.5, 5),
    (14,'Electronics', 14, 20),
    (15,'Plastics', 4, 5),
    (16,'Chemicals', 3.0, 4.3),

    (17,'Vehicles', 100, 125),
    (18,'Spaceships', 200000, 200000),

    (19,'Software', 18, 25),
    (20,'Media', 18, 25)`)
  db.run(`CREATE TABLE Residential (residential_id INTEGER PRIMARY KEY , building_id INTEGER, residential_model_id INTEGER, FOREIGN KEY (residential_model_id) REFERENCES Residential_Model(residential_model_id))`)
  db.run(`CREATE TABLE Residential_Model (residential_model_id INTEGER PRIMARY KEY , max_groups INTEGER, rent FLOAT, type VARCHAR(16))`)
  db.run(`INSERT INTO Residential_Model (max_groups, rent, type) VALUES
    (2,70,'budget'),
    (3,68,'budget'),
    (4,67,'budget'),
    (5,65,'budget'),
    (5,120,'lower'),
    (6,115,'lower'),
    (7,112,'lower'),
    (8,108,'lower'),
    (9,105,'lower'),
    (10,100,'lower'),
    (5,170,'middle'),
    (6,165,'middle'),
    (7,160,'middle'),
    (8,155,'middle'),
    (9,152,'middle'),
    (10,150,'middle'),
    (11,148,'middle'),
    (12,145,'middle'),
    (1,300,'upper'),
    (2,270,'upper'),
    (3,265,'upper'),
    (4,250,'upper'),
    (45,110,'lowrent'),
    (50,108,'lowrent'),
    (52,106,'lowrent'),
    (55,104,'lowrent'),
    (60,102,'lowrent'),
    (25,160,'affordable'),
    (30,155,'affordable'),
    (35,155,'affordable'),
    (40,155,'affordable'),
    (45,150,'affordable'),
    (50,145,'affordable'),
    (60,142,'affordable'),
    (70,140,'affordable'),
    (80,140,'affordable'),
    (85,138,'affordable'),
    (60,240,'regular'),
    (65,230,'regular'),
    (68,228,'regular'),
    (70,220,'regular'),
    (80,215,'regular'),
    (90,212,'regular'),
    (20,320,'luxury'),
    (30,310,'luxury'),
    (40,305,'luxury'),
    (45,300,'luxury'),
    (50,290,'luxury'),
    (52,290,'luxury')`)
  db.run(`CREATE TABLE Citizen (citizen_id INTEGER PRIMARY KEY , name VARCHAR(32), parent_id INTEGER,turn_of_birth INTEGER, money FLOAT, residential_id INTEGER, education_weeks INTEGER, happiness FLOAT, dead BOOLEAN)`)
  db.run(`CREATE TABLE Group_Collection (group_collection_id INTEGER PRIMARY KEY , group_id INTEGER, citizen_id INTEGER, FOREIGN KEY (citizen_id) REFERENCES Citizen(citizen_id))`)
  db.run(`CREATE TABLE Group_Residential_Collection (group_residential_id INTEGER PRIMARY KEY , group_id INTEGER, residential_id INTEGER, FOREIGN KEY (group_id) REFERENCES Group_Collection(group_id), FOREIGN KEY (residential_id) REFERENCES Residential(residential_id))`)

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
  tryLog("Adding " + attribute_value + " into " + table)
  const stmt = db.prepare(`INSERT INTO ${table} ${attribute_reference} VALUES ${attribute_value}`)
  stmt.step()
  stmt.free()
}

function nextAttributeValue(table, attribute){
  stmt = db.prepare(`SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM ${table} WHERE ${attribute} = 1) THEN 1 ELSE ( SELECT MIN(t1.${attribute} + 1) FROM ${table} t1 LEFT JOIN ${table} t2 ON t1.${attribute} + 1 = t2.${attribute} WHERE t2.${attribute} IS NULL) END AS next_id`)
  
  stmt.step();
  const result = stmt.getAsObject();
  stmt.free();

  return Number(result.next_id);
}

//READ
function GetDBElements(table,attribute,whereAttribute,whereAttributeValue) {
  let result = []
  let stmt = null
  //This is mainly implemented for the city table since there will never need to be a where clause
  if (whereAttribute === null || whereAttributeValue === null){
    tryLog('Getting data in the table ' + table + ' under the attribute: ' + attribute)
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
    tryLog('Getting data in the ' + table + ' under the attribute: ' + attribute + '; the data is also expected to have an attribute ' + whereAttribute + ' of ' + whereAttributeValue)
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
  tryLog("Getting data in the " + table + " under the attribute: " + attribute + "; the data is also expected to have an attribute " + whereAttribute1 + " of " + whereAttributeValue1 + " and " + whereAttribute2 + " of " + whereAttributeValue2)
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
  tryLog("Updating " + table + " where " + whereAttribute + " is " + whereAttributeValue + " so " + attribute + " is now " + attributeReplacement)
  if (whereAttribute === null){
    db.run("UPDATE " + table + " SET " + attribute + " = '" + attributeReplacement + "'")
    return
  }
  
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

async function UpdateAddDB(table,attribute,attributeDelta,whereAttribute,whereAttributeValue){
  tryLog("Updating " + table + " where " + whereAttribute + " is " + whereAttributeValue + " so " + attribute + " has had " + attributeDelta + " added")
  const currentValue = Number(await GetDBElements(table,attribute,whereAttribute,whereAttributeValue)[0])
  const newValue = currentValue + attributeDelta
  await UpdateDB(table,attribute,newValue,whereAttribute,whereAttributeValue)
}

async function DeleteDB(table,whereAttribute,whereAttributeValue){
  tryLog("Deleting " + table + " where " + whereAttribute + " is " + whereAttributeValue) 
  const stmt = db.prepare(`DELETE FROM ${table} WHERE ${whereAttribute} = ?`);
  stmt.run([whereAttributeValue]);
  stmt.free();
}

//DEBUG

//CONSOLE PRINT function
function printTable(tableName) {
  if (!getDebugModeOn()){
    return
  }
  tryLog('The following is the current data in the table ' + tableName)
    if (!db) {
    console.warn('db is undefined, stop trying to run queries!');
    return;
    }
    //Get it all
  const printTableSQL = db.prepare(`SELECT * FROM ${tableName}`);
  //Each row
  while (printTableSQL.step()) {
    //log it 🪵
    tryLog(printTableSQL.getAsObject());
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
  tryLog(category)
  let result = [];
  let stmt;
  if (category !== null){
   stmt = db.prepare(`SELECT DISTINCT Policy_Collection.policy_id FROM Policy_Collection INNER JOIN Policy ON Policy_Collection.policy_id = Policy.policy_id WHERE policy_category = "` + category + `" ORDER BY policy_name DESC`);
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


//db.run(`CREATE TABLE Building (building_id INTEGER PRIMARY KEY , name VARCHAR(128), city_visulisation_char CHAR(1))`)
function saveBuilding(buildingId, buildingName, buildingCityVisulisationChar){
  if (buildingCityVisulisationChar == null) {
    buildingCityVisulisationChar = ' '
  }

  tryLog(`building of buildingId ${buildingId} is being saved`)
  if (!buildingId){
    console.error("BuildingId is not valid")
    return
  }

  db.run(`UPDATE Building SET name = "${buildingName}", city_visulisation_char = "${buildingCityVisulisationChar}" WHERE building_id = ${Number(buildingId)}`)

}

//db.run(`CREATE TABLE Residential (residential_id INTEGER PRIMARY KEY , building_id INTEGER, residential_model_id INTEGER, FOREIGN KEY (residential_model_id) REFERENCES Residential_Model(residential_model_id))`)
function saveResidential(residentialId, buildingId, residentialModelId){
  tryLog(`residential of residentialId ${residentialId} is being saved`)
  if (!residentialId){
    console.error("residentialId is not valid")
    return
  }
  db.run(`UPDATE Residential SET building_id = ${Number(buildingId)}, residential_model_id = ${Number(residentialModelId)} WHERE residential_id = ${Number(residentialId)}`)
}

function saveCommercial(commercialId,buildingId,commercialModelId, stockQuantity, money){
  tryLog(`commercial of commercialId ${commercialId} is being saved`)
  if (!commercialId){
    console.error("commercialId is not valid")
    return
  }

  db.run(`UPDATE Commercial SET building_id = ${Number(buildingId)}, commercial_model_id = ${Number(commercialModelId)}, stock_quantity = ${Number(stockQuantity)}, money = ${Number(money)} WHERE commercial_id = ${Number(commercialId)}`)
}

function saveIndustrial(industrialId, buildingId, industrialModelId, money, inventory){
  tryLog(`industrial of industrialId ${industrialId} is being saved`)
  if (!industrialId){
    console.error("industrialId is not valid")
    return
  }
  tryLog(`UPDATE Industrial SET building_id = ${Number(buildingId)}, industrial_model_id = ${Number(industrialModelId)}, money = ${Number(money)} WHERE industrial_id = ${Number(industrialId)}`)
  db.run(`UPDATE Industrial SET building_id = ${Number(buildingId)}, industrial_model_id = ${Number(industrialModelId)}, money = ${Number(money)} WHERE industrial_id = ${Number(industrialId)}`)
  tryLog(`Now saving its inventory`)
  if (inventory !== null){
    for (const inv of inventory){
      db.run(`UPDATE Inventory SET quantity = ${Number(inv[2])}, material_id = ${Number(inv[1])}, industrial_id = ${Number(industrialId)} WHERE inventory_id = ${Number(inv[0])}`)
    }
  }
}

function saveService(serviceBuildingId,buildingId,serviceBuildingModelId,policyCollectionId){
  tryLog(`service building of serviceId ${serviceBuildingId} is being saved`)
  if (!serviceBuildingId){
    console.error("serviceBuildingId is not valid")
    return
  }
  db.run(`UPDATE Service_Building SET service_building_model_id = ${Number(serviceBuildingModelId)}, policy_collection_id = ${Number(policyCollectionId)}, building_id = ${Number(buildingId)} WHERE service_building_id = ${Number(serviceBuildingId)}`)
}

function eraseBuilding(buildingId){
  db.run(`DELETE FROM Building WHERE building_id = ${Number(buildingId)}`)
  printTable("Building")
}

function eraseService(serviceBuildingId,buildingId){
  db.run(`DELETE FROM Service_Building WHERE service_building_id = ${serviceBuildingId}`)
  db.run(`DELETE FROM Employer WHERE building_id = ${buildingId}`)
  printTable("Service_Building")
}

//db.run(`CREATE TABLE Citizen (citizen_id INTEGER PRIMARY KEY , name VARCHAR(32), parent_id INTEGER,turn_of_birth INTEGER, money FLOAT, education_weeks INTEGER, dead BOOLEAN)`)
async function saveCitizen(citizenId,name,parentId,turnOfBirth,money,residentialId,educationWeeks,happiness,dead,groupId){
  tryLog("citizen of citizenId " + citizenId + " is being saved")
  if (!citizenId){
    console.error("citizenId is not valid")
    return
  }
  if (parentId != null){
    parentId = Number(parentId)
  }
  //Citizen Table
  tryLog([citizenId,name,parentId,turnOfBirth,money,residentialId,educationWeeks,happiness,dead,groupId])
  db.run(`UPDATE Citizen SET name = "${name}", parent_id = ${parentId},turn_of_birth = ${Number(turnOfBirth)}, money = ${Number(money)}, education_weeks = ${Number(educationWeeks)}, happiness = ${Number(happiness)}, dead = ${Number(dead)} WHERE citizen_id = ${Number(citizenId)};`)

  //Group Collection Table  
  db.run(`UPDATE Group_Collection SET group_id = ${Number(groupId)} WHERE citizen_id = ${Number(citizenId)}`)

  //Group Collection Table
  db.run(`UPDATE Group_Residential_Collection SET residential_id = ${Number(residentialId)} WHERE group_id = ${Number(groupId)}`)
}

async function eraseCitizen(citizenId){
  db.run(`DELETE FROM Citizen WHERE citizen_id = ${citizenId}`)
  const groupId = await GetDBElements("Group_Collection","group_id","citizen_id",citizenId)[0]
  await db.run(`DELETE FROM Group_Collection WHERE citizen_id = ${citizenId}`)
  const group = await GetDBElements("Group_Collection","group_collection_id","group_id",groupId)
  const groupCount = group.length
  if (groupCount == 0){
    db.run(`DELETE FROM Group_Residential_Collection WHERE group_id = ${groupId}`)
  }
  const employerListingId = await GetDBElements("Employer","employer_listing_id","citizen_id",citizenId)[0]
  await UpdateDB("Employer","citizen_id",-1,"employer_listing_id",employerListingId)
}

async function availableHouses(){
  let availableHouses = [];
  const stmt = db.prepare(`SELECT r.residential_id FROM Residential r LEFT JOIN Residential_Model rm ON rm.residential_model_id = r.residential_model_id LEFT JOIN Group_Residential_Collection gc ON r.residential_id = gc.residential_id GROUP BY r.residential_id HAVING COUNT (gc.group_id) < rm.max_groups`);

  while (stmt.step()) {
    const row = stmt.getAsObject();
    availableHouses.push(row.residential_id);
  }

  stmt.free()
  SortingObject.shuffle(availableHouses)
  return availableHouses
}

async function GetBach(){
  let result = []
  stmt = db.prepare(`SELECT citizen_id FROM Group_Collection WHERE group_id IN (SELECT group_id FROM Group_Collection GROUP BY group_id HAVING COUNT(*) = 1)`)

  while (stmt.step()){
    let row = stmt.getAsObject()
    result.push(row["citizen_id"])
  }

  stmt.free()
  return result
}

async function GetGlobalHappiness(){
  const average = array => array.reduce((first, second) => first + second) / array.length;

  const happinessArray = await GetDBElements("Citizen","happiness",null,null)
  let citizenHappinessAvg = average(happinessArray)

  //penalty
  //roads
  if (await IsThereADeficit(200)){
    citizenHappinessAvg *= 0.70
  }  
  //electricity
  if (await IsThereADeficit(202)){
    citizenHappinessAvg *= 0.70
  } 
  //water
  if (await IsThereADeficit(204)){
    citizenHappinessAvg *= 0.65
  } 
  //sewage
  if (await IsThereADeficit(206)){
    citizenHappinessAvg *= 0.65
  }
  //healthcare
  if (await IsThereADeficit(216)){
    citizenHappinessAvg *= 0.6
  }
  //deathcare
  if (await IsThereADeficit(218)){
    citizenHappinessAvg *= 0.8
  }
  //garabage
  if (await IsThereADeficit(220)){
    citizenHappinessAvg *= 0.8
  }
  //police
  if (await IsThereADeficit(222)){
    citizenHappinessAvg *= 0.8
  }
  //fire
  if (await IsThereADeficit(224)){
    citizenHappinessAvg *= 0.8
  }
  
  return Number(citizenHappinessAvg)
}

async function IsThereADeficit(id){
  const supply = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",id)[0]
  const demand = await GetDBElements("City_Attribute","attribute_value","city_attribute_id",id + 1)[0]
  const profit = supply - demand
  return (profit < 0)
}
const debugMode = false

async function Debug (){
  if (debugMode){
    
    document.getElementById("StartBlocker").style.visibility = "hidden"
    await NewDB("Coolville")
    //skip tutorials
    UpdateDB("Tutorial","completed",1,"tutorial_id",2)
    UpdateDB("Tutorial","completed",1,"tutorial_id",3)
    UpdateDB("Tutorial","completed",1,"tutorial_id",4)
    await UpdateDB("Tutorial","completed",1,"tutorial_id",5)
    PrepareDesktop()
    //add the unique policies pack to save me time
    UpdateDB("Policy_Pack","policy_pack_unlocked",1,null,null)
    InsertDB('Policy_Collection','(policy_id, policy_active)','(11,1)')
    InsertDB('Policy_Collection','(policy_id, policy_active)','(12,1)')
  }
}

function tryLog(input){
  if (debugMode){
    console.log(input)
  }
}

function getDebugModeOn(){
  return debugMode
}
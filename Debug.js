const debugMode = true

async function Debug(){
  if (debugMode){
    document.getElementById("StartBlocker").style.visibility = "hidden"
    await NewDB("Coolville")
    PrepareDesktop()
  }
}

//This has to be done to ensure that the other js files are loaded
window.addEventListener('load', function() {
    document.addEventListener('click', function(event) {
      if (event.target.tagName.toLowerCase() === 'button') {
        const clickSound = new Audio('Assets/Audio/click.wav');
        clickSound.play();
      }
      if (event.target.className.toLowerCase() === 'activation') {
        const clickSound = new Audio('Assets/Audio/Activation.wav');
        clickSound.play();
      }
  });

  Debug()
})
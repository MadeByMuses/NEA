function GetGameDate(ahead){
  if (ahead == null){
    ahead = 0
  }
  const gameStartDay = GetDBElements("City","start_date",null,null)[0];
  const gameTurn = GetDBElements("City_Attribute","attribute_value","city_attribute_id",1)[0];
  const gameDay = new Date((Number(gameTurn + ahead) * 604800000) + gameStartDay); //604800000 is the amount of milliseconds in a week (1000*60*60*24*7)
  return gameDay.getDate() + "/" + gameDay.getMonth() + "/" + gameDay.getFullYear()
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

function DrawPieChart(id, data){
  const canvasObject = document.getElementById(id)
  const listObject = document.getElementById(id + "BulletList")
  const canvas = canvasObject.getContext("2d")
  let total = 0
  for (let i = 0; i < data.length; i++){
    total += data[i][1]
  } 
  let startAngle = 0
  const unitLength = (canvasObject.width / 2)
  for (let i = 0; i < data.length; i++){
    const entry = data[i]
    const percentage = entry[1] / total
    const sliceAngle = percentage * 2 * Math.PI
    canvas.beginPath();
    canvas.moveTo(unitLength,unitLength);
    canvas.arc(unitLength,unitLength,unitLength,startAngle,sliceAngle+startAngle)
    canvas.closePath();
    canvas.fillStyle = entry[2]
    canvas.fill()
    listObject.innerHTML += `<li style="color:` + entry[2] + `">` + entry[0] + ` - ` + Math.floor(percentage*10000)/100 + `%</li>`
    startAngle += sliceAngle
  }
}

function InsertTable(id, data){

  const table = document.getElementById(id)
  let html = ""
  console.log(data[0])
  //insert the parameters in the heading
  html += `<thead><tr>`
  const parameters = data[0]
  for (const parameter of parameters){
    html += `<th>${parameter}</th>`
  }
  html += `</tr></thead>`

  table.innerHTML += `<tbody>`
  for (const dataSection of data.slice(1)){
    html += `<tr>`
    for (const dataSectionBit of dataSection){
      html += `<td>${dataSectionBit}</td>`
    }
    html += `</tr>`
  }
  html += `</tbody>`
  table.innerHTML += html


}



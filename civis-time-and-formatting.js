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
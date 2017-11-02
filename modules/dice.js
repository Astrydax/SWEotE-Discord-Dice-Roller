function polyhedral(sides, str, message) {
  var total = 0;
  //no modifier
  if (str.length < 1) {
    console.log("No modifier, straight d100 roll");
      let r = dice(sides);
      total = +r;
      message.reply(" rolled a d" + sides + ": " + total);
  //addition modifier
  } else if (str.includes("+") || str[0][0] == "+") {
		console.log("+ modifier detected");
        var modifier = (str[str.length - 1]).replace(/\D/g, "");
        let r = dice(sides);
        total = +r + +modifier;
        message.reply(" rolled a d" + sides + ": " + r + " + " + modifier + " " + "for a total of " + total);
	//subtraction modifier
  } else if (str.includes("-") || str[0][0] == "-") {
    	console.log("- modifier detected");
        var modifier = (str[str.length - 1]).replace(/\D/g, "");
        let r = dice(sides);
        total = +r - +modifier;
        message.reply(" rolled a d" + sides + ": " + r + " - " + modifier + " " + "for a total of " + total);
    }
    return total;
}

function dice(sides) {
  var number =  Math.floor(Math.random() * sides) + 1;
  return number;
}


module.exports = {
  dice: dice,
  polyhedral: polyhedral,
};

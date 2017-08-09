
function print(str, message) {

if (message.guild.id == 281223108323704833) {
  switch (str) {
    case "ga":
      str = "Abil1A";
      break;
    case "gsa":
      str = "Abil1A1S";
      break;
    case "gs":
      str = "Abil1S";
      break;
    case "gaa":
      str = "Abil2A";
      break;
    case "gss":
      str = "Abil2S";
      break;
    case "gb":
      str = "AbilBla";
      break;
    case "adv":
      str = "Advantage";
      break;
    case "ba":
      str = "Boos1A";
      break;
    case "bsa":
      str = "Boos1A1S";
      break;
    case "bs":
      str = "Boos1S";
      break;
    case "baa":
      str = "Boos2A";
      break;
    case "bb":
      str = "BoosBla";
      break;
    case "rf":
      str = "Chal1F";
      break;
    case "rt":
      str = "Chal1T";
      break;
    case "rft":
      str = "Chal1T1F";
      break;
    case "rff":
      str = "Chal2F";
      break;
    case "rtt":
      str = "Chal2T";
      break;
    case "rb":
      str = "ChalBla";
      break;
    case "rd":
      str = "ChalDes";
      break;
    case "ds":
      str = "Dark";
      break;
    case "des":
      str = "Despair";
      break;
    case "pf":
      str = "Diff1F";
      break;
    case "pt":
      str = "Diff1T";
      break;
    case "pft":
      str = "Diff1T1F";
      break;
    case "pff":
      str = "Diff2F";
      break;
    case "ptt":
      str = "Diff2T";
      break;
    case "pb":
      str = "DiffBla";
      break;
    case "fail":
      str = "Failure";
      break;
    case "wd":
      str = "Forc1D";
      break;
    case "wl":
      str = "Forc1L";
      break;
    case "wdd":
      str = "Forc2D";
      break;
    case "wll":
      str = "Forc2L";
      break;
    case "ls":
      str = "Light";
      break;
    case "yaa":
      str = "Prof2A";
      break;
    case "ya":
      str = "Prof1A";
      break;
    case "ysa":
      str = "Prof1A1S";
      break;
    case "ys":
      str = "Prof1S";
      break;
    case "yss":
      str = "Prof2S";
      break;
    case "yb":
      str = "ProfBla";
      break;
    case "yt":
      str = "ProfTri";
      break;
    case "blkf":
      str = "Setb1F";
      break;
    case "blkt":
      str = "Setb1T";
      break;
    case "blkb":
      str = "SetbBla";
      break;
    case "suc":
      str = "Success";
      break;
    case "thr":
      str = "Threat";
      break;
    case "tri":
      str = "Triumph";
      break;
    default:
      break;
  }
}

  if (message.guild.emojis.find('name', str) != null) {
    var final = message.guild.emojis.find('name', str).toString();
  } else {
    var final = str + " custom emoji not installed on this server.  Please upload.\n";
  }
  return final;
}

module.exports = {
    print: print,
};


function print(str, message) {

  if (message.guild.id == 329634771909083147) {
    return message.guild.emojis.find('name', str).toString();
  }

  switch (str) {
    case "ga":
      str = "<:ga:294232171131043851>";
      break;
    case "gsa":
      str = "<:gsa:294232171688886273>";
      break;
    case "gs":
      str = "<:gs:294232171840012288>";
      break;
    case "gaa":
      str = "<:gaa:294232171369988096>";
      break;
    case "gss":
      str = "<:gss:294232171907121162>";
      break;
    case "gb":
      str = "<:gb:294232171286364161>";
      break;
    case "adv":
      str = "<:adv:294221000277491714>";
      break;
    case "ba":
      str = "<:ba:294475842778693633>";
      break;
    case "bsa":
      str = "<:bsa:294475842803728384>";
      break;
    case "bs":
      str = "<:bs:294475842812248064>";
      break;
    case "baa":
      str = "<:baa:294475841453162506>";
      break;
    case "bb":
      str = "<:bb:294475842799665152>";
      break;
    case "rf":
      str = "<:rf:294475842501738498>";
      break;
    case "rt":
      str = "<:rt:294475842564653057>";
      break;
    case "rft":
      str = "<:rft:294475842833219585>";
      break;
    case "rff":
      str = "<:rft:294475842833219585>";
      break;
    case "rtt":
      str = "<:rtt:294475842346811394>";
      break;
    case "rb":
      str = "<:rb:294475842803859466>";
      break;
    case "rd":
      str = "<:rd:294475839305678848>";
      break;
    case "ds":
      str = "<:ds:294221001015689217>";
      break;
    case "des":
      str = "<:des:326386750450696192>";
      break;
    case "pf":
      str = "<:pf:294238724659740673>";
      break;
    case "pt":
      str = "<:pt:294238723837788172>";
      break;
    case "pft":
      str = "<:pft:294238724621860874>";
      break;
    case "pff":
      str = "<:pff:294238724638900224>";
      break;
    case "ptt":
      str = "<:ptt:294238724680581120>";
      break;
    case "pb":
      str = "<:pb:294238724043309057>";
      break;
    case "fail":
      str = "<:fail:326386750446370827>";
      break;
    case "wd":
      str = "<:wd:294661334971187200>";
      break;
    case "wl":
      str = "<:wl:294661335310925834>";
      break;
    case "wdd":
      str = "<:wdd:294661335243816960>";
      break;
    case "wll":
      str = "<:wll:294661335155867650>";
      break;
    case "ls":
      str = "<:ls:294221000504246283>";
      break;
    case "yaa":
      str = "<:yaa:294475842699132930>";
      break;
    case "ya":
      str = "<:ya:294475842602532866>";
      break;
    case "ysa":
      str = "<:ysa:294475842854322177>";
      break;
    case "ys":
      str = "<:ys:294475842506194946>";
      break;
    case "yss":
      str = "<:yss:294475842573303809>";
      break;
    case "yb":
      str = "<:yb:294475842581692417>";
      break;
    case "yt":
      str = "<:yt:294475842812248074>";
      break;
    case "blkf":
      str = "<:blkf:294475839171461121>";
      break;
    case "blkt":
      str = "<:blkt:294475842615115777>";
      break;
    case "blkb":
      str = "<:blkb:294475842757722113>";
      break;
    case "suc":
      str = "<:suc:294221000814493696>";
      break;
    case "thr":
      str = "<:thr:326386751037767681>";
      break;
    case "tri":
      str = "<:tri:294221000713830401>";
      break;
    default:
      break;
  }
  return str;
}

module.exports = {
    print: print,
};

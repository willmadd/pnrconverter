const db = require("../db");
// const moment = require("moment-timezone");
const spacetime = require("spacetime");

exports.getAirlineName = (flightInfo, index) => {
  
  let iatacode = { iatacode: flightInfo.slice(0, 2) };
  return db.one(
    "SELECT iatacode, airline_name , A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z FROM airlinemaster WHERE iatacode LIKE  $/iatacode/",
    iatacode
  );
};

exports.getFlightNo = flightInfo => {
  let regex = /\d+/g;
  return Number(flightInfo.slice(2).match(regex)[0]).toString();
};

function getbookingClass(flightInfo) {
  let regex = /\d[A-Z]\s|\s[A-Z]\s/;
  return flightInfo.match(regex)[0].trim();
  // return flightInfo;
}

exports.getbookingClass = flightInfo => {
  let regex = /\d[A-Z]\s|\s[A-Z]\s/;
  let result = flightInfo.match(regex);
  if (!result) {
    return undefined;
  }

  return result[0].replace(/[0-9]+/, "").trim();
};

exports.getDepartureDate = flightInfo => {
  // console.log(flightInfo)
  if (flightInfo === undefined) {
    return;
  }
  let regex = /[0-9]+((JAN)|(FEB)|(MAR)|(APR)|(MAY)|(JUN)|(JUL)|(AUG)|(SEP)|(OCT)|(NOV)|(DEC))/;
  let date = flightInfo.match(regex)[0].trim();
  // console.log(date);
  return date;
};

exports.getArrivalDate = flightInfo => {
  let regex = /[0-9]+((JAN)|(FEB)|(MAR)|(APR)|(MAY)|(JUN)|(JUL)|(AUG)|(SEP)|(OCT)|(NOV)|(DEC))/g;
  // console.log('ooooooo');
  if (flightInfo.match(regex).length === 2) {
    return flightInfo.match(regex)[1].trim();
  } else if (flightInfo.match(regex).length === 1)
    return flightInfo.match(regex)[0].trim();
};

exports.getDepartureTime = flightInfo => {
  if (flightInfo === undefined) {
    return;
  }

  let regex = /[0-9]{3,4}(A|P|N)|(\b[0-9]{4}\b)|(\b[0-9]{2}:[0-9]{2}\b)/g;
  let usFormattedTimes = flightInfo.slice(10).match(regex);

  if (
    !/[APN]/.test(
      flightInfo
        .slice(10)
        .match(regex)
        .join("")
    )
  ) {
    return flightInfo.slice(10).match(regex)[0];
  }

  let forTime = usFormattedTimes.map(time => {
    return (
      time.slice(0, -3) +
      ":" +
      time
        .slice(-3)
        .replace("P", "pm")
        .replace("A", "am")
    );
  });

  return forTime[0];
};

exports.getArrivalTime = flightInfo => {
  if (flightInfo === undefined) {
    return;
  }
  let regex = /[0-9]{3,4}(A|P|N)|(\b[0-9]{4}\b)|(\b[0-9]{2}:[0-9]{2}\b)/g;
  let usFormattedTimes = flightInfo.slice(10).match(regex);

  if (
    !/[APN]/.test(
      flightInfo
        .slice(10)
        .match(regex)
        .join("")
    )
  ) {
    return flightInfo.slice(10).match(regex)[1];
  }

  let forTime = usFormattedTimes.map(time => {
    return (
      time.slice(0, -3) +
      ":" +
      time
        .slice(-3)
        .replace("P", "pm")
        .replace("A", "am")
    );
  });

  return forTime[1];
};

exports.getDepartureDestination = flightInfo => {
  let regex = /\b[A-Z]{6}\b|\b[A-Z]{3}\s[A-Z]{3}\b/;
  // let departureDest = "";

  if (!flightInfo.match(regex)) {
    return null;
  }
  let departureDest = flightInfo.match(regex)[0];

  if (departureDest.length === 6) {
    return departureDest.slice(0, 3);
  }

  return flightInfo.match(regex)[0].split(" ")[0];
};

exports.getArrivalDestination = flightInfo => {
  let regex = /\b[A-Z]{6}\b|\b[A-Z]{3}\s[A-Z]{3}\b/;
  if (!flightInfo.match(regex)) {
    return null;
  }

  let departureDest = flightInfo.match(regex)[0];

  if (departureDest.length === 6) {
    return departureDest.slice(3);
  }

  return flightInfo.match(regex)[0].split(" ")[1];
};

exports.getAirportInfo = (
  flightInfo,
  index,
  departureDestination,
  arrivalDestination
) => {
  //   let query = "'" + flightInfo.map(code => code.airlineName).join("', '") + "'";
  //   console.log(query);
  // console.log("SELECT * FROM airportdata WHERE airportcode LIKE '"+ arrivalDestination +"' OR airportcode LIKE '" + departureDestination + "' ORDER BY CASE WHEN airportcode LIKE '"+ departureDestination + "' THEN 1 ELSE 0 END")
  return db.many(
    // "SELECT  airportname , cityname , airportcode , latitude , longitude , timezone FROM airportdata WHERE airportcode LIKE 'HKG'"
    "SELECT * FROM airportdata WHERE airportcode LIKE '" +
      arrivalDestination +
      "' OR airportcode LIKE '" +
      departureDestination +
      "' ORDER BY CASE WHEN airportcode LIKE '" +
      arrivalDestination +
      "' THEN 1 ELSE 0 END"
  );
};

exports.formatDate = (date, time, flightLine) => {
  if (!time) {
    return;
  }

  let formattedDate;
  let s;

  if (time.length === 4) {
    formattedDate =
    date.slice(2) +
    " " +
    date.slice(0, 2) +
    ", " +
    new Date().getFullYear().toString() +
    " " +
    time.slice(0, 2) +
    ":" +
    time.slice(2) +
    ":00";
    formattedDate = formattedDate.replace("SEP", "SEPT");
    s = spacetime(formattedDate);
  } else {
    formattedDate =
    date.slice(2) +
    " " +
    date.slice(0, 2) +
    ", " +
    new Date().getFullYear().toString();
    
    formattedDate = formattedDate.replace("SEP", "SEPT");
    s = spacetime(formattedDate);
    s.time(time);
  }
  
  let now = spacetime(new Date());
  
  if (s.isBefore(now)) {
    s.add(1, "year");
  }
  
  if (
    /\#[0-9]{4}\s/.test(flightLine) | /[0-9]{3,4}(A|N|P)\+1/.test(flightLine) | /[0-9]{3,4}(A|N|P)\#1/.test(flightLine) | /#[0-9]{3,4}/.test(flightLine)
    ) {
      s.add(1, "day");
    } else if (
      /\*[0-9]{4}\s/.test(flightLine) | /[0-9]{3,4}(A|N|P)\+2/.test(flightLine)| /\*[0-9]{3,4}/.test(flightLine)
      ) {
        s.add(2, "day");
      } else if (
        /\-[0-9]{4}\s/.test(flightLine) | /[0-9]{3,4}(A|N|P)\-1/.test(flightLine)
        ) {
          s.subtract(1, "day");
        }
        
        newFDate = s.format("iso");
        newNiceDate =
        s.format("day-short") +
        " " +
        s.format("date-ordinal") +
        " " +
        s.format("month-short");
        twelveHoursTime = s.format("time-12h");
        twentyFourHoursTime = s.format("time-h24");
        if (twentyFourHoursTime.length === 4){
          twentyFourHoursTime = "0"+twentyFourHoursTime
        }
        spaceTime =
        s.format("month-short") +
    " " +
    s.format("date") +
    ", " +
    s.format("year") +
    " " +
    s.format("time-h24");
    china=s.format("Y")+"年"+s.format("m")+"月"+s.format("d")+"日";
  return {
    full: newFDate,
    nice: newNiceDate,
    time12: twelveHoursTime,
    time24: twentyFourHoursTime,
    spaceTime: spaceTime,
    china
  };
};

exports.newGetFlightDuration = (
  departureString,
  departureTimeZone,
  arrivalString,
  arrivalTimeZone
) => {
  let d = spacetime(departureString.spaceTime, departureTimeZone);
  let e = spacetime(arrivalString.spaceTime, arrivalTimeZone);
  e.add(1, "second");
  return { hours: e.since(d).diff.hours, minutes: e.since(d).diff.minutes };
};

// exports.getFlightDuration = (
//   departureDate,
//   departureTime,
//   departureTimeZone,
//   arrivalDate,
//   arrivalTime,
//   arrivalTimeZone
// ) => {
//   let departureDateString =
//     departureDate.slice(2) +
//     " " +
//     departureDate.slice(0, 2) +
//     ", " +
//     new Date().getFullYear().toString() +
//     " " +
//     departureTime.slice(0, 2) +
//     ":" +
//     departureTime.slice(2) +
//     ":00";

//   let arrivalDateString =
//     arrivalDate.slice(2) +
//     " " +
//     arrivalDate.slice(0, 2) +
//     ", " +
//     new Date().getFullYear().toString() +
//     " " +
//     arrivalTime.slice(0, 2) +
//     ":" +
//     arrivalTime.slice(2) +
//     ":01";

//   departureDateString = departureDateString.replace("SEP", "SEPT");
//   arrivalDateString = arrivalDateString.replace("SEP", "SEPT");

//   // console.log(departureDateString);
//   let d = spacetime(departureDateString, departureTimeZone);
//   let e = spacetime(arrivalDateString, arrivalTimeZone);
//   // console.log("here");
//   return { hours: e.since(d).diff.hours, minutes: e.since(d).diff.minutes };
// };

exports.newGetTransitTime = (arrivalDate, departureTime, departureDate) => {
  if (!departureTime) {
    return;
  }

  let d = spacetime(arrivalDate.spaceTime);
  let e = spacetime(departureTime.spaceTime);
  console.log(e.since(d).diff);

  if (
    e.since(d).diff.days !== 0 ||
    e.since(d).diff.months !== 0 ||
    e.since(d).diff.years !== 0
  ) {
    return "";
  } else {
    return (
      e.since(d).diff.hours +
      "h " +
      e.since(d).diff.minutes +
      "m"
    );
  }
};

// exports.getTransitTime = (
//   arrivalDate,
//   arrivalTime,
//   nextFlightDepartureDate,
//   nextFlightDepartureTime
// ) => {
//   if (arrivalDate === undefined || nextFlightDepartureDate === undefined) {
//     return "xxx";
//   }
//   // if (nextFlightDepartureDate === undefined){return};
//   let arrivalDateString =
//     arrivalDate.slice(2) +
//     " " +
//     arrivalDate.slice(0, 2) +
//     ", " +
//     new Date().getFullYear().toString() +
//     " " +
//     arrivalTime.slice(0, 2) +
//     ":" +
//     arrivalTime.slice(2) +
//     ":00";

//   let nextFlightDepartureDateString =
//     nextFlightDepartureDate.slice(2) +
//     " " +
//     nextFlightDepartureDate.slice(0, 2) +
//     ", " +
//     new Date().getFullYear().toString() +
//     " " +
//     nextFlightDepartureTime.slice(0, 2) +
//     ":" +
//     nextFlightDepartureTime.slice(2) +
//     ":01";

//   nextFlightDepartureDateString = nextFlightDepartureDateString.replace(
//     "SEP",
//     "SEPT"
//   );
//   arrivalDateString = arrivalDateString.replace("SEP", "SEPT");

//   // console.log(departureDateString);
//   let d = spacetime(arrivalDateString);
//   let e = spacetime(nextFlightDepartureDateString);
//   // console.log(e.since(d).diff);
//   return {
//     months: e.since(d).diff.months,
//     days: e.since(d).diff.days,
//     hours: e.since(d).diff.hours,
//     minutes: e.since(d).diff.minutes
//   };
// };

exports.getFlightDistance = (
  departureLongitude,
  departureLatitude,
  arrivalLongitude,
  arrivalLatitude
) => {
  let distance =
    (3958 *
      3.1415926 *
      Math.sqrt(
        (arrivalLatitude - departureLatitude) *
          (arrivalLatitude - departureLatitude) +
          Math.cos(arrivalLatitude / 57.29578) *
            Math.cos(departureLatitude / 57.29578) *
            (arrivalLongitude - departureLongitude) *
            (arrivalLongitude - departureLongitude)
      )) /
    180;

  if (distance > 12451) {
    distance = 24901 - distance;
  }

  return { miles: Math.round(distance), km: Math.round(distance * 1.60934) };
};

exports.checkLandingDay = (arrTimeObject, depTimeObject) => {

  if (arrTimeObject.nice !== depTimeObject.nice) {
    let time = spacetime(arrTimeObject.spaceTime);
    arrTimeObject.time12 =
      arrTimeObject.time12 +
      " (on " +
      time.format("day-short") +
      " " +
      time.format("date-ordinal") +
      " " +
      time.format("month-short") +
      ")";

      arrTimeObject.time24 =
      arrTimeObject.time24 +
      " (on " +
      time.format("day-short") +
      " " +
      time.format("date-ordinal") +
      " " +
      time.format("month-short") +
      ")";

  }

  return arrTimeObject;
};

exports.sentanceFormat = line => {
  return line
    .split(" ")
    .map(word => {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

exports.getOperatedBy = line => {
  let regex = /Operated\sBy\s(.*)/;
  if (line.match(regex)) {
    return "(" + line.match(regex)[0] + ")";
  } else {
    return "";
  }
};

exports.formatLocation = line => {
  if (line.airportName.split(" ")[0].toLowerCase() !== line.city.toLowerCase()) {
    return line.airportName + ", " + line.city + " (" + line.iataCode + "),";
    //  ;cityAddon = ", " + line.city;
  } else {
    return line.airportName + " (" + line.iataCode + "),";
  }
};

  exports.firstLine = (
    optionsObject,
    depDate,
    airlineName,
    flightNo,
    flightDuration,
    classInfo,
    distance,
    operatedBy
  ) => {
    console.log(optionsObject)
    return (
      (optionsObject.language==="cn"?depDate.china:depDate.nice)+
      " - " +
      (optionsObject.airlineName !== undefined
        ? airlineName.name
        : airlineName.class) +
      " " +
      flightNo +
      (optionsObject.showcabin === "class" ? " " + classInfo.class : " ") +
      (optionsObject.operatedby !== undefined ? " " + operatedBy : "") +
      " " +
      (optionsObject.showcabin === "cabin" ? " - " + classInfo.cabin : "") +
      " " +
      (optionsObject.duration !== undefined
        ? "- " + flightDuration.hours + "h " + flightDuration.minutes + "m "
        : "") +
      (optionsObject.distance === "miles"
        ? "- " + distance.miles + " Miles"
        : optionsObject.distance === "km"
          ? "- " + distance.km + " KM "
          : "")
    );
  };


exports.timeCheck = (optionsObject, time) => {
  if (optionsObject.timeFormat === "on") {
    return time.time12;
  } else if (time.time24.length === 4) {
    return "0" + time.time24;
  } else {
    return time.time24;
  }
};


exports.formatDistance = (optionsObject, distance) =>{
  return distance[optionsObject]+" "+optionsObject
}
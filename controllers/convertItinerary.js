//remember to uninstall momnentjs if not using

const util = require('util')

const {
  getTransitTime,
  getAirlineName,
  getFlightNo,
  getbookingClass,
  getDepartureDate,
  getArrivalDate,
  getDepartureTime,
  getArrivalTime,
  getDepartureDestination,
  getArrivalDestination,
  getAirportInfo,
  getFlightDuration,
  getFlightDistance,
  formatDate,
  newGetFlightDuration,
  formatTime,
  checkLandingDay,
  newGetTransitTime,
  formatDistance,
  sentanceFormat,
  getOperatedBy,
  firstLine,
  formatLocation,
  timeCheck
} = require("../js/functions");
const fs = require("fs");

exports.showHomePage = (req, res, next) => {
  let processedFlight = {};
  processedFlight.renderOutput = "home";
  console.log(processedFlight);
  res.status(200).render("refresh", { processedFlight });
};

exports.showHomePageEs = (req, res, next) => {
  let processedFlight = {};
  processedFlight.renderOutput = "home";
  console.log(processedFlight);
  res.status(200).render("spanish", { processedFlight });
};

exports.showHomePageCn = (req, res, next) => {
  let processedFlight = {};
  processedFlight.renderOutput = "home";
  console.log(processedFlight);
  res.status(200).render("chinese", { processedFlight });
};

exports.convertItinerary = (req, res, next) => {
  let flightData = req.body.dataInput;
  let language = req.params.language;

  // console.log(req.cookies)
  // console.log(req.body);
  //set cookie for data input if set
  if (!flightData && !req.cookies.flightDataInput) {
    console.log("error, no input");
  } else if (!flightData) {
    flightData = req.cookies.flightDataInput;
  } else if (flightData) {
    res.cookie("flightDataInput", flightData);
  }
  //set cookie for result format

  let optionsObject = {};
  let resultsOption = req.body.resultformat;
  res.cookie("resultOption", resultsOption);

  // set cookies for view options

  console.log(req.body);


  let airlineNameOption = req.body.airlinename
  res.cookie("airlineName", airlineNameOption);
  optionsObject.airlineName = airlineNameOption;

  let logoOption = req.body.showLogo;
  res.cookie("showLogo", logoOption);
  optionsObject.showLogo = logoOption;

  let cabinOption = req.body.cabinradio;
  res.cookie("showCabin", cabinOption);
  optionsObject.showcabin = cabinOption;

  let durationOption = req.body.duration;
  res.cookie("duration", durationOption);
  optionsObject.duration = durationOption;

  res.cookie("distance", req.body.distanceradio);
  optionsObject.distance = req.body.distanceradio;

  res.cookie("timeFormat", req.body.timeformat);
  optionsObject.timeFormat = req.body.timeformat;

  res.cookie("quoteHeader", req.body.quoteheader);
  optionsObject.quoteHeader = req.body.quoteheader;

  let transitOption = req.body.transittime;
  res.cookie("transitTime", transitOption);
  optionsObject.transittime = transitOption;

  let operatedByOption = req.body.operatedby;
  res.cookie("operatedBy", operatedByOption);
  optionsObject.operatedby = operatedByOption;

  let toWrite = "";

  if (flightData) {
    toWrite = `
    -------${new Date()}--${req.ip}-----
    ${flightData}
    operatedby: ${operatedByOption}
    transitTime: ${req.body.transittime}
    quoteheader: ${req.body.quoteheader}
    12hours: ${req.body.timeformat}
    distance: ${req.body.distanceradio}
    duration: ${durationOption}
    cabin: ${cabinOption}
    logo: ${req.body.showLogo}
    airlineName: ${airlineNameOption}

    `;
  }



  let processedFlight = {};
  processedFlight.airlineNameOption = airlineNameOption;
  processedFlight.renderOutput = resultsOption;
  processedFlight.showImage = logoOption;
  processedFlight.operatedBy = operatedByOption;
  processedFlight.transit = transitOption;
  processedFlight.duration = durationOption;
  processedFlight.cabin = cabinOption;
  processedFlight.data = [];
  processedFlight.passengers = []


  fs.appendFile("flights-2018.txt", toWrite, "utf8", () => {});

  flightData = flightData.trim().toUpperCase().split("\r\n");

//name extraactor function
//\b[\d]{1}[\d]{4,}\/\D+\b|\b[\d]{1}\.[\w]{4,}\/\D+\b
//[\d]{1}\.\w+\/\w+



flightData.forEach(line => {
  if (/\b\d{1}\.\w{3,}\/\D+[\D]\b/.test(line)){
    // console.log(line);
    line = line.split(/[0-9]\.[0-9]|[0-9]\./).filter(line => line)
    line.forEach(line =>{
      processedFlight.passengers.push(line)
    })
  }
})
processedFlight.passengers = processedFlight.passengers.filter(name=>{
  return !/^\s/.test(name)
})
console.log(processedFlight.passengers)

  // preg_match_all('/\b[0-9]{1}[A-Z]{4,}\/\D+\b/', $b, $namematches);

  
  // if (preg_match('/\b[0-9]{1}[A-Z]{4,}\/\D+\b/', $b) && $namematchflag ==0){
  //   echo 'Itinerary For<br/><br/>';
  //   $namematchflag = 1;
  // }
  
  
  // foreach ($namematches [0] as $name){
  // $name = preg_replace('/[0-9]/',"",$name);
  // $name = str_replace('P-',"",$name);
  // echo $name.'<br/><br/>';	
  // }





  flightData = flightData.map(line => {
    line = line.substring(0,10).replace(/[\*#:]/," ")+line.substring(10);
    return line
      .replace(".", "")
      .trim()
      .replace(/^[0-9]+\s/, "")
      .trim()
      .replace(/\s{2,}/g, " ")
      .trim();
  });

  flightData = flightData.filter(line => {
    //this filters out invalid rows
    return (
      (line.length > 20 &&
        getbookingClass(line) !== undefined &&
        getDepartureDate(line) !== undefined) ||
      /OPERATED BY\s/.test(line)
    );
  });

  // console.log(flightData)

  flightData.forEach((line, index) => {
    if (/OPERATED BY\s/.test(line)) {
      if (/OPERATED BY\s/.test(flightData[index + 1])) {
        // console.log("detected....");
        flightData.splice(index + 1, 1);
      }

      flightData[index - 1] =
        flightData[index - 1] + " " + sentanceFormat(line);
      flightData.splice(index, 1);
    }
  });

  let departureDestination;
  let arrivalDestination;

  

  let newInfo = flightData.map((flightLine, index) => {
    return getAirlineName(flightLine, index);
  });

  let airportInfo = flightData.map((flightLine, index) => {
    departureDestination = getDepartureDestination(flightLine);
    arrivalDestination = getArrivalDestination(flightLine);
    return getAirportInfo(
      flightLine,
      index,
      departureDestination,
      arrivalDestination
    );
  });

  Promise.all(newInfo.concat(airportInfo))
    .then(result => {
      let airlineData = result.slice(0, result.length / 2);
      let airportData = result.slice(result.length / 2);

console.log(airportData)

      airlineData.forEach((flightLine, index) => {
        let bookingClass = getbookingClass(flightData[index]);
        let departureDate = getDepartureDate(flightData[index]);
        let departureTime = getDepartureTime(flightData[index]);
        let arrivalTime = getArrivalTime(flightData[index]);
        let arrivalDate = getArrivalDate(flightData[index]);
        let departureTimeZone = airportData[index][0].timezone;
        let arrivalTimeZone = airportData[index][1].timezone;
        let departureLongitude = airportData[index][0].longitude;
        let departureLatitude = airportData[index][0].latitude;
        let arrivalLongitude = airportData[index][1].longitude;
        let arrivalLatitude = airportData[index][1].latitude;
        let formattedArrTime = formatDate(
          arrivalDate,
          arrivalTime,
          flightData[index]
        );
        let formattedDepTime = formatDate(departureDate, departureTime, null);
        let airlineName = {
          name: flightLine.airline_name,
          class: flightLine.iatacode
        };
        let flightNo = getFlightNo(flightData[index]);
        let newFlightDuration = newGetFlightDuration(
          formattedDepTime,
          departureTimeZone,
          formattedArrTime,
          arrivalTimeZone
        );
        let classInfo = {
          class: bookingClass,
          cabin: flightLine[bookingClass.toLowerCase()]
        };
        let flightDistance = getFlightDistance(
          departureLongitude,
          departureLatitude,
          arrivalLongitude,
          arrivalLatitude
        );
        let operatedBy = getOperatedBy(flightData[index]);
        let departure = {
          airportName: airportData[index][0].airportname,
          iataCode: airportData[index][0].airportcode,
          country: airportData[index][0].countryname,
          city: airportData[index][0].cityname,
          longitude: departureLongitude,
          latitude: departureLatitude,
          timezone: departureTimeZone
        };

        let arrival = {
          airportName: airportData[index][1].airportname,
          iataCode: airportData[index][1].airportcode,
          country: airportData[index][1].countryname,
          city: airportData[index][1].cityname,
          longitude: arrivalLongitude,
          latitude: arrivalLatitude,
          timezone: arrivalTimeZone
        };

        processedFlight.data.push({
          formattedDistance: formatDistance(
            optionsObject.distance,
            flightDistance
          ),
          flightNo,
          airlineName,
          // iatacode: flightLine.iatacode,
          bookingClass,
          operatedBy,
          bookingCabin: flightLine[bookingClass.toLowerCase()],
          departureDate,
          departureTime,
          arrivalDate,
          arrivalTime,
          departure,
          arrival,
          flightDistance,

          transitTime: newGetTransitTime(
            formattedArrTime,
            formatDate(
              getDepartureDate(flightData[index + 1]),
              getDepartureTime(flightData[index + 1]),
              null
            )
            // getDepartureTime(flightData[index + 1]),
            // getDepartureDate(flightData[index + 1])
          ),
          newFlightDuration,
          formattedDepTime,
          formattedArrTime: checkLandingDay(formattedArrTime, formattedDepTime),
          lineOne: firstLine(
            optionsObject,
            formattedDepTime,
            airlineName,
            flightNo,
            newFlightDuration,
            classInfo,
            flightDistance,
            operatedBy
          ),
          formattedDepDest: formatLocation(departure),
          formattedArrDest: formatLocation(arrival),
          hourFormattedDepTime: timeCheck(optionsObject, formattedDepTime),
          hourFormattedArrTime: timeCheck(optionsObject, formattedArrTime)
        });


        // console.log(util.inspect(processedFlight, {showHidden: false, depth: null}))

        // console.log(processedFlight);
      });
      
      
      switch (language){
        case 'cn':
          res.status(200).render("chinese", { processedFlight });
          break;
        default:
          res.status(200).render("refresh", { processedFlight });
      }
      // let output = createOutput(processedFlight, resultsOption);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getApi = (req, res, next) => {
  // console.log(req.body.flightData)

  let flightData = req.body.flightData;

  flightData = flightData.trim().split("\n");

  flightData = flightData.map(line => {
    return line
      .trim()
      .replace(/^[0-9]+\s/, "")
      .trim()
      .replace(/\s{2,}/g, " ");
  });

  flightData = flightData.filter(line => {
    //this filters out invalid rows
    return (
      line.length > 20 &&
      getbookingClass(line) !== undefined &&
      getDepartureDate(line) !== undefined
    );
  });

  let departureDestination;
  let arrivalDestination;
  let flightOutput = [];

  let newInfo = flightData.map((flightLine, index) => {
    return getAirlineName(flightLine, index);
  });

  let airportInfo = flightData.map((flightLine, index) => {
    departureDestination = getDepartureDestination(flightLine);
    arrivalDestination = getArrivalDestination(flightLine);
    return getAirportInfo(
      flightLine,
      index,
      departureDestination,
      arrivalDestination
    );
  });

  Promise.all(newInfo.concat(airportInfo))
    .then(result => {
      let airlineData = result.slice(0, result.length / 2);
      let airportData = result.slice(result.length / 2);

      airlineData.forEach((flightLine, index) => {
        let bookingClass = getbookingClass(flightData[index]);
        let departureDate = getDepartureDate(flightData[index]);
        let departureTime = getDepartureTime(flightData[index]);
        let arrivalTime = getArrivalTime(flightData[index]);
        let arrivalDate = getArrivalDate(flightData[index]);
        let departureTimeZone = airportData[index][0].timezone;
        let arrivalTimeZone = airportData[index][1].timezone;
        let departureLongitude = airportData[index][0].longitude;
        let departureLatitude = airportData[index][0].latitude;
        let arrivalLongitude = airportData[index][1].longitude;
        let arrivalLatitude = airportData[index][1].latitude;
        let formattedArrTime = formatDate(
          arrivalDate,
          arrivalTime,
          flightData[index]
        );
        let formattedDepTime = formatDate(departureDate, departureTime, null);

        flightOutput.push({
          flightNo: getFlightNo(flightData[index]),
          airlineName: flightLine.airline_name,
          iatacode: flightLine.iatacode,
          bookingClass,
          operatedBy: null,
          bookingCabin: flightLine[bookingClass.toLowerCase()],

          departure: {
            airportName: airportData[index][0].airportname,
            iataCode: airportData[index][0].airportcode,
            country: airportData[index][0].countryname,
            city: airportData[index][0].cityname
            // timezone: departureTimeZone
          },
          arrival: {
            airportName: airportData[index][1].airportname,
            iataCode: airportData[index][1].airportcode,
            country: airportData[index][1].countryname,
            city: airportData[index][1].cityname

            // timezone: arrivalTimeZone
          },
          flightDistance: getFlightDistance(
            departureLongitude,
            departureLatitude,
            arrivalLongitude,
            arrivalLatitude
          ),

          transitTime: newGetTransitTime(
            formattedArrTime,
            getDepartureTime(
              flightData[index + 1],
              getDepartureDate(flightData[index + 1])
            )
          ),
          FlightDuration: newGetFlightDuration(
            formattedDepTime,
            departureTimeZone,
            formattedArrTime,
            arrivalTimeZone
          ),
          formattedDepTime,
          formattedArrTime: checkLandingDay(formattedArrTime, formattedDepTime)
        });
      });

      res.status(200).send({ flightOutput });
    })
    .catch(err => {
      console.log(err);
    });
};

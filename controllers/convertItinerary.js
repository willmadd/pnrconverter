//remember to uninstall momnentjs if not using
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
  createOutput,
  sentanceFormat,
  getOperatedBy,
  firstLine,
  formatLocation,
  timeCheck
} = require("../js/functions");

exports.showHomePage = (req, res, next) => {
  let processedFlight = {};
  processedFlight.renderOutput = "home";
  console.log(processedFlight);
  res.status(200).render("refresh", { processedFlight });
};

exports.convertItinerary = (req, res, next) => {
  let flightData = req.body.dataInput;

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

  res.cookie("airlineName", req.body.airlinename);
  optionsObject.airlineName = req.body.airlinename;

  let logoOption = req.body.showLogo;
  res.cookie("showLogo", logoOption);
  optionsObject.showLogo = logoOption;

  res.cookie("showCabin", req.body.cabinradio);
  optionsObject.showcabin = req.body.cabinradio;

  res.cookie("duration", req.body.duration);
  optionsObject.duration = req.body.duration;

  res.cookie("distance", req.body.distanceradio);
  optionsObject.distance = req.body.distanceradio;

  res.cookie("timeFormat", req.body.timeformat);
  optionsObject.timeFormat = req.body.timeformat;

  res.cookie("quoteHeader", req.body.quoteheader);
  optionsObject.quoteHeader = req.body.quoteheader;


  let transitOption = req.body.transittime
  res.cookie("transitTime", transitOption);
  optionsObject.transittime = transitOption;

  res.cookie("operatedBy", req.body.operatedby);
  optionsObject.operatedby = req.body.operatedby;

  flightData = flightData.trim().split("\n");

  flightData = flightData.map(line => {
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
      flightData[index - 1] =
        flightData[index - 1] + " " + sentanceFormat(line);
      flightData.splice(index, 1);
    }
  });
  // console.log(flightData)

  let departureDestination;
  let arrivalDestination;

  let processedFlight = {};
  processedFlight.renderOutput = resultsOption;
  processedFlight.showImage = logoOption;
processedFlight.transit = transitOption;

  // let processedFlight = {};

  processedFlight.data = [];

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
        console.log(processedFlight);
      });
      // let output = createOutput(processedFlight, resultsOption);
      res.status(200).render("refresh", { processedFlight });
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

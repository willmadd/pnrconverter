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
  newGetTransitTime
} = require("../js/functions");

exports.convertItinerary = (req, res, next) => {

  let flightData = req.body.dataInput;

// console.log(req.cookies)
console.log(req.body);
//set cookie for data input if set
  if (!flightData && !req.cookies.flightDataInput){
    console.log('error, no input')
  }else if (!flightData){
    flightData = req.cookies.flightDataInput;
  }else if(flightData){
    res.cookie('flightDataInput', flightData)
  }
//set cookie for result format
let resultsOption = req.body.resultformat;
res.cookie('resultOption', resultsOption);

// set cookies for view options
res.cookie('showName', req.body.airlinename);

res.cookie('showCabin', req.body.showcabin);

res.cookie('duration', req.body.duration);

res.cookie('distance', req.body.distance);

res.cookie('timeFormat', req.body.timeformat);

res.cookie('quoteHeader', req.body.quoteheader);

res.cookie('transitTime', req.body.transittime);



  // if (!flightData && !req.cookies.flightDataInput){
  //   console.log('error, no input')
  // }else if (!flightData){
  //   flightData = req.cookies.flightDataInput;
  // }else if(flightData){
  //   res.cookie('flightDataInput', flightData)
  // }

  


  flightData = flightData.trim().split("\n");

  flightData = flightData.map(line => {
    return line
    .replace(".","")
    .trim()
      .trim()
      .replace(/^[0-9]+\s/, "")
      .trim()
      .replace(/\s{2,}/g, " ")
      .trim();
  
  });

  flightData = flightData.filter(line => {
    //this filters out invalid rows
    return (line.length > 20) && (getbookingClass(line) !== undefined) && (getDepartureDate(line) !== undefined);
  });

  let departureDestination;
  let arrivalDestination;

  let processedFlight = [];

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
        let formattedArrTime = formatDate(arrivalDate, arrivalTime, flightData[index]);
        let formattedDepTime = formatDate(departureDate, departureTime, null);

        processedFlight.push({
          flightNo: getFlightNo(flightData[index]),
          airlineName: flightLine.airline_name,
          iatacode: flightLine.iatacode,
          bookingClass,
          operatedBy: null,
          bookingCabin: flightLine[bookingClass.toLowerCase()],
          departureDate,
          departureTime,
          arrivalDate,
          arrivalTime,
          departure: {
            airportName: airportData[index][0].airportname,
            iataCode: airportData[index][0].airportcode,
            country: airportData[index][0].countryname,
            city: airportData[index][0].cityname,
            longitude: departureLongitude,
            latitude: departureLatitude,
            timezone: departureTimeZone
          },
          arrival: {
            airportName: airportData[index][1].airportname,
            iataCode: airportData[index][1].airportcode,
            country: airportData[index][1].countryname,
            city: airportData[index][1].cityname,
            longitude: arrivalLongitude,
            latitude: arrivalLatitude,
            timezone: arrivalTimeZone
          },
          flightDistance: getFlightDistance(
            departureLongitude,
            departureLatitude,
            arrivalLongitude,
            arrivalLatitude
          ),

          transitTime: newGetTransitTime(formattedArrTime, getDepartureTime(flightData[index + 1], getDepartureDate(flightData[index+1]))),
          newFlightDuration: newGetFlightDuration(formattedDepTime, departureTimeZone, formattedArrTime, arrivalTimeZone),
          formattedDepTime,
          formattedArrTime: checkLandingDay(formattedArrTime, formattedDepTime)
        });
      });
      // console.log(processedFlight);
      // req.session.cookie.destroy
      // req.session.cookie.expires=false;
      res.status(200).render("converted", { processedFlight });
    })
    .catch(err => {
      console.log(err);
      processedFlight.push(null);
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
    return (line.length > 20) && (getbookingClass(line) !== undefined) && (getDepartureDate(line) !== undefined);
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
        let formattedArrTime = formatDate(arrivalDate, arrivalTime, flightData[index]);
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
            city: airportData[index][0].cityname,
            // timezone: departureTimeZone
          },
          arrival: {
            airportName: airportData[index][1].airportname,
            iataCode: airportData[index][1].airportcode,
            country: airportData[index][1].countryname,
            city: airportData[index][1].cityname,

            // timezone: arrivalTimeZone
          },
          flightDistance: getFlightDistance(
            departureLongitude,
            departureLatitude,
            arrivalLongitude,
            arrivalLatitude
          ),

          transitTime: newGetTransitTime(formattedArrTime, getDepartureTime(flightData[index + 1], getDepartureDate(flightData[index+1]))),
          FlightDuration: newGetFlightDuration(formattedDepTime, departureTimeZone, formattedArrTime, arrivalTimeZone),
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

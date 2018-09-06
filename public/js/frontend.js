
console.log(document.cookie);

let resultsOption = document.cookie.replace(/(?:(?:^|.*;\s*)resultOption\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(resultsOption==='threelinesreordered'){
    console.log('threelinesreordered')
document.getElementById('resultformat_3').checked=true;
}else if(resultsOption==='twolinesreordered'){
    console.log('twolinesreordered')
document.getElementById('resultformat_1').checked=true;
}else if(resultsOption==='tableoutput'){
    console.log('table')
document.getElementById('resultformat_4').checked=true;
}else if(resultsOption==='twolines'){
    console.log('twolines')
document.getElementById('resultformat_0').checked=true;
}else{
    console.log('default')
document.getElementById('resultformat_2').checked=true;
}



let airlineNameCookie = document.cookie.replace(/(?:(?:^|.*;\s*)airlineName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(airlineNameCookie === 'on'){
    document.getElementById('airlinenameInput').checked = true;
}

let showCabinCookie = document.cookie.replace(/(?:(?:^|.*;\s*)showCabin\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(showCabinCookie === 'on'){
    document.getElementById('showcabinInput').checked = true;
}

let showDurationCookie = document.cookie.replace(/(?:(?:^|.*;\s*)duration\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(showDurationCookie === 'on'){
    document.getElementById('durationInput').checked = true;
}

let showDistanceCookie = document.cookie.replace(/(?:(?:^|.*;\s*)distance\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(showDistanceCookie === 'on'){
    document.getElementById('distanceInput').checked = true;
}

let timeFormatCookie = document.cookie.replace(/(?:(?:^|.*;\s*)timeFormat\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(timeFormatCookie === 'on'){
    document.getElementById('timeformatInput').checked = true;
}

let quoteHeaderCookie = document.cookie.replace(/(?:(?:^|.*;\s*)quoteheader*\=\s*([^;]*).*$)|^.*$/, "$1");
if(quoteHeaderCookie === 'on'){
    document.getElementById('quoteheaderInput').checked = true;
}

// still need to add quot
let transitTimeCookie = document.cookie.replace(/(?:(?:^|.*;\s*)transitTime\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(transitTimeCookie === 'on'){
    document.getElementById('transittimeInput').checked = true;
}
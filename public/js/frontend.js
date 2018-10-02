
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


let airlineLogoCookie = document.cookie.replace(/(?:(?:^|.*;\s*)showLogo\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(airlineLogoCookie === 'on'){
    document.getElementById('showlogoInput').checked = true;
}

let showCabinCookie = document.cookie.replace(/(?:(?:^|.*;\s*)showCabin\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(showCabinCookie === 'off'){
    document.getElementById('cabinoff').checked = true;
}else if(showCabinCookie === 'cabin'){
    document.getElementById('cabincabin').checked = true;
}else{
    document.getElementById('cabinclass').checked = true;
}

let showDurationCookie = document.cookie.replace(/(?:(?:^|.*;\s*)duration\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(showDurationCookie === 'on'){
    document.getElementById('durationInput').checked = true;
}

let showDistanceCookie = document.cookie.replace(/(?:(?:^|.*;\s*)distance\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(showDistanceCookie === 'km'){
    document.getElementById('distancekm').checked = true;
}else if(showDistanceCookie === 'miles'){
    document.getElementById('distancemiles').checked = true;
}else{
    document.getElementById('distanceoff').checked = true;
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

let opertedByCookie = document.cookie.replace(/(?:(?:^|.*;\s*)operatedBy\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(opertedByCookie === 'on'){
    document.getElementById('operatedbyInput').checked = true;
}



// function selectText(containerid) {

// console.log(containerid);

//     if (document.selection) {

//         var range = document.body.createTextRange();

//         range.moveToElementText(document.getElementById(containerid));

//         range.select();

//     } else if (window.getSelection()) {

//         var range = document.createRange();

//         range.selectNode(document.getElementById(containerid));

//         window.getSelection().removeAllRanges();

//         window.getSelection().addRange(range);

//     }

// }


// function doMailTo(addr) {
//     console.log('dddd')
//     location.href = "mailto:"+addr+"?subject=some subject&body="+document.getElementById('selectable').innerText;
// }


// const copytarget = document.getElementById("selectable");
// copytarget.addEventListener("click", copyToClipboard);

// function copyToClipboard() {
//   var $temp = $("<textarea>");
//   var brRegex = /<br\s*[\/]?>/gi;
//   $("body").append($temp);
//   $temp.val($(copytarget).html().replace(/<\/?[a-zA-Z]+\/?>/g, '').trim()).select();
//   document.execCommand("copy");
//   $temp.remove();
// }


function imgError(image) {
    image.onerror = "";
    image.src = "./images/plane2.svg";
    return true;
}
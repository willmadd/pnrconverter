
let resultsOption = document.cookie.replace(/(?:(?:^|.*;\s*)resultOption\s*\=\s*([^;]*).*$)|^.*$/, "$1")
if(resultsOption==='threelinesreordered'){
document.getElementById('resultformat_3').checked=true;
}else if(resultsOption==='twolinereordered'){
document.getElementById('resultformat_1').checked=true;
}else if(resultsOption==='tableoutput'){
document.getElementById('resultformat_4').checked=true;
}else if(resultsOption==='twolines'){
document.getElementById('resultformat_0').checked=true;
}else{
document.getElementById('resultformat_2').checked=true;
}

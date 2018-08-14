

exports.convertItinerary = (req, res, next)=>{
console.log(req.body);
let data = req.body.dataInput.split('\r\n')
console.log(data);
}
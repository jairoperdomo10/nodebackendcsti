const { json } = require("body-parser");


 
exports.saludar = (req, res) => {
	console.info(req.params);
	res.json({"saludos":`Hola ${req.params.nombre||"Samuel"}`});
}
 

 
const { json } = require("body-parser");

const global_config = require("../config/settings.js");
const hanaClient = require("@sap/hana-client");
const connection = hanaClient.createConnection();
const connectionParams = global_config.connectionParams;
const { v4: uuidv4 } = require("uuid");

exports.saludar = (req, res) => {
  console.info(req.params);
  res.json({ saludos: `Hola ${req.params.nombre || "Jairo"}` });
};

exports.findAll = (req, res) => {
  connection.connect(connectionParams, (err) => {
    if (err) {
      return console.error("Connection error", err);
    }
    const sql = `SELECT * FROM PRODUCT`;
    connection.exec(sql, (err, rows) => {
      connection.disconnect();
      if (err) {
        return console.error("SQL execute error:", err);
      }
      console.log("Results:", rows);
      console.log(`Query '${sql}' returned ${rows.length}
	items`);
      res.json({ ProductCollection: rows });
    });
  });
};

exports.create = (req, res) => {
  console.info("------ Inicio Creacion---------");
  console.info(JSON.stringify(req.body));

  var id_producto = req.body.ProductId || uuidv4();

  connection.connect(connectionParams, (err) => {
    if (err) {
      return console.error("Connection error", err);
    }
    console.info("------Conexión Ok---------");

    // INICIO DE TRANSACCION A DB
    const sql = `INSERT INTO DEMO_DEV.PRODUCT (PRODUCTID, CATEGORY, MAINCATEGORY, TAXTARIFCODE, SUPPLIERNAME, WEIGHTMEASURE, WEIGHTUNIT, DESCRIPTION, NAME, DATEOFSALE, PRODUCTPICURL, STATUS, QUANTITY, UOM, CURRENCYCODE, PRICE, WIDTH, "DEPTH", HEIGHT, DIMUNIT)
		VALUES('${id_producto}', '${req.body.Category}', '${req.body.MainCategory}', '${req.body.TaxTarifCode}', '${req.body.SupplierName}', ${req.body.WeightMeasure}, '${req.body.WeightUnit}', '${req.body.Description}', '${req.body.Name}', '${req.body.DateOfSale}', '${req.body.ProductPicUrl}', '${req.body.Status}', ${req.body.Quantity}, '${req.body.UoM}', '${req.body.CurrencyCode}', ${req.body.Price}, ${req.body.Width}, ${req.body.Depth}, ${req.body.Height}, '${req.body.DimUnit}');`;
    connection.exec(sql, (err, rows) => {
      connection.disconnect();
      if (err) {
        if (err.code != -20004) {
          console.error("***ERRORES INSERCION Producto***");
          console.error(err);
          console.error("***ERRORES INSERCION Producto***");
          res.json({
            status: 500,
            transaction: "",
            mensaje: err,
          });
        }
      }

      console.info("------Transacción terminada---------");
      //console.log(`Query '${sql}' returned ${rows.length} items`);
      res.json({
        status: 200,
        transaction: id_producto,
        mensaje: "EL producto fué recibido satisfactoriamente",
      });
    });
  });
};

exports.delete = (req, res) => {
  console.info("------ Inicio Eliminación---------");
  console.info(JSON.stringify(req.body));
  var { id } = req.params;

  if (id) {
    connection.connect(connectionParams, (err) => {
      if (err) {
        return console.error("Connection error", err);
      }
      console.info("------Conexión Ok---------");

      // INICIO DE TRANSACCION A DB
      const sql = `DELETE FROM PRODUCT WHERE PRODUCTID = '${id}'`;
      connection.exec(sql, (err, rows) => {
        connection.disconnect();
        if (err) {
          if (err.code != -20004) {
            console.error("***ERRORES INSERCION Producto***");
            console.error(err);
            console.error("***ERRORES INSERCION Producto***");
            res.json({
              status: 500,
              transaction: "",
              mensaje: err,
            });
          }
        }

        console.info("------Transacción terminada---------");
        //console.log(`Query '${sql}' returned ${rows.length} items`);
        res.json({
          status: 200,
          transaction: id,
          mensaje: "EL producto fué eliminado satisfactoriamente",
        });
      });
    });
  } else {
    res.json({
      status: 500,
      mensaje: "Ingrese el Id del producto a Eliminar",
    });
  }
};

exports.update = (req, res) => {
  console.info("------ Inicio Actualización---------");
  console.info(JSON.stringify(req.body));
  var { id } = req.params;
  var {
    Category,
    MainCategory,
    TaxTarifCode,
    SupplierName,
    WeightMeasure,
    WeightUnit,
    Description,
    Name,
    DateOfSale,
    ProductPicUrl,
    Status,
    Quantity,
    UoM,
    CurrencyCode,
    Price,
    Width,
    Depth,
    Height,
    DimUnit,
  } = req.body;
  console.info(Category);
  if (id) {
    connection.connect(connectionParams, (err) => {
      if (err) {
        return console.error("Connection error", err);
      }
      console.info("------Conexión Ok---------");

      // INICIO DE TRANSACCION A DB
      const sql = `UPDATE PRODUCT SET CATEGORY ='${Category}', MAINCATEGORY='${MainCategory}', TAXTARIFCODE ='${TaxTarifCode}', SUPPLIERNAME = '${SupplierName}', WEIGHTMEASURE='${WeightMeasure}', WEIGHTUNIT = '${WeightUnit}', DESCRIPTION='${Description}', NAME = '${Name}', DATEOFSALE = '${DateOfSale}', PRODUCTPICURL = '${ProductPicUrl}', STATUS = '${Status}',QUANTITY = '${Quantity}', UOM = '${UoM}', CURRENCYCODE = '${CurrencyCode}', PRICE = '${Price}', WIDTH = '${Width}',DEPTH = ${Depth}, HEIGHT = '${Height}',  DIMUNIT = '${DimUnit}' WHERE PRODUCTID = '${id}'`;
      connection.exec(sql, (err, rows) => {
        connection.disconnect();
        if (err) {
          if (err.code != -20004) {
            console.error("***ERRORES ACTUALIZACION Producto***");
            console.error(err);
            console.error("***ERRORES ACTUALIZACION Producto***");
            res.json({
              status: 500,
              transaction: "",
              mensaje: err,
            });
          }
        }

        console.info("------Transacción terminada---------");
        //console.log(`Query '${sql}' returned ${rows.length} items`);
        res.json({
          status: 200,
          transaction: id,
          mensaje: "EL producto fué actualizado satisfactoriamente",
        });
      });
    });
  } else {
    res.json({
      status: 500,
      mensaje: "Ingrese el Id del producto a Actualizar",
    });
  }
};

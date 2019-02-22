const express = require('express');
const dbService = require('../dbaccess/database-conn');
const dbConfig = require('../config/dbconfig');
const router = new express.Router();

router.get('/', (req, res, next) => {
    res.send('Reached database api');
});

// Get all ingredients api
router.get('/ingredients', async(req, res, next) => {
    let items = await dbService.simpleExecute('SELECT * FROM INGREDIENTS_LIST');
    res.send(items.rows);
});

// Get particular ingredient api based on INGRE_ID: e.g INGRE_ID = MMCS-02
router.get('/ingredients/:id', async(req, res, next) => {
    let id = req.params.id;
    let selectQuery = 'SELECT * FROM INGREDIENTS_LIST  WHERE INGRE_ID = :id';
    let result = await dbService.simpleExecute(selectQuery, [id]);
    let response = {};
    if(result.rows.length > 0) {
        response = result.rows[0];
    }
    res.send(response);
});

// Get all locations 
router.get('/locations', async(req, res, next) => {
    let items = await dbService.simpleExecute('SELECT * FROM LOCATIONS');
    res.send(items.rows);
});

// Get all ondemand locations 
router.get('/on-demand-locations', async(req, res, next) => {
    let items = await dbService.simpleExecute('SELECT * FROM(select * from locations where ingre_id in (select ingre_id from MAMA_MARY_INVENTORY where isOnDemand= \'TRUE\')) x JOIN (select ingre_id, ingre_name from ingredients_list where ingre_id in (select ingre_id from MAMA_MARY_INVENTORY where isOnDemand= \'TRUE\')) y ON x.ingre_id = y.ingre_id');
    res.send(items.rows);
});

// Get one location based on id, e.g. id
router.get('/locations/:id', async(req, res, next) => {
    let id = req.params.id;
    let selectQuery = 'SELECT * FROM LOCATIONS WHERE id = :id';
    let result = await dbService.simpleExecute(selectQuery, [id]);
    let response = {};
    if(result.rows.length > 0) {
        response = result.rows[0];
    }
    res.send(response); 
});


// Get one model pizza 
router.get('/modelpizza/:id', async(req, res, next) => {
    let id = req.params.id;
    let query = `SELECT * FROM MODELPIZZA where pizza_id= :id`;
    let result = await dbService.simpleExecute(query, [id]);
    res.send(result.rows);
});

router.post('/modelpizza', async(req, res, next) => {
    let ingre_name = req.body.ingre_name;
    let origin = req.body.origin;
    let total_quantity = req.body.total_quantity;
    let total_calories = req.body.total_calories;
    let pizza_id = req.body.pizza_id;
    
    let insertQuery = `INSERT INTO MODELPIZZA (INGRE_NAME,ORIGIN,TOTAL_QUANTITY,TOTAL_CALORIES,PIZZA_ID) VALUES(:ingre_name, :origin, :total_quantity, :total_calories, :pizza_id)`;
    console.log(insertQuery);
    let insert = await dbService.simpleExecute(insertQuery,
        [ingre_name, origin, total_quantity, total_calories, pizza_id]);
    res.send(insert);
});
 
module.exports = router;
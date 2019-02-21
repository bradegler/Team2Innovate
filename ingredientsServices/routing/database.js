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



/*
router.put('/ingredients/:id', async(req, res, next) => {
    let id = req.params.id;
    let type = req.body.type;
    let name = req.body.name;
    let description = req.body.description;
    let price = req.body.price;
    let color = req.body.color;
    let itemsize = req.body.size;
    let rating = req.body.rating;
    console.log(`Type : ${type}, name : ${name}, description: ${description}, price: ${price}, color: ${color}, size: ${itemsize}, rating: ${rating},  id: ${id} `);
    let updateQuery = `UPDATE ROBOTICS.PRODUCTS SET TYPE = :type, NAME = :name, description = :description, price = :price, color = :color, item_size = :itemsize, rating = :rating WHERE ID = :id`
    console.log(updateQuery);
    let update = await dbService.simpleExecute(updateQuery,
        [type, name, description, price, color, itemsize, rating, id]);

    res.send(update);
});

router.post('/ingredients', async(req, res, next) => {
    let type = req.body.type;
    let name = req.body.name;
    let description = req.body.description;
    let price = req.body.price;
    let color = req.body.color;
    let itemsize = req.body.size;
    let rating = req.body.rating;
    let extension = req.body.extension;
    let productimage = req.body.productImage;
    let originalfilename = req.body.originalFileName;
    let insertQuery = `INSERT INTO ROBOTICS.PRODUCTS (type, name, description, price, color, item_size, rating, product_image, original_file_name) VALUES(:type, :name, :description, :price, :color, :itemsize, :rating, :productimage, :originalfilename)`;
    console.log(insertQuery);
    let insert = await dbService.simpleExecute(insertQuery,
        [type, name, description, price, color, itemsize, rating, `${productimage}.${extension}`, originalfilename]);
    let path = await storageService.findFile(productimage);
    console.log(path);
    let uploadResult = await storageService.uploadFile('TestBucket', productimage, path, extension);
    console.log(JSON.stringify(uploadResult));
    //res.send(insert);
    res.send(uploadResult);
    //res.send(`Path returned by storageService is: ${path} and uploadResult is: ${JSON.stringify(uploadResult)}`);
});

router.delete('/items/:id', async(req, res, next) => {
    let id = req.params.id;
    let deleteQuery = 'DELETE FROM ROBOTICS.PRODUCTS WHERE id = :id';
    console.log(deleteQuery);
    let deleteObj = await dbService.simpleExecute(deleteQuery, [id]);
    res.send(deleteObj);
});*/
 
module.exports = router;
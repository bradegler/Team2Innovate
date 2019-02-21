const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig.js');

const initialize = async() => {
    console.log(`Initializing pool`);
    const pool = await oracledb.createPool(dbConfig.systemPool);
    console.log(`Finished initializing pool`);
}

const close = async () => {
    await oracledb.getPool().close();
}


const simpleExecute = async(statement, binds = [], opts = {}) => {
    console.log(`Starting simple execute`);
    return new Promise(async(resolve, reject) => {
        let conn;

        opts.outFormat = oracledb.OBJECT;
        opts.autoCommit = true;

        try {
            conn = await oracledb.getConnection();
            console.log('obtained an connection, now time to execute');
            const result = await conn.execute(statement, binds, opts);

            resolve(result);
        } catch (err) {
            console.log(err);
            console.log('Error obtained in catch block trying to obtain a connection');
            reject(err);
        } finally {
            if (conn) {
                try {
                    await conn.close();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    });
}

module.exports.simpleExecute = simpleExecute;
module.exports.close = close;
module.exports.initialize = initialize;
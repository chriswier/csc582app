const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var oracledb = require('oracledb');

// async function to start everything up
async function init() {
  try {
    await oracledb.createPool({
      user          : 'hwappuser',
      password      : 'csc582',
      connectString : 'localhost/cwiering1.csc582.umflint.edu'
    });
    console.log('Oracle connection pool started.');

    // Startup Express server
    const app = express();
    app.use(cors());
    const router = express.Router();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use('/api', router);
    app.listen(4001, () => console.log(`LISTENING ON PORT 4001`));

    // Deal with appropriate routes, sending them to functions
    router.get('/inventory', (req, res) => {
      handleInventoryRequest(req,res);
    });

    router.get('/users', (req, res) => {
      handleUserRequest(req,res);
    });

    router.get('/usage', (req, res) => {
      handleUsageRequest(req,res);
    });

    router.post('/inventoryChange', (req, res) => {
      handlePostInventoryChangeRequest(req,res);
    });

  } 

  // handle initialization errors
  catch (err) {
    console.error('init() error: ' + err.message);
  }
}

//  Handle inventory request
async function handleInventoryRequest(request, response) {

  // initialize a default response
  let reply = {
    size: 0,
    inventory: [ ],
  }

  // inventory variable to store SQL results from inventory
  let inventory = [];

  // oracle lookup
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM INVENTORY`
    );

    // if I have rows (I should), loop through and populate the inventory var
    if(result.rows.length !== 0) {
       console.log(result.metaData);
       console.log(result.rows);
       inventory = rows; 
    }
  } catch(err) {
    console.error(err.message);
  } finally {
    if(connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }

  // update the reply
  reply['inventory'] = inventory;

  // return everything back
  response.json(reply);

}


// functions to close out successfully; bind to SIG_INT and SIG_TERM
async function closePoolAndExit() {
  console.log('\nTerminating');
  try {
    // Get the pool from the pool cache and close it when no
    // connections are in use, or force it closed after 10 seconds
    // If this hangs, you may need DISABLE_OOB=ON in a sqlnet.ora file
    await oracledb.getPool().close(10);
    console.log('Oracle Pool closed');
    process.exit(0);
  } catch(err) {
    console.error(err.message);
    process.exit(1);
  }
}

process
  .once('SIGTERM', closePoolAndExit)
  .once('SIGINT',  closePoolAndExit);

// main code - run the initialize function!
init();

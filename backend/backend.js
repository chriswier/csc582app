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
      handleUsersRequest(req,res);
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
  //console.log("inventory request");

  // inventory variable to store SQL results from inventory
  let inventory = [];

  // oracle lookup
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM INVENTORY`
    );

    // if I have rows (I should), use the rows from results to populate the inventory var
    if(result.rows.length !== 0) {
       //console.log(result.metaData);
       //console.log(result.rows);
       inventory = result.rows; 
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

  //console.log("Inventory:",inventory,"\n");

  // return everything back
  response.json(inventory);
}

//  Handle Usage request
async function handleUsageRequest(request, response) {

  // inventory variable to store SQL results from usage
  let usage = [];

  // oracle lookup
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM USAGE ORDER BY TIMELOG DESC OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY`
    );

    // if I have rows (I should), use the rows from results to populate the usage var
    if(result.rows.length !== 0) {
       usage = result.rows;
    }
    else {
       console.log("No usage rows!");
       console.log(result);
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

  // return everything back
  response.json(usage);
}

//  Handle inventory request
async function handleUsersRequest(request, response) {

  // inventory variable to store SQL results from usage
  let users = [];

  // oracle lookup
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM USERS`
    );

    // if I have rows (I should), use the rows from results to populate the usage var
    if(result.rows.length !== 0) {
       users = result.rows;
    }
    else {
       console.log("No users rows!");
       console.log(result);
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

  // return everything back
  response.json(users);
}

// the POST function handler
async function handlePostInventoryChangeRequest(request, response) {

  // make a default response
  let reply = { 
    message: " ",
    errorstate: 0,
  }

  // variables
  let userid = request.body.userid;
  let invid = request.body.invid;
  let quantity = request.body.quantity;
  //console.log("add stuff userid:",userid," invid:",invid," quantity:",quantity);

  // setup a try block to insert both SQL operations at once
  // if it fails, then rollback database
  // if it succeeds, then commit database
  let connection;
  connection = await oracledb.getConnection();
  try {
    const options = {
      autoCommit: false,
    }

    // first insert into usage
    const insresult = await connection.execute(
      `INSERT INTO USAGE VALUES ((SELECT MAX(USAGEID) FROM USAGE)+1,:userid,:invid,:quantity,CURRENT_TIMESTAMP)`,
      [userid,invid,quantity], options
    );
    //console.log("Rows inserted USAGE:",insresult.rowsAffected);

    // second, update inventory
    const updateresult = await connection.execute(
     `UPDATE INVENTORY SET QUANTITY = QUANTITY-:1 WHERE INVID=:2`,
      [quantity, invid], options
    );
    //console.log("Rows updated INVENTORY:",updateresult.rowsAffected);

    // commit it
    await connection.commit();
    reply.message = "Submitted change and committed to database!";
  } 

  // if there is an error, especially in the update inventory part, catch it and rollback the info
  catch(err) {
    console.error(err);
    reply.message = "SQL Error on Submit! Transaction rolled back. Error message is: " + err.message;
    reply.errorstate = 1;
    await connection.rollback();
  }

  // cleanup the DB connection
  finally {
    if(connection) {
      try { 
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }

  // return back
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

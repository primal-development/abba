//  server.js

const express = require("express");
const app = express();
const db = require("./db");
const bcrypt = require("bcryptjs");
app.use(express.json()); //middleware to read req.body.<params>
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

// Function that starts the server
async function startserver() {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

// Dev function
app.get("/api", async (req, res) => {
  let re = await db.querydb("SELECT * FROM Activity");
  res.send(re);
  console.log(re);
});

//CREATE USER
app.post("/createUser", async (req, res) => {
  // create hash of password
  console.log("Password: " + req.body.password);
  const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
  console.log("Password-hashed: " + hashedPassword);

  // check if there already exists an account with this email
  let sqlSearch = `SELECT * FROM Athlete WHERE email_address LIKE '${req.body.email_address}'`;

  console.log("User search: ");
  console.log(sqlSearch);

  await db.querydb(sqlSearch).then((result, err) => {
    if (err) throw err;
    if (result.length != 0) {
      // user already exists
      console.log("------> User already exists");
      res.sendStatus(409);
    } else {
      // Create new user
      let query = `INSERT INTO Athlete (athlete_name, athlete_lastname, email_address, pass_hash) VALUES ('${req.body.athlete_name}', '${req.body.athlete_lastname}', '${req.body.email_address}', '${hashedPassword}')`;
      db.querydb(query).then((result, err) => {
        if (err) throw err;
        console.log("-------> Created new User");
        console.log(result);
        res.sendStatus(201);
      });
    }
  });
}); //end of app.post()

//LOGIN (AUTHENTICATE USER)
app.post("/login", async (req, res) => {
  console.log("Email: " + req.body.email_address);
  console.log("Pass: " + req.body.password);

  // check if there already exists an account with this email
  let sqlSearch = `SELECT * FROM Athlete WHERE email_address LIKE '${req.body.email_address}'`;

  console.log("User search: ");
  console.log(sqlSearch);

  await db.querydb(sqlSearch).then(async (result, err) => {
    if (err) throw err;
    if (result.length == 0) {
      // user does not exist
      console.log("------> User doesn't exist");
      res.sendStatus(404);
    } else {
      //
      console.log(result[0].pass_hash);
      if (await bcrypt.compare(req.body.password, result[0].pass_hash)) {
        console.log("Right pass");
        res.send(`${req.body.email_address} is logged in!`);
      } else {
        console.log("Wrong pass");
        res.send(`Wrong pass`);
      }
    }
  });
}); //end of app.post()


function timeToDecimal(t) {
  var arr = t.split(':');
  var dec = parseInt((arr[1]/6)*10, 10);

  return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec);
} 

// create a new activity
app.post("/createActivity", async (req, res) => {
  let avg_velocity = req.body.distance / timeToDecimal(req.body.duration);
  console.log("Avg_velocity: " + avg_velocity);
  // avg_velocity = ""

  // enter query params
  let query = `
    INSERT INTO Activity (activity_name, activity_description, duration, start_time, athlete_id, distance, sport_id, elevation, avg_velocity, L1, L2, L3, L4, L5, core, arms, legs, agility, technique) 
    VALUES (
        '${req.body.activity_name}',
        NULLIF('${req.body.activity_description}', 'undefined'),
        '${req.body.duration}',
        '${req.body.date + " " + req.body.start_time}',
        '${req.body.athlete_id}',
        NULLIF('${req.body.distance}', 'undefined'),
        '${req.body.sport_id}',
        NULLIF('${req.body.elevation}', 'undefined'),
        NULLIF('${avg_velocity}', 'undefined'),
        NULLIF('${req.body.L1}', 'undefined'),
        NULLIF('${req.body.L2}', 'undefined'),
        NULLIF('${req.body.L3}', 'undefined'),
        NULLIF('${req.body.L4}', 'undefined'),
        NULLIF('${req.body.L5}', 'undefined'),
        NULLIF('${req.body.core}', 'undefined'),
        NULLIF('${req.body.arms}', 'undefined'),
        NULLIF('${req.body.legs}', 'undefined'),
        NULLIF('${req.body.agility}', 'undefined'),
        NULLIF('${req.body.techique}', 'undefined')
    )`;

  console.log(query);
    
  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    console.log(result);
    res.sendStatus(201);
  });
});

// update an activity
app.post("/updateActivity", async (req, res) => {
    let avg_velocity = req.body.distance / timeToDecimal(req.body.duration);
  console.log("Avg_velocity: " + avg_velocity);
  // avg_velocity = ""

  // enter query params
  let query = `
    INSERT INTO Activity (activity_name, activity_description, duration, start_time, athlete_id, distance, sport_id, elevation, avg_velocity, L1, L2, L3, L4, L5, core, arms, legs, agility, technique) 
    VALUES (
        '${req.body.activity_name}',
        NULLIF('${req.body.activity_description}', 'undefined'),
        '${req.body.duration}',
        '${req.body.date + " " + req.body.start_time}',
        '${req.body.athlete_id}',
        NULLIF('${req.body.distance}', 'undefined'),
        '${req.body.sport_id}',
        NULLIF('${req.body.elevation}', 'undefined'),
        NULLIF('${avg_velocity}', 'undefined'),
        NULLIF('${req.body.L1}', 'undefined'),
        NULLIF('${req.body.L2}', 'undefined'),
        NULLIF('${req.body.L3}', 'undefined'),
        NULLIF('${req.body.L4}', 'undefined'),
        NULLIF('${req.body.L5}', 'undefined'),
        NULLIF('${req.body.core}', 'undefined'),
        NULLIF('${req.body.arms}', 'undefined'),
        NULLIF('${req.body.legs}', 'undefined'),
        NULLIF('${req.body.agility}', 'undefined'),
        NULLIF('${req.body.techique}', 'undefined')
    )`;

  console.log(query);
    
  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    console.log(result);
    res.sendStatus(201);
  });
});

// delete an activity
app.post("/deleteActivity", async (req, res) => {
  res.send(
    await db.querydb("DELETE FROM Activity WHERE activity_id = ?", [
      req.body.activity_id,
    ])
  );
});

// get activity by id
app.post("/getActivityById", async (req, res) => {
  res.send(
    await db.querydb("SELECT * FROM Activity WHERE activity_id = ?", [
      req.body.activity_id,
    ])
  );
});

// get activity by athlete id
app.post("/getActivityByAthleteId", async (req, res) => {
  res.send(
    await db.querydb("SELECT * FROM Activity WHERE athlete_id = ?", [
      req.body.athlete_id,
    ])
  );
});

// get activities by athlete id and and date
app.post("/getActivityByAthleteIdAndDate", async (req, res) => {
  res.send(
    await db.querydb(
      "SELECT * FROM Activity WHERE athlete_id = ? AND start_time BETWEEN ? AND ?",
      [req.body.athlete_id, req.body.start_time, req.body.end_time]
    )
  );
});

module.exports = {
  startserver,
};

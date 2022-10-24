//  server.js

const express = require("express");
const app = express();
const db = require("./db");
const mail = require("./mail");
const cors = require("cors");
mail.start();
const bcrypt = require("bcryptjs");
let path = require("path");
const { captureRejectionSymbol } = require("events");
app.use(express.json()); //middleware to read req.body.<params>
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true,
  })
 );

const port = process.env.PORT || 3001;

// Function that starts the server
async function startserver() {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

function toJson(data) {
  return JSON.stringify(data, (_, v) =>
    typeof v === "bigint" ? `${v}n` : v
  ).replace(/"(-?\d+)n"/g, (_, a) => a);
}

// Dev function
app.get("/api", async (req, res) => {
  let re = await db.querydb("SELECT * FROM Athlete; SELECT * FROM Groups;");
  res.send(re);
  console.log(re.toString());
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
        res.send("Created new User");
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
        res.sendStatus(200);
      } else {
        console.log("Wrong pass");
        res.sendStatus(500);
      }
    }
  });
}); //end of app.post()

function timeToDecimal(t) {
  let arr = t.split(":");
  let dec = parseInt((arr[1] / 6) * 10, 10);

  return parseFloat(parseInt(arr[0], 10) + "." + (dec < 10 ? "0" : "") + dec);
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
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.sendStatus(201);
    }
  });
});

// get activity by id
app.post("/getActivityById", async (req, res) => {
  let query = `SELECT * FROM Activity WHERE activity_id=${req.body.activity_id}`;

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

// get activity by athlete id
app.post("/getActivityByAthleteId", async (req, res) => {
  let query = `SELECT * FROM Activity WHERE athlete_id=${req.body.athlete_id}`;

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

// get activities by athlete id and and date
app.post("/getActivityByAthleteIdAndDate", async (req, res) => {
  let query = `SELECT * FROM Activity WHERE athlete_id=${req.body.athlete_id} AND start_time BETWEEN '${req.body.start_time}' AND '${req.body.end_time}'`;

  console.log(query);
  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

// planned activity functions

// create a new activity
app.post("/createPlannedActivity", async (req, res) => {
  // enter query params
  let query = `
    INSERT INTO PlannedActivity (activity_name, activity_description, duration, activity_date, time_of_day, activity_img, sport_id, L1, L2, L3, L4, L5, core, arms, legs, agility, technique) 
    VALUES (
        '${req.body.activity_name}',
        NULLIF('${req.body.activity_description}', 'undefined'),
        '${req.body.duration}',
        '${req.body.activity_date}',
        '${req.body.time_of_day}',
        NULLIF('${req.body.activity_img}', 'undefined'),
        '${req.body.sport_id}',
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
    );`;

  console.log(query);

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result.insertId.toString());
      res.send(toJson(result));
    }
  });
});

// update an activity
app.post("/updateValue", async (req, res) => {
  // log field
  console.log("Field: " + req.body.field);
  console.log("Value: " + req.body.value);
  console.log("Type: " + req.body.type);
  console.log("id_value: " + req.body.id_value);

  // enter query params
  let query = `UPDATE ${req.body.table} SET ${req.body.field} = '${req.body.value}' WHERE ${req.body.id_type} = ${req.body.id_value}`;

  console.log(query);

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.sendStatus(201);
    }
  });
});

app.post("/updateDist", async (req, res) => {
  console.log("Distance: " + req.body.distance);
  console.log("Duration: " + req.body.duration);

  let avg_velocity = req.body.distance / timeToDecimal(req.body.duration);
  console.log("Avg_velocity: " + avg_velocity);

  // enter query params
  let query = `UPDATE Activity SET distance = '${req.body.distance}', duration = '${req.body.duration}', avg_velocity = '${avg_velocity}' WHERE activity_id = ${req.body.activity_id}`;

  console.log(query);

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.sendStatus(201);
    }
  });
});

// delete an activity
app.post("/deleteRow", async (req, res) => {
  // delete an activity
  let query = `DELETE FROM ${req.body.table} WHERE ${req.body.id_type}=${req.body.id}`;

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (result.affectedRows == 0) {
      res.send("Nothing deleted");
    } else {
      console.log(result);
      res.send("Deleted successfully");
    }
  });
});

// get activity by id
app.post("/getPlannedActivityById", async (req, res) => {
  let query = `SELECT * FROM PlannedActivity WHERE activity_id=${req.body.activity_id}`;

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/sendRegistrationMail", async (req, res) => {
  let response = await mail.sendRegistrationMail(req.body.recipient);
  console.log(response);
  res.send(response.toString());
  // res.sendStatus(200);
});

app.post("/sendResetPasswordMail", async (req, res) => {
  let response = await mail.sendPassResetMail(req.body.recipient);
  console.log(response);
  res.send(response.toString());
  // res.sendStatus(200);
});

app.post("/createGroup", async (req, res) => {
  let query = `INSERT INTO Groups (group_name, trainer_id) VALUES ('${req.body.group_name}', ${req.body.trainer_id})`;

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.send(toJson(result));
    }
  });
});

app.post("/mailAddToGroup", async (req, res) => {
  console.log(req.body.group_members);
  req.body.group_members.forEach((group_member) => {
    console.log(group_member);
    mail.sendAcceptGroupMail(
      group_member.email_address,
      group_member.trainer_name,
      group_member.group_name,
      group_member.group_id,
      group_member.athlete_id
    );
  });
});

app.get("/addToGroup/:group_id/:athlete_id/", async (req, res) => {
  console.log("Hiellou");
  console.log("Group Id: " + req.params.group_id);
  console.log("Athlete Id: " + req.params.athlete_id);
  let options = {
    root: path.join(__dirname),
  };
  res.sendFile("/src/acceptGroup.html", options);
  let query = `INSERT INTO group_athlete (group_id, athlete_id) VALUES (${req.params.group_id}, ${req.params.athlete_id})`;

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result);
      // res.send(toJson(result));
    }
  });
});

app.post("/removeFromGroup", async (req, res) => {
  let query = "";

  console.log(req.body.group_members);
  req.body.group_members.forEach((group_member) => {
    query += `DELETE FROM group_athlete WHERE athlete_id = ${group_member.athlete_id} AND group_id = ${group_member.group_id};`;
  });

  // let query = `DELETE FROM group_athlete WHERE athlete_id = ${req.body.athlete_id} AND group_id = ${req.body.group_id}`;

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.send(toJson(result));
    }
  });
});

app.post("/assignPlannedActivity", async (req, res) => {
  // An activity has been assigned to a grou of athletes

  console.log(req.body.group);

  // check if the req object is an array or not
  //       array --> a list of users
  //       string --> a specific group to which it gets assigned

  if (Array.isArray(req.body.group)) {
    // req is an array
    console.log("Array");

    let query1 = "";
    console.log("Array of athletes of group:");
    console.log(req.body.group);
    req.body.group.forEach((athlete_id) => {
      console.log(athlete_id);
      query1 += `INSERT INTO athlete_plannedActivity (athlete_id, activity_id) VALUES (${athlete_id}, ${req.body.activity_id});`;
    });
    console.log(query1);

    await db.querydb(query1).then(async (result, err) => {
      if (err) throw err;
      if (!result) {
        res.sendStatus(500);
      } else {
        console.log(result);
        res.send(toJson(result));
      }
    });
  } else {
    // req is a string
    console.log("Group_Id: " + req.body.group);

    let query = `SELECT * FROM group_athlete WHERE group_id = ${req.body.group}`;

    await db.querydb(query).then(async (result, err) => {
      if (err) throw err;
      if (!result) {
        res.sendStatus(500);
      } else {
        let query1 = "";
        console.log("Array of athletes of group:");
        console.log(result);
        result.forEach((athlete) => {
          console.log(athlete);
          query1 += `INSERT INTO athlete_plannedActivity (athlete_id, activity_id) VALUES (${athlete.athlete_id}, ${req.body.activity_id});`;
        });
        console.log(query1);

        await db.querydb(query1).then(async (result, err) => {
          if (err) throw err;
          if (!result) {
            res.sendStatus(500);
          } else {
            console.log(result);
            res.send(toJson(result));
          }
        });
      }
    });
  }
});

// get activity by athlete id
app.post("/getPlannedActivityByAthleteId", async (req, res) => {

  let query = `
    SELECT * 
    FROM athlete_plannedActivity
    JOIN PlannedActivity using(activity_id)
    WHERE athlete_id=${req.body.athlete_id}`;

  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    }else{
      console.log(result);
      res.send(toJson(result));
    }
  });
});

// get activities by athlete id and and date
app.post("/getPlannedActivityByAthleteIdAndDate", async (req, res) => {

  let query = `
    SELECT * 
    FROM athlete_plannedActivity
    JOIN PlannedActivity using(activity_id)
    WHERE athlete_id=${req.body.athlete_id} AND activity_date BETWEEN '${req.body.start_date}' AND '${req.body.end_date}'`;

  console.log(query);
  await db.querydb(query).then(async (result, err) => {
    if (err) throw err;
    if (!result) {
      res.sendStatus(500);
    }else{
      console.log(result);
      res.send(toJson(result));
    }
  });
});

module.exports = {
  startserver,
};

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const mysql = require('mysql')
const dotenv = require('dotenv').config()

const db = mysql.createPool({ // createConnection
    host: 'localhost',
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DATABASE,
    port: process.env.DBPORT
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

// READ
app.get("/api/read", (req, res) => {
    const sqlSelect = "select first_name, last_name, email_address, team from volunteers;"
    db.query(sqlSelect, (err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    })
})

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  
app.get("/api/readTickets", (req, res) => {
    const sqlSelect = "select ticketCode, is_issued, issued_on, issued_to from tickets;"
    db.query(sqlSelect, (err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    })
})
  


// CREATE
app.post("/api/create", (req, res) => {
   
    const ea = req.body.email

    if (validateEmail(ea)) {
        const fn = req.body.first
        const ln = req.body.last
        const t = req.body.team
        
        const sqlInsert = "INSERT INTO volunteers (first_name, last_name, email_address, team) VALUES (?,?,?,?);"
        db.query(sqlInsert, [fn, ln, ea, t], (err, result) => {
            if (err) throw err
            console.log("Server posted: ", fn, ln, t)
            res.send(result)
        })
    }
    else{
        res.send("no valid email")

        throw 'No valid email';
    }

})
app.post("/api/createTickets", (req, res) => {

  const tc = req.body.tCode
  
  if (tc.length == 9) {
    const sqlInsert = "INSERT INTO tickets (ticketCode) VALUES (?) on duplicate key update ticketCode=ticketCode;"
    if(db.query(sqlInsert, [tc], (err, result) => {
      if (err) throw err
      console.log("Server posted: ", tc)
      res.send(result)
    })) {}
    else
    {
    res.send("Invalid ticket code")
    throw 'Invalid ticket';
    }
  }
  else{
    res.send("Invalid ticket code")
    throw 'Invalid ticket';
  }
})

// DELETE
app.delete("/api/delete/:emailAddress", (req, res) => {
    const ea = req.params.emailAddress;
    console.log(ea)
    const sqlDelete = "DELETE FROM volunteers WHERE email_address = ?";
    db.query(sqlDelete, [ea], (err, result) => {
        if (err) throw err
        console.log("Server: deleted: ", ea)
        res.send(result)
    })
})

// UPDATE
app.put("/api/update", (req, res) => {
    // console.log(req)

    const ne = req.body.new;
    const oe = req.body.old;
    console.log("Ready to change: ", oe, "to", ne)
    const sqlUpdate = "UPDATE volunteers SET email_address = ? WHERE email_address = ?"
    db.query(sqlUpdate, [ne, oe], (err, result) => {
        if (err) throw err;
        console.log("Server changed: ", oe, "to", ne)
        res.send(result)
    })
})

const PORT = process.env.EXPRESSPORT;
const msg = `Running on PORT ${PORT}`
app.get("/", (req, res) => {
    res.send(`<h1>Express Server</h1><p>${msg}<p>`)
})
app.listen(PORT, () => {
    console.log(msg)
})


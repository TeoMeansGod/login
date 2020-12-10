var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
var path = require("path")
var bodyParser = require("body-parser")
var users = []
var loggedIn = false
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("static"))

app.get("/main", function(req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})
app.get("/register", function(req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/register.html"))
})
app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/login.html"))
})
app.get("/logOut", function(req, res) {
    loggedIn = false
    res.redirect("/main")
})
app.get("/admin", function(req, res) {
    if (loggedIn) {
        res.sendFile(path.join(__dirname + "/static/pages/admin_logIn.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/pages/admin_logOut.html"))
    }
})
app.get("/show", function(req, res) {
    if (loggedIn) {
        table = ""
        for (item of users) {
            if (item.student == "yes") {
                table += "<tr><td>id: " + item.id + "</td><td>user: " + item.login + " - " + item.password + "</td><td>Uczeń: <input type=\"checkbox\" checked disabled></td><td>Płeć: " + item.gender + "</td><td>" + item.age + "</td></tr>"
            } else {
                table += "<tr><td>id: " + item.id + "</td><td>user: " + item.login + " - " + item.password + "</td><td>Uczeń: <input type=\"checkbox\" disabled></td><td>Płeć: " + item.gender + "</td><td>" + item.age + "</td></tr>"
            }
        }
        res.send("<html><head><style>body{font-family: 'Roboto Mono', monospace; color:white; background-color: black;} a{color: white; margin: 5px;}table{margin-top:10px;}tr,td{padding: 5px; color: white; border: 1px solid yellow;}</style></head><body><a href=\"/sort\">sort</a><a href=\"/gender\">gender</a><a href=\"/show\">show</a><table>" + table + "</table></body></html>")
    } else {
        res.send("Chciałoby się")
    }
})
app.get("/sort", function(req, res) {
    if (loggedIn) {
        var table = ""
        for (item of users) {
            table += "<tr><td>id: " + item.id + "</td><td>user: " + item.login + " - " + item.password + "</td><td>" + item.age + "</td></tr>"
        }
        res.send("<html><head><style>body{font-family: 'Roboto Mono', monospace; color:white; background-color: black;} a{color: white; margin: 5px;}table{margin-top:10px;}tr,td{padding: 5px; color: white; border: 1px solid yellow;}</style></head><body><a href=\"/sort\">sort</a><a href=\"/gender\">gender</a><a href=\"/show\">show</a><form onchange=\"this.submit()\" method=\"POST\"><label for=\"up\">Rosnąco</label><input type=\"radio\" name=\"sort\" id=\"up\" value=\"up\"><label for=\"up\">Malejąco</label><input type=\"radio\" name=\"sortOption\" id=\"down\" value=\"down\"></form><table>" + table + "</table></body></html>")
    } else {
        res.send("Chiałoby się")
    }
})

app.post("/sort", function(req, res) {
    let value = req.body.sort
    var table = ""
    if (value == "up") {
        console.log(users)
        users.sort(function(a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        });
        console.log(users)
        for (item of users) {
            table += "<tr><td>id: " + item.id + "</td><td>user: " + item.login + " - " + item.password + "</td><td>" + item.age + "</td></tr>"

        }
        console.log("nom")
    } else {
        console.log(users)
        users.sort(function(a, b) {
            return parseFloat(b.age) - parseFloat(a.age);
        });
        console.log(users)
        for (item of users) {
            table += "<tr><td>id: " + item.id + "</td><td>user: " + item.login + " - " + item.password + "</td><td>" + item.age + "</td></tr>"
        }
        console.log("idk")
    }
    res.send("<html><head><style>body{font-family: 'Roboto Mono', monospace; color:white; background-color: black;} a{color: white; margin: 5px;}table{margin-top:10px;}tr,td{padding: 5px; color: white; border: 1px solid yellow;}</style></head><body><a href=\"/sort\">sort</a><a href=\"/gender\">gender</a><a href=\"/show\">show</a><form onchange=\"this.submit()\" method=\"POST\"><label for=\"up\">Rosnąco</label><input type=\"radio\" name=\"sort\" id=\"up\" value=\"up\"><label for=\"up\">Malejąco</label><input type=\"radio\" name=\"sortOption\" id=\"down\" value=\"down\"></form><table>" + table + "</table></body></html>")
})
app.get("/gender", function(req, res) {
    if (loggedIn) {
        var table1 = ""
        var table2 = ""
        for (item of users) {
            if (item.gender == "female") {
                table1 += "<tr><td>id: " + item.id + "</td><td>gender: " + item.gender + "</td></tr>"
            } else {
                table2 += "<tr><td>id: " + item.id + "</td><td>gender: " + item.gender + "</td></tr>"
            }
        }
    } else {
        res.send("Chciałoby się")
    }
    res.send("<html><head><style>body{font-family: 'Roboto Mono', monospace; color:white; background-color: black;} a{color: white; margin: 5px;}table{margin-top:10px;}tr,td{padding: 5px; color: white; border: 1px solid yellow;}</style></head><body><a href=\"/sort\">sort</a><a href=\"/gender\">gender</a><a href=\"/show\">show</a><table>" + table1 + "</table><table>" + table2 + "</table></body></html>")
})

function checking(login) {
    for (item of users) {
        if (item.login == login) {
            return false
        }
    }
    return true
}

function checkingPassword(login, password) {
    for (item of users) {
        if (item.login == login && item.password == password) {
            return true
        }
    }
    return false
}
app.post("/register", function(req, res) {
    let form = req.body
    let login = req.body.login
    if (checking(login)) {
        users.push(form)
        for (i = 0; i < users.length; i++) {
            users[i].id = i + 1
        }
        res.send("witaj " + login + " zostałeś zarejestrowany")
    } else {
        res.send("podany login już istnieje")
    }
})
app.post("/login", function(req, res) {
    let login = req.body.login
    let password = req.body.password
    if (checkingPassword(login, password)) {
        loggedIn = true
        res.redirect("/admin")
    } else {
        res.send("błędne dane")
    }
})
app.listen(PORT, function() {
    console.log("start serwera na porcie " + PORT)
})

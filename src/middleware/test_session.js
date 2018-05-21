const express = require('express');
const app = express();
const session = require('express-session');

// Use the session middleware
app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}))

// Access the session as req.session
app.get('/', function (req, res, next) {

    console.log('session outside: ',req.session);

    if (req.session.views) {
        console.log('session inside if :',req.session.views);
        req.session.views++
        req.session.v = req.session.v +2 ;
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + req.session.views + '</p>')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.end()
    } else {
        console.log('session inside else :',req.session.secret);
        req.session.views = 1
        req.session.v =2;
        res.end('welcome to the session demo. refresh!')
    }
})

app.listen(3002);
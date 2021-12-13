const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const session = require('express-session')
const mongoose = require('mongoose')

app.use(session({
    secret: 'hsjfghu2386278edhsjbsghjdfgsdhjfg823yugfjhsdgf',
    resave: false
}))

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/LeaveManagementSystem')
.then(() => console.log('Mongoose up'))

const User = require('./models/users')
const Leave = require('./models/leaves')

app.use(bodyParser.json())

app.post('/api/login', async (req, res) => {
    const {email, password} = req.body
    // console.log(email, password)
    const resp = await User.findOne({email, password})
    if (!resp) {
        // console.log("Incorrect details")
        res.json({
            success: false,
            message: "Incorrect details"
        })
    } else {
        // make a session and set user to logged in
        res.json({
            success: true
        })
        req.session.user = email
        req.session.save()
        // console.log("Logging you in")
    }
})

app.get('/api/isloggedin', (req, res) => {
    res.json({
        status: !!req.session.user
    })
})

app.post('/api/register', async (req, res) => {
    const {rollno, name, email, password, mobile, course} = req.body

    const existingUser = await User.findOne({email})
    // console.log(existingUser, email, password)

    if(existingUser) {
        res.json({
            success: false,
            message: "Email already in use"
        })
        return
    }

    const user = new User({
        rollno,
        name,
        email,
        password,
        mobile,
        course
    })

    const result = await user.save()
    // console.log(result)
    res.json({
        success: true,
        message: "Welcome!"
    })
    
})

app.post('/api/applyLeave', async (req, res) => {
    const {email, date, reason} = req.body

    const leave = new Leave({
        email,
        date,
        reason
    })

    const result = await leave.save()
    // console.log(result)
    res.json({
        success: true,
        message: "Stored"
    })
    
})

app.post('/api/leaveValidate', async (req, res) => {
    const {email, date, reason, status} = req.body
    // console.log(email, password)
    const resp = await Leave.findOne({email, date, reason})
    // console.log(resp)
    if (!resp) {
        // console.log("Incorrect details")
        res.json({
            success: false
        })
    } else {
        resp.approved = status
        // console.log(resp)
        
        const result = await resp.save()
        res.json({
            success: true
        })
    }
})

app.get('/api/data', async (req, res) => {

    const user = await User.findOne({email: req.session.user})

    if(!user) {
        res.json({
            status: false,
            message: 'User was deleted'
        })
        return
    }

    res.json({
        status: true,
        rollno: user.rollno,
        name: user.name,
        email: req.session.user,
        mobile: user.mobile,
        course: user.course
    })
})

app.get('/api/leaveData', async (req, res) => {
    
    const leave = await Leave.find().sort({"approved": -1, "email": 1, "date": 1})

    res.json({
        leave
    })
})

app.get('/api/yourLeaveData', async (req, res) => {
    
    const leave = await Leave.find({email: req.session.user}).sort({"approved": -1, "date": 1})

    res.json({
        leave
    })
})

app.get('/api/logout', (req, res) => {
    req.session.destroy()
    res.json({
        success: true
    })
})

app.listen(1234, () => console.log('Server listening at 1234'))

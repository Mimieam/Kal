'use strict'
/*
token = device token
 */
var mongoose = require('mongoose');
var moment = require('moment');
var config = {};
var mongoConnectionString = process.env.MONGOLAB_URI || "mongodb://127.0.0.1/KalReminder";

/*------------ models ---------- */

var UserModel = {
  name: String,
  token: {type: String, required: true, unique:true},
  deviceType: String,
  phoneNumber: { type: String, required: false, default: ""},
  ts_created: { type: Date, required: true, default: Date() },
  ts_updated: { type: Date, required: true, default: Date() }  // last time the user sent a schedule
}

var ActivityModel = {
  token: String,
  description: String,
  dueDate: Date,
  timezone: Number,
  startTime: Date,  // refers to bracket of time within which it is acceptable to run a task. default it null ( for anytime)
  endTime: Date,
  timestamp: Date, // the last this activity was executed
  status: Number,  // 0 = incomplete, 1 = completed
  recurrent: Boolean,
  scheduleId: {type: String, required: true, default: ""},
  notificationNumber: Number // this activity number within a schedule.
}

var ScheduleModel = {
  token: String,
  total: Number,
}

var Users     = mongoose.model('Users', UserModel);
var Activity = mongoose.model('Activity', ActivityModel); // an Activity is anything that we need to do, schedule , reminder, task, job
/*- -*/


function createNewActivity(meta, act){
  return Activity({
    token:meta.devToken,
    deviceType: meta.devType,
    description: act.task,
    scheduleId: meta.scheduleId,
    dueDate: moment(act.time, "HH:mm").utc().toDate(),
    timezone: new Date().getTimezoneOffset(),
    startTime: moment(meta.startDate[0], meta.startDate[1]),  // date and format
    endTime: moment(meta.endDate[0], meta.endDate[1]),
    timestamp: moment(),
    status: 0,
    recurrent: false
    })
}

function createOrUpdateDevice(newUser) {
  Users.findOne({token: newUser.token}, function (err, user) {
    console.error(String(err)) // ValidationError: enum validator failed for path `state` with value `invalid`
    console.log(user)
    if(user) { // user exist -> update
      console.log("User found {"+newUser.token+"}")
      user.ts_updated = new Date()
      user.save(function(){console.log("Update Succeeded for Token: " + newUser.token)}) // success
    } else {  // user non existant, create new one
      console.log("User non existant")
      var _newUser = new Users(newUser);
      _newUser.save(function(){console.log("Save new user Token: " + _newUser.token)})
    }
  })
}

function saveActivities (newActivity) {
  Activity.findOne({token: newActivity.token, description: newActivity.description, dueDate: {$gte: new Date( newActivity.dueDate.toDateString() ) }}, function (err, activity) {
    if (err) {
      console.log("saveActivities - ", err)
    }
    if(activity) { // activity exist -> update
      console.log("Activity found {"+activity.description+"}")
      activity.dueDate = newActivity.dueDate
      activity.timestamp = newActivity.timestamp
      activity.save(function(){console.log("Update Activity Succeeded: " + newActivity.token)}) // success
    } else {  // user non existant, create new one
      console.log("Activity non existant")
      newActivity.save(function(err){console.log("Saved new Activity For Token: "+ err + newActivity.token)})
    }
  })
}


function fetchActivities(_status, cb) {
  return Activity.find({status: _status}, cb)
  //  Activity.find({status: _status}, function (err, activities) {
  //   console.error(String(err)) // ValidationError: enum validator failed for path `state` with value `invalid`
  //   console.log("act" ,activities)
  //   if(activities.length > 0 ) { // activity exist -> update
  //     console.log("activity found {"+activities+"}")


  //   } else {  // activity non existant, create new one
  //     console.log("activity non existant")
  //     newactivity2.save(function(){console.log("Save new activity Token: " + token)})

  //   }
  // })

}

// createOrUpdateDevice(testUser)
// saveActivities(newActivity)
// fetchActivities(0)

/* next version will use a heap*/
var pendingJobs = []
function sortByDueDate (actA, actB) {
  return actA.dueDate - actB.dueDate;
}

/*----------End models -------- */

var db = mongoose.connect( mongoConnectionString , function(err, res) {
  if (err) {
    console.log(err)
    // console.log.bind(console, 'mongoose connection error: ');
  } else {
    console.log('Succeeded connecting to DB');
  }
});

// setInterval(function(){
//   // get all the users
//   Users.find({}, function(err, users) {
//     if (err) throw err;

//     // object of all the users
//     console.log(users);
//   });
// }, 30000);
function rescheduleActivity (err, arr) {
  var curDate = moment()
  console.log("Cur Date: ", curDate.format())

  var act = null

  arr.sort(sortByDueDate)

  for(var idx in arr) {

    act = arr[idx]
    if (moment(act.dueDate) < curDate ) { // timezone not handled
      console.log("Due Date: ", moment(act.dueDate).add(1,"d").format())
      if (act.recurrent){
        act.dueDate = moment(act.dueDate).add(1,"d")
        act.save(function () {
          console.log("Due Date updated ")
        })
      }
    } else {
      break // don't go thru the whole list
    }
  }
  return arr
}
// setInterval(function(){
  // get all the users
  // Activity.find({}, function(err, activities) {
  //   if (err) throw err;

  //   // for (var idx in activities) {
  //   //   console.log(activities[idx])
  //   // }

  //   // object of all the activity
  //   console.log(activities);
  // });
  //
  // fetchActivities(0, activityHandler)
  // console.log(activitiesCursor)


module.exports = {
  createNewActivity: createNewActivity,
  createOrUpdateDevice: createOrUpdateDevice,
  saveActivities: saveActivities,
  fetchActivities: fetchActivities,
  rescheduleActivity: rescheduleActivity,
}
// }, 2000);

// query to add token to db
// query to add Activity to db
// query to get Activity from db
// query to continusly pull data from db and append to pendingList sorted by due date ajusted by their timezone


var IOSNotifier = require("./KalineServer")
var Reminder = require("reminder")
var moment = require("moment")
var database = require("./KalSheduler")


var Kal = {}
Kal.pending = []
Kal.db = database
Kal.schedule = new Reminder();
Kal.IOSNotifier = IOSNotifier;
Kal.IOSNotifier.init()


Kal.send = sendNotification

Kal.init = function init () {}

/* check every 30 seconds if we have a new notification and schedules it*/
Kal.checkPending = function checkPending() {
  if (Kal.pending.length){
    notif = Kal.pending[0];
    Kal.schedule.at(notif.dueDate, function(res) {sendNotification(notif)})
  }
}

/* test function */
Kal.getNotification = function getNotification () {
  var notif = {
    id:"007",
    devToken:'f780692d61453893b756d13eb5324921f40ba270f0434a6f9a265ac736dd6b08',
    description: "Eat something",
    dueDate: moment().add(1,"m").format("HH:mm"),
    timezone: 0,
  }
  Kal.pending.push(notif)
}

function sendNotification (notif) {
  var msgObj = {
    token: notif.devToken,
    message: notif.description,
    from: 'Kal',
  }
  Kal.IOSNotifier.send(msgObj)
  msgObj.ts = new Date()
  console.log(msgObj)
}

function getRandomNumberInInterval (min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getStartAndEndDateTime (startingHour, endingHour) {

  if (!startingHour) { startingHour = 8}
  if (!endingHour) { endingHour = 23}

  var startDate = moment().clone().startOf('day').hour(startingHour).minute(0);
  var endDate   = moment().clone().startOf('day').hour(endingHour).minute(0);

  console.log(startDate.format("hh:mm a"), endDate.format("hh:mm a"))
  return [startDate, endDate]
}

Kal.getNotification()

// Kal.checkPending()

/* a daily scandule send from a user device */
function userDailySchedule () {
  return {
    metaData: {
      type: 1,
      name: "Meals Schedule",
      devToken:'f780692d61453893b756d13eb5324921f40ba270f0434a6f9a265ac736dd6b08',
      startDate: ['08:00', "HH:mm"],
      endDate: ['23:00', "HH:mm"],
    },
    activities: [
      {
        Day: '02/07/2016',
        time: "08:00",
        task: "Time for Breakfast"
      },
      {
        Day: moment().format(),
        time: "10:00",
        task: "Time for a Morning Snack"
      },
      {
        Day: moment().format(),
        time: "12:00",
        task: "Lunch Time"
      },
      {
        Day: moment().format(),
        time: "15:00",
        task: "Time for an Afternoon Snack"
      },
      {
        Day: moment().format(),
        time: "18:00",
        task: "Dinner Time"
      },
      {
        Day: new Date(),
        time: "21:00",
        task: "Evening Snack 1"
      },
      {
        Day: new Date(),
        time: "23:00",
        task: "Evening Snack 2"
      }

    ]
  }
}

/* update the db*/
function updateSchedule(Schedule) {
  var userInfo = Schedule.metaData
  var activities = Schedule.activities
  for (var idx in Schedule.activities) {

    var NewAct = Kal.db.createNewActivity(userInfo, activities[idx])
    console.log(NewAct)
    Kal.db.saveActivities(NewAct)


  }
}

/* main */

var myDailies = userDailySchedule()
updateSchedule(myDailies)


module.exports = {
  getRandomNumberInInterval: getRandomNumberInInterval,
  getStartAndEndDateTime: getStartAndEndDateTime,
}

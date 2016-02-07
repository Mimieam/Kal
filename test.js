var KalJS  =  require('./Kal')
/* Kal.js tests*/

var deviceToken = "dfasfdasdf"
// var newUser = new Users({token:"f780692d61453893b756d13eb5324921f40ba270f0434a6f9a265ac736dd6b08", deviceType:"ios", timestamp:new Date()})
// var newUser2 = new Users({token:"dfasfdasdf", deviceType:"ios", timestamp:new Date()})
var testUser = {token:"testUser1", deviceType:"ios", timestamp:new Date()}


var newActivity = new Activity({
  token:"f780692d61453893b756d13eb5324921f40ba270f0434a6f9a265ac736dd6b08",
  deviceType:"ios",
  description: "testing Activity for KalScheduler",
  dueDate: new Date(),
  timezone: new Date().getTimezoneOffset(),
  startTime: new Date(),
  endTime: new Date(),
  timestamp: new Date(),
  status: 0,
  recurrent: false
})


function test_getStartAndEndDateTime() {

  console.log("\n******* testing getStartAndEndDateTime() *******")
  var dates = KalJS.getStartAndEndDateTime("8", "23") // starting @ 8 am and finishing @
  console.log(dates[0].format("hh:mm a"), dates[1].format("hh:mm a"))
  console.log("******* Done with getStartAndEndDateTime() *******")
}

function test_RandomNumberInInterval() {
  console.log("\n******* testing getRandomNumberInInterval() *******")
  var dates = KalJS.getStartAndEndDateTime("8", "23") // starting @ 8 am and
  var randomnumber = KalJS.getRandomNumberInInterval(2,3)
  var startDate =  dates[0]
  var endDate   =  dates[1]

  startDate.add(randomnumber,"h")
  console.log(randomnumber, startDate.format("hh:mm a"))
  console.log("******* Done with getRandomNumberInInterval() *******")

}

function test_getNotification () {
  var notif = {
    id:"007",
    devToken:'f780692d61453893b756d13eb5324921f40ba270f0434a6f9a265ac736dd6b08',
    description: "Eat something",
    dueDate: moment().add(1,"m").format("HH:mm"),
    timezone: 0,
  }
  Kal.pending.push(notif)
}


test_getStartAndEndDateTime()
test_RandomNumberInInterval()

var KalJS  =  require('./Kal')
/* Kal.js tests*/

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


test_getStartAndEndDateTime()
test_RandomNumberInInterval()

var levelup = require('levelup')
var db = levelup('./mydb')
function mydb() {
	// db.put('name', 'LevelUP', function (err) {
	// 	if (err) return console.log('Ooops!', err) // likely the key was not found
	// });
	db.get('name', function (err, value) {
    	if (err) return console.log('Ooops!', err) // likely the key was not found

    	// ta da!
    	console.log('name=' + value)
  	});
  	// db.del('name', function (error) {
   //      if (error) return console.log('Ooops!', error) // likely the key was not found
   //  })
}

module.exports = mydb;
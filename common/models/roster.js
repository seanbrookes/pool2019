const fs = require('fs');

module.exports = function(Roster) {

  fs.readFile('./client/www/dbbackup/rosters-for-new-season.json', function(err, data) {
    if (err) {
      console.log('error', err);
    }
    // const xyz = JSON.parse(data);
    // xyz.map((roster) => {
    //   roster.year = 2018;
    //
    //   Roster.create(roster, function(error, response) {
    //     if (error) {
    //       console.log('create error', error);
    //     }
    //     console.log('success', response.slug);
    //   })
    // });
  });


};

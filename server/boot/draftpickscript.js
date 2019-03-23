module.exports = function(app) {
  const DraftPick = app.models.draftpick;
  let pickNumber = 1;
  let roundNumber = 1;

  const loopCollection = [
    "rallycaps",
    "mashers",
    "bashers",
    "stallions",
    "stallions",
    "bashers",
    "mashers",
    "rallycaps"
  ];

  const isEven = (n) => {
    return n % 2 == 0;
  };

  const draftPicks =[];
  let rosterIndex = 0;

  let roundIndex = 0;
  for (var i = 0;i < 80;i++) {
    pickNumber = (i + 1);
    roundIndex++;


    const pickObj = {
      "pickNumber": pickNumber,
      "round": roundNumber,
      "roster": loopCollection[rosterIndex],
      "name": "",
      "pos": "",
      "team": "",
      "slug": loopCollection[rosterIndex]
    };





    // DraftPick.create(pickObj, function(err, response) {
    //   if (err) {
    //     console.log('err', err);
    //   }
    //   console.log('|');
    //   console.log('|');
    //   console.log('| CREATE pickObj: ', pickObj);
    //   console.log('|');
    //   console.log('|');
    // });


    rosterIndex++;
    if (rosterIndex === 8) {
      rosterIndex = 0;
    }
    if (roundIndex === 4) {
      roundIndex = 0;
      roundNumber++;
    }
  }
};

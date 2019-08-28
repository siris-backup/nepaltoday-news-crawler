module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    if (myTimer.IsPastDue)
    {
        context.log('JavaScript is running late!');
    }
	context.log('JavaScript timer trigger function ran!', timeStamp);


<<<<<<< Updated upstream
	//use db-service to get twitter handles
	//use twitter api library to get tweets
	//sort tweets using algorithm
	//store tweets in mongodb using db-service

	context.log('printing some stuff')
};
=======
  try {
    context.log("we are starting from here");
    context.log("data base url", process.env.DATABASE_URL);
    const twitterHandles = await TweetDbService.getTwitterHandles();
    u;
    context.log(twitterHandles);
    if (twitterHandles) {
      twitterHandles.forEach(user => {
        context.log("user here", user);
        getTweetByHandle(user);
      });
    }
  } catch (error) {
    context.error(error);
  }
};
>>>>>>> Stashed changes

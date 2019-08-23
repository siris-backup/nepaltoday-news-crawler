module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    if (myTimer.IsPastDue)
    {
        context.log('JavaScript is running late!');
    }
	context.log('JavaScript timer trigger function ran!', timeStamp);


	//use db-service to get twitter handles
	//use twitter api library to get tweets
	//sort tweets using algorithm
	//store tweets in mongodb using db-service

	context.log('printing some stuff')
};
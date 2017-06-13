module.exports = {
	
	'googleAuth': {
    clientID: process.env.G_CLIENT_ID ,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: process.env.G_CALLBACK_URL,
	},

	'facebookAuth': {
    clientID: process.env.F_CLIENT_ID,
    clientSecret: process.env.F_CLIENT_SECRET,
    callbackURL: process.env.F_CALLABACK_URL,
	}
}
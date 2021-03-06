/*
This is the initial state of the Redux Store. I store it in a separate file because I also use
it in the reducers when we do the Reset action.
*/

var C = require("../constants");

module.exports = {
	feedback: [
		{msg:"Welcome to this little demo! Wee!",error:false},
		{msg:"We have cookies!",error:false},
		{msg:"Also poop.",error:false}
	],
	auth: {
		currently: C.ANONYMOUS,
		username: null,
		uid: null
	},
	quotes: {
		hasreceiveddata: false,
		submittingnew: false,
		states: {}, // this will store per quote id if we're editing or awaiting DB response
		data: {} // this will contain firebase data
	}
};
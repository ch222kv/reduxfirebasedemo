/*
This module contains action creators dealing with `appState.auth`
They are functions which will return an object describing the actions.
These actions are imported by Redux-aware components who need them, in our case it is just Home.
*/

var C = require("../constants"),
	Firebase = require("firebase"),
	quotesRef = new Firebase(C.FIREBASE).child("quotes");

module.exports = {
	// called when the app starts. this means we immediately download all quotes, and 
	// then receive all quotes again as soon as anyone changes anything.
	startListeningToQuotes: function(){
		return function(dispatch,getState){
			quotesRef.on("value",function(snapshot){
				dispatch({ type: C.RECEIVE_QUOTES_DATA, data: snapshot.val() });
			});
		}
	},
	startQuoteEdit: function(qid){
		return {type:C.START_QUOTE_EDIT,qid};
	},
	cancelQuoteEdit: function(qid){
		return {type:C.FINISH_QUOTE_EDIT,qid};
	},
	deleteQuote: function(qid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_QUOTE_EDIT,qid});
			quotesRef.child(qid).remove(function(error){
				dispatch({type:C.FINISH_QUOTE_EDIT,qid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error});
				}
			});
		};
	},
	submitQuoteEdit: function(qid,content){
		return function(dispatch,getState){
			var state = getState(),
				username = state.auth.username,
				uid = state.auth.uid;
			dispatch({type:C.SUBMIT_QUOTE_EDIT,qid});
			quotesRef.child(qid).set({content,username,uid},function(error){
				dispatch({type:C.FINISH_QUOTE_EDIT,qid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error});
				}
			});
		};
	},
	submitNewQuote: function(content){
		return function(dispatch,getState){
			var state = getState(),
				username = state.auth.username,
				uid = state.auth.uid;
			dispatch({type:C.AWAIT_NEW_QUOTE_RESPONSE});
			quotesRef.push({content,username,uid},function(error){
				dispatch({type:C.RECEIVE_NEW_QUOTE_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error});
				}
			});
		}
	}
};

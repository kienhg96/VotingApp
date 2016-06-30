module.exports = function(data, authorId){
	var selection = data.selection;
	var vote = {
		title: data.title,
		authorId: authorId,
		voteList: [],
		userList: []
	};
	for (var i = 0; i < selection.length; i++){
		vote.voteList.push({
			name: selection[i],
			count: 0
		});
	}
	return vote;
}
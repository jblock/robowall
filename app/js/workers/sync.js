self.addEventListener('message', function(event) {
	var http = new XMLHttpRequest();
	var msg = {};
	var url = 'http://robowall.hcii.cs.cmu.edu/?wpapi=get_posts&type=post';

	http.open("GET", url, false);
	http.send(null);

	self.postMessage(JSON.parse(http.responseText));
	self.close();
});
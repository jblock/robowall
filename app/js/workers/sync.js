// Need to fix CORS. Probably need to have a local proxy or something.

self.addEventListener('message', function(event) {
	var http = new XMLHttpRequest();
	var msg = {};
	// var url = 'http://robowall.hcii.cs.cmu.edu/?wpapi=get_posts&type=post&dev=0';

	// http.open("GET", url, false);
	// http.send(null);

	// msg.data = http.responseText;
	msg.data = "YOU GOT IT!";
	self.postMessage(msg);
	self.close();
});
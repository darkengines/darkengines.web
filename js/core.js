var core = {
	io: {
		jsonWebSocket: function(args) {
			var webSocket = new window.WebSocket(args.url);
			webSocket.events = args.events;
			webSocket.onopen = args.open;
			webSocket.onclose = args.close;
			webSocket.onmessage = function(e) {
				var data = JSON.parse(e.data);
				if (webSocket.events.hasOwnProperty(data.event)) return webSocket.events[data.event](data.data);
				throw 'Cannot find event with name '+data.event+'.';
			};
			webSocket._send = webSocket.send;
			webSocket.send = function(event, data) {
				webSocket._send(JSON.stringify({event:event,data:data}));
			}
			return webSocket;
		}
	},
	string: {
		format: function(string) {
			var regex = new RegExp('{([0-9]*)}', 'g');
			var args = arguments;
			return string.replace(regex, function(match, content) { return args[parseInt(content)+1]});
		}
	},
};
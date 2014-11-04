var chatMessageProvider = function(args) {
	this.message = new Array();
	var socket = new core.io.jsonWebSocket(args);
	var $this = this;
	socket.events.message = function(data) {
		$this.message.forEach(function(f) { 
			f(data.name, data.message);
		});
	};
	this.sendMessage = function(name, message) { 
		socket.send('message', {name: name, message: message}); 
	};
	return this;
};
var application = function(args) {
	var chatSocket = new chatMessageProvider(args.chatSocket);
	this.chat = function(args) {
		$('.Chat', args.$scope).each(function() {
			var socket = args.chatSocket;
			var $chat = $(this);
			var $output = $('.Output', $chat);
			var $input = $('.Input', $chat);
			var $name = $('> .Name', $chat);
			socket.message.push(function(name, message) {
				var $item = $('<div class="Item"></div>');
				var $name = $(core.string.format('<div class="Name">{0}:</div>', name));
				var $message = $(core.string.format('<div class="Message">{0}</div>', message));
				var $expand = $('<div class="Expand"></div>');
				$item.append($name);
				$item.append($message);
				$message.append($expand);
				$expand.click(function() {
					var expandClass = 'Full';
					$message.hasClass(expandClass) ? $message.removeClass(expandClass) : $message.addClass(expandClass);
				});
				$output.append($item);
				$output.each(function() {
					$(this).scrollTop(this.scrollHeight);
				});
			});
			$input.keydown(function(e) {
				switch (e.which) {
					case (13): {
						if (!e.shiftKey) {
							socket.sendMessage($name.text(), $input.html());
							$input.empty();
							e.preventDefault();
							return false;
						}
					}
					default:{}
				}
			});
		});
	};
	this.chat({chatSocket: chatSocket});
};
(function($) {
	$(document).ready(function() {
		var app = new application({
			$scope: $(document),
			chatSocket: {
				url: 'ws://88.162.193.15:1337',
				events : {},
				open: function() {},
				close: function() {},
			},
		});
	});
})(jQuery);
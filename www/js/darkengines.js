/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
		this.socket = new JWebSocket("ws://88.162.193.15:1337", {
			open: function(s, e) {},
			close: function(s, e) {},
			events: {

			}
		});
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

(function($) { 
	$(window).ready(function() {
		app.initialize();
		var socket = app.socket;
		socket.events.message = function(data) {
			data = JSON.parse(data);
			$('.Output').append($('<div class="Item"><div class="Name">'+data.name+':</div><div class="Message">'+data.html+'</div></div>'));
			$('.Output').each(function() {$(this).scrollTop(this.scrollHeight)});
		};
		$('.Input').keydown(function(e) {
			switch (e.which) {
				case (13): {
					if (!event.shiftKey) {
						var json = {name: $('.Chat > .Name').text(), html: $(this).html()};
						socket.send('message', JSON.stringify(json));
						$('.Input').html('');
						e.preventDefault();
						return false;
					}
				}
				default:{}
			}
		});
	});
})(jQuery);
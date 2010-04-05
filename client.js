var App = App || {};

// show a message to user
App.notice = function(msg) {
	alert(msg);
};

App.addLine = function() {
	var $line = $('<div />', {
		className: 'line'
	});
	$('<span />', {
		text: '> ',
		className: 'prompt'
	}).appendTo($line);

	$('<input />', {
		text: '',
		className: 'readLine'
	}).appendTo($line);

	$('#terminal').append($line);
};

App.addResponseLine = function(msg, ignore_prompt) {

	$('<div />', {
		className: 'line',
		text: msg
	}).appendTo($('#terminal'));
	if (ignore_prompt) {} else {
		App.addLine();
		$('input:last').focus();
	}
};

App.send = function(cmd) {
	$.ajax({
		url: '/cmd',
		data: {
			cmd: cmd
		},
		success: function(data) {
			App.addResponseLine(data.response);
		},
		error: function() {
			App.notice(cmd + ' could not be sent to the server');
		}
	});

};

$(function() {

	$('input.readLine').focus();

	$.ajax({
		url: '/version',
		success: function(data) {
			if (data.error) {
				App.notice(data.error);
			} else {
				var v = data.nodejs_version;
				log(v);
				$('#nodejs_version').text(data.nodejs_version);
			}
		},
		error: function() {
			App.notice('Error connecting to server');
		}
	});
});

$('.readLine').live('keypress', function(e) {
	if (e.keyCode !== 13) {
		return;
	}
	var cmd = $('.readLine:last').attr('value').replace('\n', '');
	if (cmd === '.help') {
		App.showHelp();
	} else {
		App.send(cmd);
	}
});

App.showHelp = function() {
	App.addResponseLine(".break", true);
	App.addResponseLine("Sometimes you get stuck in a place you can't get out. This will get your out.", true);
	App.addResponseLine(".clear", true);
	App.addResponseLine("Break, and also clear the local scope.");
};


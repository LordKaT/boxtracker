// Chrome app.

// set URL to boxTracker.php
$g_url = "";
$g_username = "";

// makes a URL so I don't have to keep typing it.
function makeURL(act, id, username, type, loc, event) {
	return $g_url + "?act=" + act + "&id=" + id + "&username=" + username + "&type=" + type + "&loc=" + loc + "&event=" + event;
}

function setUser(id) {
	$.getJSON(makeURL("set", id, $g_username)).done(function(data) {
		if (data["error"] !== 0) {
			console.log(data["error"]);
		}
		return;
	}).error(function(jqXHR, textStatus, errorThrown) {
		console.log("error " + textStatus);
		console.log("incoming Text " + jqXHR.responseText);
		return;
  });
	return;
}

function unsetUser(id) {
	$.getJSON(makeURL("unset", id, $g_username), function(data) {
		if (data["error"] !== 0) {
			alert(data["error"]);
		}
		return;
	}).error(function(jqXHR, textStatus, errorThrown) {
		console.log("error " + textStatus);
		console.log("incoming Text " + jqXHR.responseText);
		return;
  });
	return;
}

function setEvent(id, event) {
	$.getJSON(makeURL("event", id, $g_username, 0, 0, event)).done(function(data) {
		if (data["error"] !== 0) {
			console.log(data["error"]);
		}
		return;
	}).error(function(jqXHR, textStatus, errorThrown) {
		console.log("error " + textStatus);
		console.log("incoming Text " + jqXHR.responseText);
		return;
  });
	return;
}

$g_startup = 0;

function startupTrack() {
	$g_startup += 1;
	if ($g_startup === 8) {
		update();
	}
	return;
}

function startupData(data, ourdiv) {
	$("#" + ourdiv).html('');
	$.each(data, function(i, d) {
		var ourid = d.id + "-" + d.name;
		ourid = ourid.replace(/\s+/g, '-').toLowerCase();
		$("#" + ourdiv).append(
				'<div>' +
					'<input type="checkbox" id="' + ourid + '-cb" />' + d.name +
					' <span id="' + ourid + '-sp">' + d.info + '</span>' +
					' <input type="text" id="' + ourid + '-ib" size="13" />'
			);
		if (d.user === "") {
			$("#" + ourid + '-cb').prop("checked", false);
			$("#" + ourid + '-cb').prop("disabled", false);
			$("#" + ourid + '-cb').off().on("mousedown", function() {
				setUser(d.id);
			});
			$("#" + ourid + "-sp").html(d.info);
			$("#" + ourid + "-sp").removeClass("remove");
			$("#" + ourid + '-ib').hide();
			$("#" + ourid + '-ib').val("");
		} else {
			$("#" + ourid + '-cb').prop("checked", true);
			$("#" + ourid + '-cb').prop("disabled", true);
			$("#" + ourid + "-sp").html(d.user);
			$("#" + ourid + "-sp").addClass("remove");
			$("#" + ourid + "-sp").off().on("mousedown", function() {
				unsetUser(d.id);
			});
			$("#" + ourid + '-ib').show();
			$("#" + ourid + '-ib').keyup(function(event) {
				if (event.keyCode === 13) {
					setEvent(d.id, this.value);
				}
			});
			$("#" + ourid + '-ib').off().focusout(function() {
				setEvent(d.id, this.value);
			});
			if (d.event !== "" && !$("#" + ourid + '-ib').is(':focus')) {
				$("#" + ourid + '-ib').val(d.event);
			}
		}
	});
	return;
}

function startupJSON(type, loc, div) {
	return $.getJSON($g_url + "?type=" + type + "&loc=" + loc).done(function(data) {
		startupData(data, div);
		startupTrack();
	});
}

function startup() {
	$("#equipment").html("");
	$("#equipment").append('<div id="Encoders 1"><p id="1-E-at"><b>Encoders 1</b></p><div id="1-E-ac" class="accordion-content"></div></div>');
	$("#equipment").append('<div id="Acquisition 1"><p id="1-A-at"><b>Acquisition 1</b></p><div id="1-A-ac" class="accordion-content"></div></div>');
	$("#equipment").append('<div id="Encoders 2"><p id="2-E-at"><b>Encoders 2</b></p><div id="2-E-ac" class="accordion-content"></div></div>');
	$("#equipment").append('<div id="Acquisition 2"><p id="2-A-at"><b>Acquisition 2</b></p><div id="2-A-ac" class="accordion-content"></div></div>');
	$("#equipment").append('<div id="Encoders 3"><p id="3-E-at"><b>Encoders 3</b></p><div id="3-E-ac" class="accordion-content"></div></div>');
	$("#equipment").append('<div id="Acquisition 3"><p id="3-A-at"><b>Acquisition 3</b></p><div id="3-A-ac" class="accordion-content"></div></div>');
	$("#equipment").append('<div id="Encoders 4"><p id="4-E-at"><b>Encoders 4</b></p><div id="4-E-ac" class="accordion-content"></div></div>');
	$("#equipment").append('<div id="Acquisition 4"><p id="4-A-at"><b>Acquisition 4</b></p><div id="4-A-ac" class="accordion-content"></div></div>');
	$("#equipment").append("</div>");
	startupJSON("encoder", "1", "1-E-ac");
	startupJSON("acquisition", "1", "1-A-ac");
	startupJSON("encoder", "2", "2-E-ac");
	startupJSON("acquisition", "2", "2-A-ac");
	startupJSON("encoder", "3", "3-E-ac");
	startupJSON("acquisition", "3", "3-A-ac");
	startupJSON("encoder", "4", "4-E-ac");
	startupJSON("acquisition", "4", "4-A-ac");
	return;
}

$g_updates = 0;

function updateTrack() {
	$g_updates += 1;
	if ($g_updates === 8) {
		$g_updates = 0;
		setTimeout(update, 125);
	}
}

function updateData(data, ourdiv) {
	$.each(data, function(index, d) {
		var ourid = d.id + "-" + d.name;
		ourid = ourid.replace(/\s+/g, '-').toLowerCase();
		if (d.user === "") {
			$("#" + ourid + '-cb').prop("checked", false);
			$("#" + ourid + '-cb').prop("disabled", false);
			$("#" + ourid + '-cb').off().on("mousedown", function() {
				setUser(d.id);
			});
			$("#" + ourid + "-sp").html(d.info);
			$("#" + ourid + "-sp").removeClass("remove");
			$("#" + ourid + '-ib').hide();
			$("#" + ourid + '-ib').val("");
		} else {
			$("#" + ourid + '-cb').prop("checked", true);
			$("#" + ourid + '-cb').prop("disabled", true);
			$("#" + ourid + "-sp").html(d.user);
			$("#" + ourid + "-sp").addClass("remove");
			$("#" + ourid + "-sp").off().on("mousedown", function() {
				unsetUser(d.id);
			});
			$("#" + ourid + '-ib').show();
			$("#" + ourid + '-ib').keyup(function(event) {
				if (event.keyCode === 13) {
					setEvent(d.id, this.value);
				}
			});
			$("#" + ourid + '-ib').off().focusout(function() {
				setEvent(d.id, this.value);
			});
			if (d.event !== "" && !$("#" + ourid + '-ib').is(':focus')) {
				$("#" + ourid + '-ib').val(d.event);
			}
		}
	});
	return;
}

function updateJSON(type, loc, div) {
	return $.getJSON($g_url + "?type=" + type + "&loc=" + loc).done(function(data) {
		updateData(data, div);
		updateTrack();
	});
}

function update() {
	updateJSON("encoder", "1", "1-E-ac");
	updateJSON("acquisition", "1", "1-A-ac");
	updateJSON("encoder", "2", "2-E-ac");
	updateJSON("acquisition", "2", "2-A-ac");
	updateJSON("encoder", "3", "3-E-ac");
	updateJSON("acquisition", "3", "3-A-ac");
	updateJSON("encoder", "4", "4-E-ac");
	updateJSON("acquisition", "4", "4-A-ac");
	return;
}

// Reset all user data
function reset() {
	chrome.storage.local.set({"username": ""});
	$g_username = "";
	chrome.runtime.reload();
	return;
}

function login() {
	chrome.storage.local.set({"username": $g_username});
	$("#login").hide();
	$("#navbar").show();
	$("#navbar").html('<span class="remove" id="reset">logout</a>');
	$("#reset").off().on("mousedown", function() {
		reset();
		return;
	});
	startup();
	return;
}

$(document).ready(function() {
	$.ajaxSetup({cache: false});
	$("#navbar").hide();
	chrome.storage.local.get("username", function(res) {
		if (res.username !== "") {
			$("#usernameform").val(res.username);
			$g_username = res.username;
			login();
		}
	});
	$("#loginbtn").click(function() {
		var ourdata = $("form").serializeArray();
		$g_username = ourdata[0]["value"];
		login();
	});
	$("#usernameform").keyup(function(event) {
		if (event.keyCode === 13) {
			$("#loginbtn").click();
		}
	});
});

// I really need to convert this to something more OOP.

// enter the URL to boxTracker.php here
$g_url = "";

// just initializing variables for easy reference.
$g_username = "";
$g_startup = 0;
$g_updates = 0;

function makeURL(act, id, username, type, loc, event) { return $g_url + "?act=" + act + "&id=" + id + "&username=" + username + "&type=" + type + "&loc=" + loc + "&event=" + event; }

/*
Function: setUser
Return: nothing

Sets box to be used by g_username
*/
function setUser(id) {
    $.getJSON(makeURL("set", id, $g_username)).done(function(data) {
        if (data["error"] !== 0) { console.log(data["error"]); }
        return;
    }).error(function(jqXHR, textStatus, errorThrown) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
        return;
    });
    return;
}

/*
Function: unsetUser
Return: nothing

Unsets the box being used by g_username
*/
function unsetUser(id) {
    $.getJSON(makeURL("unset", id, $g_username), function(data) {
        if (data["error"] !== 0) { alert(data["error"]); }
        return;
    }).error(function(jqXHR, textStatus, errorThrown) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
        return;
    });
    return;
}

/*
Function: setEvent
Return: nothing

Sets the event text for the selected box
*/
function setEvent(id, event) {
    $.getJSON(makeURL("event", id, $g_username, 0, 0, event)).done(function(data) {
        if (data["error"] !== 0) { console.log(data["error"]); }
        return;
    }).error(function(jqXHR, textStatus, errorThrown) {
        console.log("error " + textStatus);
        console.log("incoming Text " + jqXHR.responseText);
        return;
    });
    return;
}

/*
Function: startupTrack
Return: nothing

Startup sequence tracking.
*/
function startupTrack() {
    $g_startup += 1;
    if ($g_startup === 8) { update(); }
    return;
}

/*
Function: startupData
Return: nothing

Sets the chrome app inital information.
*/
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
            $("#" + ourid + '-cb').off().on("mousedown", function() { setUser(d.id); });
            $("#" + ourid + "-sp").html(d.info);
            $("#" + ourid + "-sp").removeClass("remove");
            $("#" + ourid + '-ib').hide();
            $("#" + ourid + '-ib').val("");
        } else {
            $("#" + ourid + '-cb').prop("checked", true);
            $("#" + ourid + '-cb').prop("disabled", true);
            $("#" + ourid + "-sp").html(d.user);
            $("#" + ourid + "-sp").addClass("remove");
            $("#" + ourid + "-sp").off().on("mousedown", function() { unsetUser(d.id); });
            $("#" + ourid + '-ib').show();
            $("#" + ourid + '-ib').keyup(function(event) {
                if (event.keyCode === 13) { setEvent(d.id, this.value); }
            });
            $("#" + ourid + '-ib').off().focusout(function() { setEvent(d.id, this.value); });
            if (d.event !== "" && !$("#" + ourid + '-ib').is(':focus')) {
                $("#" + ourid + '-ib').val(d.event);
            }
        }
    });
    return;
}

/*
Function: startupJSON
Return: nothing

Gets JSON data and populates app.
*/
function startupJSON(type, loc, div) {
    return $.getJSON($g_url + "?type=" + type + "&loc=" + loc).done(function(data) {
        startupData(data, div);
        startupTrack();
    });
    return;
}

/*
Function: startup
Return: nothing

Ties all initalization functions together.
*/
function startup() {
    $("#equipment").html("");
    $("#equipment").append('<div id="1-Encoders"><p id="IDF-E-at"><b>Encoders 1</b></p><div id="1-E-ac" class="accordion-content"></div></div>');
    $("#equipment").append('<div id="1-Acquisition"><p id="IDF-A-at"><b>Acquisition 1</b></p><div id="1-A-ac" class="accordion-content"></div></div>');
    $("#equipment").append('<div id="2-Encoders"><p id="NYI-E-at"><b>Encoders 2</b></p><div id="2-E-ac" class="accordion-content"></div></div>');
    $("#equipment").append('<div id="2-Acquisition"><p id="NYI-A-at"><b>Acquisition 2</b></p><div id="2-A-ac" class="accordion-content"></div></div>');
    $("#equipment").append('<div id="3-Encoders"><p id="COLO-E-at"><b>Encoders 3</b></p><div id="3-E-ac" class="accordion-content"></div></div>');
    $("#equipment").append('<div id="3-Acquisition"><p id="COLO-A-at"><b>Acquisition 3</b></p><div id="3-A-ac" class="accordion-content"></div></div>');
    $("#equipment").append('<div id="4-Encoders"><p id="UK-E-at"><b>Encoders 4</b></p><div id="4-E-ac" class="accordion-content"></div></div>');
    $("#equipment").append('<div id="4-Acquisition"><p id="UK-A-at"><b>Acquisition 4</b></p><div id="4-A-ac" class="accordion-content"></div></div>');
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

/*
Function: updateTrack
Return: nothing

Timed update function.
*/
function updateTrack() {
    $g_updates += 1;
    if ($g_updates === 8) {
        $g_updates = 0;
        setTimeout(update, 125);
    }
    return;
}

/*
Function: updateData
Return: nothing

Updates specific data in app.
*/
function updateData(data, ourdiv) {
    $.each(data, function(index, d) {
        var ourid = d.id + "-" + d.name;
        ourid = ourid.replace(/\s+/g, '-').toLowerCase();
        if (d.user === "") {
            $("#" + ourid + '-cb').prop("checked", false);
            $("#" + ourid + '-cb').prop("disabled", false);
            $("#" + ourid + '-cb').off().on("mousedown", function() { setUser(d.id); });
            $("#" + ourid + "-sp").html(d.info);
            $("#" + ourid + "-sp").removeClass("remove");
            $("#" + ourid + '-ib').hide();
            $("#" + ourid + '-ib').val("");
        } else {
            $("#" + ourid + '-cb').prop("checked", true);
            $("#" + ourid + '-cb').prop("disabled", true);
            $("#" + ourid + "-sp").html(d.user);
            $("#" + ourid + "-sp").addClass("remove");
            $("#" + ourid + "-sp").off().on("mousedown", function() { unsetUser(d.id); });
            $("#" + ourid + '-ib').show();
            $("#" + ourid + '-ib').keyup(function(event) {
                if (event.keyCode === 13) { setEvent(d.id, this.value); }
            });
            $("#" + ourid + '-ib').off().focusout(function() { setEvent(d.id, this.value); });
            if (d.event !== "" && !$("#" + ourid + '-ib').is(':focus')) {
                $("#" + ourid + '-ib').val(d.event);
            }
        }
    });
    return;
}

/*
Function: updateJSON
Return: nothing

Grabs JSON data.
*/
function updateJSON(type, loc, div) {
    return $.getJSON($g_url + "?type=" + type + "&loc=" + loc).done(function(data) {
        updateData(data, div);
        updateTrack();
    });
    return;
}

/*
Function: update
Return: nothing

Unified update function.
*/
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

/*
Function: reset
Return: nothing

Resets username and data store (if any)
*/
function reset() {
    $g_username = "";
    console.log("hi");
    location.reload();
    return;
}

/*
Function: login
Return: nothing

Login function that currently returns two values - nothing or false.
*/
function login() {
    var ourdata = $("form").serializeArray();
    $g_username = ourdata[0]["value"];
    if ($g_username === null || $g_username === "") {
        reset();
        return;
    }
    $("#login").hide();
    $("#navbar").show();
    $("#navbar").html('<span class="remove" id="reset">logout</a>');
    /* shouldn't be here, but it's here because it works. Will fix later. */
    $("#reset").off().on("mousedown", function() {
        reset();
        return false;
    });
    startup();
    return;
}

$(document).ready(function() {
    $.ajaxSetup({cache: false});
    $("#navbar").hide();
    $("#loginbtn").click(function() {
        login();
        event.preventDefault();
        return false;
    });
    $("#loginform").submit(function(event){
        login();
        event.preventDefault();
        return false;
    });
    $("#usernameform").keypress(function(e) {
        if (e.which === 13) {
            $("#loginform").submit();
            event.preventDefault();
            return false;
        }
    });
});

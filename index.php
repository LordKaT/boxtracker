<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <link rel="icon" href="icon.png">
        <title>BoxTracker Deluxe</title>
        <style>
            html, body { overflow-y: visible; }
            .remove {
                color: #0000aa;
                text-decoration: underline;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <script src="jquery-2.1.4.min.js"></script>
        <script src="boxtracker.js"></script>
        <div id="login">
            <form id="loginform">
                Enter your username: <br />
                <input type="text" name="username" id="usernameform" /><br />
                <input type="button" name="Submit" id="loginbtn" value="Submit" />
            </form>
        </div>
        <div id="navbar"></div>
        <div id="equipment"></div>
    </body>
</html>

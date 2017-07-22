<?php
session_start();
require_once("meekrodb.2.3.class.php");

/* Simple script for grabbing information from the DB.
No sanity checking done here, most of the sanity checks are done in meekrodb. */

DB::$user = "";
DB::$password = "";
DB::$dbName = "";

if (empty($_SESSION["username"])) {
    $username = filter_input(INPUT_GET, "username");
    if (empty($username)) { $username = "too lazy"; }
} else { $username = $_SESSION["username"]; }

/*
Function: getData
Return: array()

Grabs data from DB, converts it to and returns an array.
*/
function getData($type, $location=null) {
    $return = array();
    if ($location === null) { $res = DB::query("SELECT * FROM resources WHERE type=%s", $type); }
    else { $res = DB::query("SELECT * FROM resources WHERE type=%s AND location=%s", $type, $location); }
    foreach ($res as $row) { $return[] = array("id" => $row["id"], "name" => $row["name"], "info" => $row["info"], "user" => $row["user"], "event" => $row["event"]); }
    return $return;
}

/* Just grabbing input */
$act = filter_input(INPUT_GET, "act");
$id = filter_input(INPUT_GET, "id");
$loc = filter_input(INPUT_GET, "loc");
$type = filter_input(INPUT_GET, "type");
$name = filter_input(INPUT_GET, "name");
$event = filter_input(INPUT_GET, "event");
$username = filter_input(INPUT_GET, "username");
$ret = array();
$ret["error"] = 0;

switch ($act) {
    case "set":
        $res = DB::query("SELECT * FROM resources WHERE id=%s AND name <> ''", $id);
        if (empty($res[0]["user"])) { DB::update("resources", array("user" => $username), "id=%s", $id); }
        else { $ret["error"] = "Box already taken!"; }
        break;
    case "unset":
        DB::update("resources", array("user" => "", "event" => ""), "id=%s", $id);
        break;
    case "event":
        DB::update("resources", array("event" => $event), "id=%s", $id);
        break;
    default:
        $ret = getData($type, $loc);
        break;
}

echo json_encode($ret);

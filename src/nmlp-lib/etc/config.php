<?php
/**
 * Configuration File
 */
namespace nmlp;

define("DEBUG", 1);

define("DOMAIN", $_SERVER["HTTP_HOST"]);
define("HOME_URI", "/nmlp");

define("HOME_DIR", dirname(__DIR__));
// define("HTDOCS_DIR", "");
define("CLASS_DIR", HOME_DIR . "/classes");
define("LIB_DIR", HOME_DIR . "/lib");
define("EXEC_DIR", HOME_DIR . "/libexec");
define("TMP_DIR", HOME_DIR . "/tmp");
define("VAR_DIR", HOME_DIR . "/var");
define("LOG_DIR", VAR_DIR . "/log");

define("DSN", "");

ini_set("display_errors", DEBUG);
error_reporting(E_ALL ^ E_NOTICE ^ E_DEPRECATED);
set_include_path(".:/usr/local/lib/php");
date_default_timezone_set('Asia/Tokyo');
mb_internal_encoding("utf8");
mb_language("Japanese");

session_set_cookie_params(
    [
        "lifetime" => 0,
        "path" => "/",
        "domain" => DOMAIN,
        "secure" => false,
        "httponly" => false,
        "samesite" => true
    ]
);

spl_autoload_register(function ($class) {
    $class = preg_replace("/[_\\\\]/", "/", $class);
    //if (DEBUG) {print CLASS_DIR . "/{$class}.php";}
    if (is_file(CLASS_DIR . "/{$class}.php")) {
        include_once(CLASS_DIR . "/{$class}.php");
    }
});

$SCRIPT_NAME = LIB_DIR . preg_replace("/" . preg_quote(HOME_URI, "/") . "/", "", $_SERVER["SCRIPT_NAME"]);
if (is_file($SCRIPT_NAME)) {
    include_once $SCRIPT_NAME;
}


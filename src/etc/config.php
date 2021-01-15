<?php
/**
 * Configuration File
 */

define("DEBUG", 1);

define("DOMAIN", "www.example.com");

define("HOME_DIR", "/home/www.example.com");
define("HTDOCS_DIR", HOME_DIR . "/htdocs");
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

session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "domain" => DOMAIN,
    "secure" => false,
    "httponly" => false,
    "samesite" => true
]);


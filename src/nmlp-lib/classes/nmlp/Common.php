<?php
namespace nmlp;

class Common
{
    public static function loadCSS()
    {
        $cssFile = HOME_URI . "/css" . preg_replace("/" . preg_quote(HOME_URI, "/") . "/", "", $_SERVER["SCRIPT_NAME"]);
        $cssFile = preg_replace("/\.php$/", ".css", $cssFile);
        if(is_file($_SERVER["DOCUMENT_ROOT"] . $cssFile)) {
            print "<link rel=\"stylesheet\" href=\"{$cssFile}\">\n";
        }
    }

    public static function loadJS()
    {
        $cssFile = HOME_URI . "/js" . preg_replace("/" . preg_quote(HOME_URI, "/") . "/", "", $_SERVER["SCRIPT_NAME"]);
        $cssFile = preg_replace("/\.php$/", ".js", $cssFile);
        if(is_file($_SERVER["DOCUMENT_ROOT"] . $cssFile)) {
            print "<script type=\"text/javascript\" src=\"{$cssFile}\"></script>\n";
        }
    }

}
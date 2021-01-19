<?php
/**
 * @file    Common.php
 * @brief   汎用クラス
 * @author  Dengiken
 * @date    2021-01-19
 */

namespace nmlp;

/**
 * @package nmlp
 * @class   Common
 * @brief   汎用的に使用するクラス
 */
class Common
{
    /**
     * @fn  loadCSS
     * @brief CSSのオートローディング
     * @access public
     * @param void
     * @return void
     */
    public static function loadCSS()
    {
        $cssFile = HOME_URI . "/css" . preg_replace("/" . preg_quote(HOME_URI, "/") . "/", "", $_SERVER["SCRIPT_NAME"]);
        $cssFile = preg_replace("/\.php$/", ".css", $cssFile);
        if(is_file($_SERVER["DOCUMENT_ROOT"] . $cssFile)) {
            print "<link rel=\"stylesheet\" href=\"{$cssFile}\">\n";
        }
    }

    /**
     * @fn      loadCSS
     * @brief   Javascriptのオートローディング
     * @access  public
     * @param   void
     * @return  void
     */
    public static function loadJS()
    {
        $cssFile = HOME_URI . "/js" . preg_replace("/" . preg_quote(HOME_URI, "/") . "/", "", $_SERVER["SCRIPT_NAME"]);
        $cssFile = preg_replace("/\.php$/", ".js", $cssFile);
        if(is_file($_SERVER["DOCUMENT_ROOT"] . $cssFile)) {
            print "<script type=\"text/javascript\" src=\"{$cssFile}\"></script>\n";
        }
    }

}
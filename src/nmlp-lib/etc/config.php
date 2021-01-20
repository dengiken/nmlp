<?php
/**
 * @file    config.php
 * @brief   設定およびコントローラファイル
 * @author  Dengiken
 * @date    2021-01-19
 * @package nmlp
 */


namespace nmlp;

/**
 * @def     DEBUG
 * @brief   デバッグフラグ
 */
define("DEBUG", 1);

/**
 * @def     DOMAIN
 * @brief   ドメイン名
 */
define("DOMAIN", $_SERVER["HTTP_HOST"]);

/**
 * @def     HOME_URI
 * @brief   ホームURI。ブラウザでアクセスする際の絶対パス
 */
define("HOME_URI", "/nmlp");

/**
 * @def     HOME_DIR
 * @brief   システム部分のルートディレクトリ
 */
define("HOME_DIR", dirname(__DIR__));
// define("HTDOCS_DIR", "");

/**
 * @def     CLASS_DIR
 * @brief   クラスを配置するディレクトリ
 */
define("CLASS_DIR", HOME_DIR . "/classes");

/**
 * @def     LIB_DIR
 * @brief   モデルを配置するディレクトリ
 */
define("LIB_DIR", HOME_DIR . "/lib");

/**
 * @def     EXEC_DIR
 * @brief   サーバ上で動作するプログラムを配置するディレクトリ
 */
define("EXEC_DIR", HOME_DIR . "/libexec");

/**
 * @def     TMP_DIR
 * @brief   テンポラリディレクトリ
 */
define("TMP_DIR", HOME_DIR . "/tmp");

/**
 * @def     VAR_DIR
 * @brief   システムが使用するディレクトリ
 */
define("VAR_DIR", HOME_DIR . "/var");

/**
 * @def     LOG_DIR
 * @brief   ログディレクトリ
 */
define("LOG_DIR", VAR_DIR . "/log");

/**
 * @def     DNS
 * @brief   DB接続子
 */
define("DSN", "");

/**
 * 環境設定
 */
ini_set("display_errors", DEBUG);
error_reporting(E_ALL ^ E_NOTICE ^ E_DEPRECATED);
set_include_path(".:/usr/local/lib/php");
date_default_timezone_set('Asia/Tokyo');
mb_internal_encoding("utf8");
mb_language("Japanese");

/**
 * クッキー設定
 */
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

/**
 * クラスのオートローディング
 */
spl_autoload_register(function ($class) {
    $class = preg_replace("/[_\\\\]/", "/", $class);
    //if (DEBUG) {print CLASS_DIR . "/{$class}.php";}
    if (is_file(CLASS_DIR . "/{$class}.php")) {
        include_once(CLASS_DIR . "/{$class}.php");
    }
});

/**
 * ビューからスクリプト名を取得し、モデルをインクルードする
 */
$SCRIPT_NAME = LIB_DIR . preg_replace("/" . preg_quote(HOME_URI, "/") . "/", "", $_SERVER["SCRIPT_NAME"]);
if (is_file($SCRIPT_NAME)) {
    include_once $SCRIPT_NAME;
}

/**
 * HTTPヘッダ出力
 */
header("Content-type: text/html;charset=UTF8");


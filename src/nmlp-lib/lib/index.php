<?php
/**
 * @file    index.php
 * @brief   メインモデルファイル
 * @author  Dengiken
 * @date    2021-01-19
 */

$title = "";
$book = preg_replace("/\.\.\//", "", preg_split("/&/", $_SERVER["QUERY_STRING"])[0]);

if ($book == "") {
    exit();
}

$xmlFile = "resources/{$book}/main.xml";

if (!is_file($xmlFile)) {
    exit();
}

$xml = simplexml_load_file($xmlFile);
$title = $xml->xpath("/sequence/@title")[0]->title;


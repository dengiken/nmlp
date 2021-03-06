<?php
/**
 * @file    api.php
 * @brief   APIモデルファイル
 * @author  Dengiken
 * @date    2021-01-19
 */

if ($_POST["book"] == "") {
    exit();
}

if ($_POST["scene"] == "") {
    $xpath = "/sequence/scene[1]";
} else {
    $scene = addslashes($_POST["scene"]);
    $xpath = "/sequence/scene[@id='{$scene}']";
}

$book = preg_replace("/\.\.\//", "", $_POST["book"]);
$xmlFile = "resources/{$book}/main.xml";
if (is_file($xmlFile)) {
    $xml = simplexml_load_file($xmlFile);
    //$result = $xml->xpath("/sequence/scene[1]/shot[1]");
    $result = $xml->xpath($xpath);
    print $result[0]->asXML();
}

exit();

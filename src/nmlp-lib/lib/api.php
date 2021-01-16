<?php
if ($_POST["shot"] != "" && $_POST["scene"] != "" && $_POST["sequence"] != "" && $_POST["book"] != "") {
    print "<shot />";
} elseif ($_POST["scene"] != "" && $_POST["sequence"] != "" && $_POST["book"] != "") {
    print "<scene />";
} elseif ($_POST["sequence"] != "" && $_POST["book"] != "") {
    $xmlFile = HOME_DIR . "/resources/{$_POST["book"]}/{$_POST["sequence"]}.xml";
    if (is_file($xmlFile)) {
        $xml = simplexml_load_file($xmlFile);
        $result = $xml->xpath("/sequence/scene[1]/shot[1]");
        print $result[0]->asXML();
    }
} elseif ($_POST["book"] != "") {
    print "<book />";
}

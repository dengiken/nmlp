<?php namespace nmlp; include_once "nmlp-lib/etc/config.php"; ?>
<!doctype html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <?php Common::loadCSS() ?>
    <title><?= $title ?> | NMLP</title>
</head>
<body>
    <div id="background" class="layer"></div>
    <div id="three" class="layer"></div>
    <div id="foreground" class="layer"></div>
    <div id="controls" class="layer">
        <div id="caption">
            <div id="cap_name"></div>
            <div id="cap_body"></div>
            <div id="cap_next">▶</div>
        </div>
        <div id="selection"></div>
    </div>
    <div id="overlay" class="layer"></div>
    <div id="config" class="layer">
        <?php include_once(INCLUDE_DIR . "/configPanel.php"); ?>
    </div>
    <script type="text/javascript">
        let configWait = "";
    </script>
    <script type="text/javascript" src="apps/jquery.min.js"></script>
    <script type="text/javascript" src="js/global.js"></script>
    <!--<script type="text/javascript" src="apps/ammo.wasm.js"></script>-->
    <script type="module" src="js/common.js"></script>
    <?php Common::loadJS() ?>
</body>
</html>
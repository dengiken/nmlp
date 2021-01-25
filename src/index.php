<?php namespace nmlp; include_once "nmlp-lib/etc/config.php"; ?>
<!doctype html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <?php Common::loadCSS() ?>
    <title>Document</title>
</head>
<body>
    <div id="background" class="layer">bg</div>
    <div id="foreground" class="layer">fg</div>
    <div id="controls" class="layer">
        <div id="caption">
            <div id="cap_name"></div>
            <div id="cap_body"></div>
            <div id="cap_next">▶</div>
        </div>
        <div id="selection"></div>
    </div>
    <div id="overlay" class="layer">ov</div>
    <script type="text/javascript" src="apps/jquery.min.js"></script>
    <?php Common::loadJS() ?>
</body>
</html>

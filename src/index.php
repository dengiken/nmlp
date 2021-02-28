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
        <div id="configSensor">
            <div id="configPanel">
                <button id="openConfigButton">使い方・設定</button>
                <!--<button>ロード</button>-->
            </div>
        </div>
        <div id="configBody">
            <h2>使い方・設定</h2>
            <table>
                <thead>
                <tr>
                    <th>操作</th>
                    <th>キー</th>
                    <th>パッド</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>進む・決定</td>
                    <td class="keyConfig keyborad" data-button="kOk"></td>
                    <td class="keyConfig padButton" data-button="pOk"></td>
                </tr>
                <tr>
                    <td>上を選択</td>
                    <td class="keyConfig keyborad" data-button="kUp"></td>
                    <td class="keyConfig padButton" data-button="pUp"></td>
                </tr>
                <tr>
                    <td>下を選択</td>
                    <td class="keyConfig keyborad" data-button="kDn"></td>
                    <td class="keyConfig padButton" data-button="pDn"></td>
                </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                <tr>
                    <td>音量</td>
                    <td>
                        <input type="range">
                    </td>
                </tr>
                </tbody>
            </table>
            <button id="closeConfigButton">閉じる</button>
        </div>
    </div>
    <script type="text/javascript">
        let nmlp, nmlp3, userconf, configWait = "";
    </script>
    <script type="text/javascript" src="apps/jquery.min.js"></script>
    <script type="text/javascript" src="apps/ammo.wasm.js"></script>
    <script type="module" src="js/common.js"></script>
    <script type="module" src="js/nmlp.js"></script>
    <script type="module" src="js/userconf.js"></script>
    <?php Common::loadJS() ?>
</body>
</html>

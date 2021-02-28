nmlp
========

#### Novel Markup Language (NML) Processor ####

### Instration ###

### Simple Example ###

### Release ###

nmlp(日本語）
===========

#### Novel Markup Language (NML) プロセッサ

簡単な記述でノベルゲームを表現できるNML及び、それを解釈するNMLプロセッサのリファレンス実装です。

### インストール ###

#### FTP等 ####

https://github.com/dengiken/nmlp/archive/master.zip

から、ダウンロードして解凍します。

nmlpを配置したいディレクトリに、src内のファイルとフォルダをアップロードしてください。

#### コマンドライン ####

```sh
# 例
git clone https://github.com/dengiken/nmlp.git
mv nmlp/src /var/www/nmlp
```
nmlp-lib/resoureces 直下にサンプルがあります。

### 実行例 ###
WEBブラウザで

http(s)://{your host}/nmlp/?example

にアクセスするとexampleが開始します。

また、

http(s)://{your host}/nmlp/?example&continue=1

で前回の続き（シーン単位で自動保存）から開始します。

### 簡単なサンプル ###

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<sequence id="SEQ1" title="example" public="true">
    <scene id="SCN1">
        <caption>サンプル1-1</caption>
        <caption>サンプル1-2</caption>
        <script>
            <![CDATA[
            nml.move("SCN2");
            ]]>
        </script>
    </scene>
    <scene id="SCN2">
        <caption>サンプル2-1</caption>
        <caption>サンプル2-2</caption>
    </scene>
</sequence>
```

### ご注意 ###
当プログラム本体は、MITライセンスで公開していますが、当プログラムで他者の著作物を利用する際にはその著作権を遵守していただくようお願いいたします。

### リリース ###

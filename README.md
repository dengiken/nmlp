nmlp
========

#### Novel Markup Language (NML) Processor ####

### Instration ###

### Simple Example ###

### Release ###

#### Novel Markup Language (NML) プロセッサ

簡単な記述でノベルゲームを表現できるNML及び、それを解釈するNMLプロセッサのリファレンス実装です。

### インストール ###

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

### リリース ###

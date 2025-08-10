# scrapboxのTypescript APIクライアント

## Doc
API Doc: [Scrapbox REST APIの一覧](https://scrapbox.io/scrapboxlab/Scrapbox_REST_API%E3%81%AE%E4%B8%80%E8%A6%A7)

※API doc自体がScrapbox上のページで表現されている


ResponseSchemaの定義では、nullだったりundefinedを返す可能性があるものはすべて`.nullable().optional()`をつける。API Docを実際は異なることがある

## ディレクトリ構成

`./src/lib/rest-api`: REST APIを叩くヘルパ

`./src/client`: APIクライアントの実装。

`./sandbox`: APIクライアントを使ったサンプルコード. `pnpm tsx sandbox/hoge.ts` で実行する

## API クライアントの定義方法

基本的に1エンドポイントは1ファイルに対応する。

そのファイルの中で、以下のことを定義する。
- エンドポイントを呼び出す関数
- ParamsSchema: エンドポイントを呼び出す関数の引数のスキーマ
- ResponseSchema

## エンドポイントファイル追加編集する際には必ず既存実装を参考にすること

追加編集作業に取り掛かる前に、`./src/client/pages`以下のファイルを列挙し、いくつかのエンドポイントに対応するファイルをよく読んで詳細を把握する必要があります。
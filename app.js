const express = require("express");
const app = express();
const pg = require("pg");
app.use(express.urlencoded({extended: true}));

// posticoの情報に書き換え
var pgPool = new pg.Pool({
  database: "hogehoge",
  user: "natsu08",
  password: "", //posticoでは無し
  host: "localhost",
  port: 5432,
});

// スコア順に10人分取る
app.get("/hoge", function (req, res) {
  res.send("Good Morning EveryOne!!");
});

// ゲーム終了時に呼んでランキング
app.post("/create", function (req, res) {
  console.log(req.body);
  var query = {
    text:
    'INSERT INTO "public"."ranking"("id", "user_name", "score") VALUES($1, $2, $3) RETURNING "id", "user_name", "score"',
    values:[req.body.id, req.body.user_name, req.body.score]
  };

  pgPool.connect(function (err, client) {
    if (err) {
      console.log(err);
    } else {
      client
        .query(query)
        .then(() => {
          res.send("Data Created.");
        })
        .catch((e) => {
          console.error(e.stack);
          res.send("Data Faild." + e);
        });
    }
  });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
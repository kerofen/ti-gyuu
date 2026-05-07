"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const START_AFFECTION = 12;
const MAX_AFFECTION = 100;

const scenes = [
  {
    id: "opening",
    speaker: "私",
    expression: "neutral",
    voice: "opening",
    text: "5月24日、土曜日。秋葉原の牛丼店で、私はいつものカウンター席に座っていた。",
    next: "meet"
  },
  {
    id: "meet",
    speaker: "チー牛くん",
    expression: "shy",
    voice: "meet",
    text: "ぼ、ぼぼぼくと、ち、ちょっとだけ話してくれないかな。チーズ牛丼、好きって聞こえたから……。",
    next: "choice_food"
  },
  {
    id: "choice_food",
    speaker: "チー牛くん",
    expression: "shy",
    voice: "choice-food",
    text: "あ、あの……チーズ牛丼って、やっぱり変かな？",
    choices: [
      {
        label: "うん、私も好き。おすすめ聞かせて",
        delta: 18,
        mood: "blush",
        voice: "response-food-1",
        response: "ほんと？ えへへ……じゃ、じゃあ温玉を乗せると、すごく幸せなんだ。"
      },
      {
        label: "別に普通じゃない？",
        delta: 4,
        mood: "neutral",
        voice: "response-food-2",
        response: "そ、そうだよね。普通……だよね。"
      },
      {
        label: "急にどうしたの？大丈夫？",
        delta: 10,
        mood: "shy",
        voice: "response-food-3",
        response: "ご、ごめん。ちょっと緊張して、確認したくなっただけ。"
      },
      {
        label: "私は軽めのメニューにするかな",
        delta: -12,
        mood: "sad",
        severe: true,
        voice: "response-food-4",
        response: "そっか……やっぱり重いよね、ぼくも。"
      }
    ],
    next: "after_food"
  },
  {
    id: "after_food",
    speaker: "私",
    expression: "neutral",
    voice: "after-food",
    text: "彼はメニュー表を両手で持ったまま、ちらちらとこちらの反応を見ている。",
    next: "choice_hobby"
  },
  {
    id: "choice_hobby",
    speaker: "チー牛くん",
    expression: "neutral",
    voice: "choice-hobby",
    text: "ぼ、僕、こういうお店のメニューを眺めるのが好きで……へ、変だよね。",
    choices: [
      {
        label: "値段や組み合わせを見るの楽しいよね",
        delta: 17,
        mood: "blush",
        voice: "response-hobby-1",
        response: "そ、そう！ 限定メニューの流れとか、見てるだけで物語があるんだ。"
      },
      {
        label: "詳しいんだね。今のおすすめは？",
        delta: 13,
        mood: "shy",
        voice: "response-hobby-2",
        response: "おすすめ……！ えっと、今日はチーズにねぎ玉が強いと思う。"
      },
      {
        label: "まあ、暇つぶしにはなるよね",
        delta: -4,
        mood: "sad",
        voice: "response-hobby-3",
        response: "ひ、暇つぶし……うん、そういう感じでもあるかも。"
      },
      {
        label: "それより早く注文しよ",
        delta: -15,
        mood: "sad",
        severe: true,
        voice: "response-hobby-4",
        response: "ご、ごめん。話すの、遅いよね。"
      }
    ],
    next: "choice_anxiety"
  },
  {
    id: "choice_anxiety",
    speaker: "チー牛くん",
    expression: "sad",
    voice: "choice-anxiety",
    text: "い、いやだったかな……。ぼ、僕なんかと話してて楽しくなかったよね……。",
    choices: [
      {
        label: "そんなことないよ。私は楽しい",
        delta: 20,
        mood: "blush",
        voice: "response-anxiety-1",
        response: "……う、嬉しい。ちゃんと目を見て言ってくれるの、助かる。"
      },
      {
        label: "不安なら、少しずつ話そう",
        delta: 15,
        mood: "shy",
        voice: "response-anxiety-2",
        response: "少しずつ……それなら、ぼくにもできるかも。"
      },
      {
        label: "悲しいこと言わないで。大丈夫だよ",
        delta: 9,
        mood: "neutral",
        voice: "response-anxiety-3",
        response: "うん……ありがとう。言い方、困らせちゃったね。"
      },
      {
        label: "じゃあ、またね。元気出して",
        delta: -24,
        mood: "angry",
        severe: true,
        voice: "response-anxiety-4",
        response: "嘘だ！ 絶対そんなこと思ってない！ もういい、帰る！"
      }
    ],
    next: "midpoint"
  },
  {
    id: "midpoint",
    speaker: "私",
    expression: "neutral",
    voice: "midpoint",
    text: "券売機の音、湯気、オレンジ色の看板。短い会話なのに、店内の時間が少しゆっくり流れた。",
    next: "choice_memory"
  },
  {
    id: "choice_memory",
    speaker: "チー牛くん",
    expression: "shy",
    voice: "choice-memory",
    text: "じ、実は今日、誰かと食べる練習をしようと思って来たんだ。",
    choices: [
      {
        label: "練習じゃなくて、もうちゃんと会話だよ",
        delta: 18,
        mood: "blush",
        voice: "response-memory-1",
        response: "そっか……ぼく、今ちゃんと会話できてるんだ。"
      },
      {
        label: "その勇気、すごくいいと思う",
        delta: 16,
        mood: "blush",
        voice: "response-memory-2",
        response: "勇気……そんなふうに言われたの、初めてかも。"
      },
      {
        label: "次はもっと混んでない店にしよっか",
        delta: 8,
        mood: "neutral",
        voice: "response-memory-3",
        response: "あ、うん。静かなところなら、もっと話せる気がする。"
      },
      {
        label: "練習台だったんだ？",
        delta: -22,
        mood: "sad",
        severe: true,
        voice: "response-memory-4",
        response: "ち、違う！ そんなつもりじゃ……ごめん。"
      }
    ],
    next: "choice_final"
  },
  {
    id: "choice_final",
    speaker: "チー牛くん",
    expression: "blush",
    voice: "choice-final",
    text: "も、もし迷惑じゃなければ……また一緒に、チーズ牛丼食べてくれる？",
    choices: [
      {
        label: "もちろん。次は私から誘うね",
        delta: 24,
        mood: "blush",
        voice: "response-final-1",
        response: "えっ……次があるんだ。ぼく、今日のこと忘れない。"
      },
      {
        label: "うん。おすすめトッピングも教えて",
        delta: 18,
        mood: "blush",
        voice: "response-final-2",
        response: "任せて。次までに、完璧な組み合わせを考えておく。"
      },
      {
        label: "予定が合えばね",
        delta: -6,
        mood: "sad",
        voice: "response-final-3",
        response: "そ、そうだよね。無理にとは言わないよ。"
      },
      {
        label: "今日だけの思い出にしよ",
        delta: -30,
        mood: "angry",
        severe: true,
        voice: "response-final-4",
        response: "……わかった。優しくされたって、勝手に勘違いしただけだよね。"
      }
    ],
    next: "ending_check"
  }
];

const sceneMap = new Map(scenes.map((scene) => [scene.id, scene]));
const characterAssets = {
  neutral: "/assets/characters/chi-gyu-neutral.png",
  shy: "/assets/characters/chi-gyu-shy.png",
  sad: "/assets/characters/chi-gyu-sad.png",
  angry: "/assets/characters/chi-gyu-angry.png",
  blush: "/assets/characters/chi-gyu-blush.png"
};

const routeCharacterAssets = {
  classic: {
    neutral: "/assets/characters/classic-neutral.png",
    shy: "/assets/characters/classic-shy.png",
    sad: "/assets/characters/classic-sad.png",
    angry: "/assets/characters/classic-angry.png",
    blush: "/assets/characters/classic-blush.png"
  },
  analyst: {
    neutral: "/assets/characters/analyst-neutral.png",
    shy: "/assets/characters/analyst-shy.png",
    sad: "/assets/characters/analyst-sad.png",
    angry: "/assets/characters/analyst-angry.png",
    blush: "/assets/characters/analyst-blush.png"
  },
  night: {
    neutral: "/assets/characters/night-neutral.png",
    shy: "/assets/characters/night-shy.png",
    sad: "/assets/characters/night-sad.png",
    angry: "/assets/characters/night-angry.png",
    blush: "/assets/characters/night-blush.png"
  }
};

const endingImageAssets = {
  classic: {
    good: "/assets/endings/classic-good.png",
    bad: "/assets/endings/classic-bad.png"
  },
  analyst: {
    good: "/assets/endings/analyst-good.png",
    bad: "/assets/endings/analyst-bad.png"
  },
  night: {
    good: "/assets/endings/night-good.png",
    bad: "/assets/endings/night-bad.png"
  }
};

const routes = [
  {
    id: "classic",
    name: "チー牛くん",
    routeTitle: "王道チーズ牛丼派",
    catchCopy: "緊張しながらも、好きなものをまっすぐ話したい。",
    curiosity: "おすすめトッピングを聞くと、一気に距離が縮まる。",
    difficulty: "標準",
    startAffection: START_AFFECTION,
    cardImage: "/assets/routes/route-classic.png",
    choiceBias: {
      choice_food: { 0: 4, 2: 2 },
      choice_anxiety: { 0: 3 },
      choice_final: { 0: 3 }
    }
  },
  {
    id: "analyst",
    name: "考察系チー牛くん",
    routeTitle: "ロジカル考察派",
    catchCopy: "値段、限定、組み合わせ。自分だけの牛丼理論を持っている。",
    curiosity: "理屈がピタッとハマる返答で喜ぶ。ズレると早口で論破してくる。",
    difficulty: "難しい",
    startAffection: 10,
    cardImage: "/assets/routes/route-analyst.png",
    choiceBias: {
      choice_food: { 0: 7 },
      choice_hobby: { 0: 8 },
      choice_anxiety: { 1: 5 },
      choice_memory: { 0: 6 },
      choice_final: { 0: 7 }
    }
  },
  {
    id: "night",
    name: "チー牛チーマシくん",
    routeTitle: "追いチーズ豪快派",
    catchCopy: "牛丼をチーズで埋め尽くし、混ぜて、最後にもう一度かけたい。",
    curiosity: "チーズ増しの熱量に乗るほどテンションが上がる。",
    difficulty: "豪快",
    startAffection: 14,
    cardImage: "/assets/routes/route-night.png",
    choiceBias: {
      choice_food: { 0: 6, 1: 5 },
      choice_hobby: { 0: 7 },
      choice_anxiety: { 0: 5 },
      choice_memory: { 0: 6 },
      choice_final: { 0: 8 }
    }
  }
];

const routeMap = new Map(routes.map((route) => [route.id, route]));
const DEFAULT_ROUTE_ID = routes[0].id;

const routeStoryOverrides = {
  analyst: {
    opening: {
      voice: null,
      text: "5月24日、土曜日。秋葉原の牛丼店で、私はやけに書き込みの多いメニュー表を見つけた。"
    },
    meet: {
      voice: null,
      text: "す、すみません。いまの限定チーズ牛丼、価格と満足度の期待値がかなり歪んでて……少しだけ考察、聞いてもらえますか。"
    },
    choice_food: {
      voice: null,
      text: "チーズ牛丼は感情論じゃなくて、価格、満腹度、再現性の三点で評価すべきなんです。あなたはどう見ます？",
      choices: [
        {
          label: "価格と満足度の交点がチーズなんだね",
          delta: 17,
          mood: "blush",
          voice: null,
          response: "そ、それです！ 交点という言い方、かなり解像度が高い。今の返答は理論値に近いです。"
        },
        {
          label: "限定なら希少性も評価に入るよね",
          delta: 13,
          mood: "shy",
          voice: null,
          response: "希少性……そこに気づきますか。期間限定は味だけじゃなく、体験コストも乗るんです。"
        },
        {
          label: "おいしければ何でもよくない？",
          delta: -16,
          mood: "angry",
          voice: null,
          response: "いや、それは論点が粗いです。おいしいの内訳を分解しないと、再注文の精度が落ちます。"
        },
        {
          label: "普通の牛丼で十分だと思う",
          delta: -24,
          mood: "angry",
          severe: true,
          voice: null,
          response: "十分、という言葉は危険です。比較対象も条件も置かずに結論だけ出すのは、雑すぎます。"
        }
      ]
    },
    after_food: {
      voice: null,
      text: "彼のノートには、値段、満腹感、限定性、チーズの伸びまで細かく記録されていた。"
    },
    choice_hobby: {
      voice: null,
      text: "注文の順番にも最適解があります。券売機、席、提供時間、溶け具合……全部つながってるんです。",
      choices: [
        {
          label: "提供時間まで含めて一つの式なんだ",
          delta: 18,
          mood: "blush",
          voice: null,
          response: "式！ まさに式です。食べる前から勝負は始まっている、という話がやっと通じた。"
        },
        {
          label: "今のおすすめ構成を教えて",
          delta: 12,
          mood: "shy",
          voice: null,
          response: "今日はチーズ、ねぎ、温玉。塩味と油分の補正がきれいに噛み合います。"
        },
        {
          label: "考えすぎると疲れない？",
          delta: -12,
          mood: "sad",
          voice: null,
          response: "疲れるかどうかではなく、納得できるかです。そこを混同すると会話が崩れます。"
        },
        {
          label: "早く決めないと迷惑だよ",
          delta: -22,
          mood: "angry",
          severe: true,
          voice: null,
          response: "決めています。むしろ根拠なく急ぐほうが、後続の満足度を毀損します。"
        }
      ]
    },
    choice_anxiety: {
      voice: null,
      text: "……でも、こういう話をすると大体引かれます。説明が長いって言われるし、早口だって。",
      choices: [
        {
          label: "早口でも中身があるから聞きたい",
          delta: 14,
          mood: "shy",
          voice: null,
          response: "中身……そこを見てくれるなら、話す速度は少し落とせます。たぶん。"
        },
        {
          label: "結論から言って、理由をあとで聞かせて",
          delta: 18,
          mood: "blush",
          voice: null,
          response: "結論ファースト。いい整理です。あなた、会話設計がうまいですね。"
        },
        {
          label: "うん、ちょっと難しいかも",
          delta: -10,
          mood: "sad",
          voice: null,
          response: "難しい、で止めると改善点が不明です。どの変数が重かったですか。"
        },
        {
          label: "論破しようとしてるみたい",
          delta: -20,
          mood: "angry",
          severe: true,
          voice: null,
          response: "論破ではなく検証です。そこを同一視されると、こちらも訂正せざるを得ません。"
        }
      ]
    },
    midpoint: {
      voice: null,
      text: "早口の奥にあるのは、勝ちたい気持ちではなく、自分の考えを一度でいいから正確に受け取ってほしい願いだった。"
    },
    choice_memory: {
      voice: null,
      text: "この表、実は誰かに見せたくて作りました。自分だけの理論が、ただの変なこだわりじゃないって確かめたくて。",
      choices: [
        {
          label: "その理論、二人で検証しよう",
          delta: 19,
          mood: "blush",
          voice: null,
          response: "二人で……サンプル数が増える。いや、それ以上に、少し嬉しいです。"
        },
        {
          label: "こだわりが見える表って面白い",
          delta: 14,
          mood: "shy",
          voice: null,
          response: "面白い、ですか。変じゃなくて、面白い。かなり大きな差があります。"
        },
        {
          label: "もっと短くまとめたら伝わりそう",
          delta: 5,
          mood: "neutral",
          voice: null,
          response: "要約版……必要ですね。情報量を落とさずに圧縮する方法を考えます。"
        },
        {
          label: "結局、自慢したいだけ？",
          delta: -26,
          mood: "angry",
          severe: true,
          voice: null,
          response: "違います。自慢なら、こんなに不安そうに確認しません。前提が間違っています。"
        }
      ]
    },
    choice_final: {
      voice: null,
      text: "次に会うなら、二人用の最適解を組んでもいいですか。あなたの好みも変数に入れたい。",
      choices: [
        {
          label: "私の好み込みで最適解を作って",
          delta: 24,
          mood: "blush",
          voice: null,
          response: "了解です。単独最適じゃなく、二人の最適解。これはかなり強いテーマです。"
        },
        {
          label: "次は私もノート持ってくるね",
          delta: 17,
          mood: "blush",
          voice: null,
          response: "ノート……本気ですね。では比較表の項目から一緒に決めましょう。"
        },
        {
          label: "ほどほどにね",
          delta: -7,
          mood: "sad",
          voice: null,
          response: "ほどほど、は曖昧ですが……たぶん配慮の言葉ですよね。受け取ります。"
        },
        {
          label: "理屈っぽい人は苦手かも",
          delta: -30,
          mood: "angry",
          severe: true,
          voice: null,
          response: "そうですか。では、この会話の継続条件は満たせません。帰ります。"
        }
      ]
    }
  },
  night: {
    opening: {
      voice: null,
      text: "5月24日、土曜日。秋葉原の牛丼店で、私は山のようなチーズ追加券を握る青年を見かけた。"
    },
    meet: {
      voice: null,
      text: "なあ……チーズ、増せるだけ増す派？ 俺、牛丼がチーズで見えなくなる瞬間が一番好きなんだ。"
    },
    choice_food: {
      voice: null,
      text: "牛丼をチーズで埋め尽くして、ぐちゃっと混ぜて、最後に追いチーズ。これ、わかる？",
      choices: [
        {
          label: "ごはんが見えないくらい増そう",
          delta: 20,
          mood: "blush",
          voice: null,
          response: "それ！ 白い雪原みたいにしてから掘るんだよ。今ので完全に伝わった。"
        },
        {
          label: "混ぜてから追いチーズ、強いね",
          delta: 18,
          mood: "blush",
          voice: null,
          response: "強い。追いチーズは締めじゃない、第二開幕なんだ。わかってるな。"
        },
        {
          label: "少しだけでよくない？",
          delta: -16,
          mood: "sad",
          voice: null,
          response: "少しだけ……それだと牛丼がまだ牛丼の顔をしてる。俺は埋めたいんだ。"
        },
        {
          label: "チーズ抜きの方がさっぱりしてる",
          delta: -30,
          mood: "angry",
          severe: true,
          voice: null,
          response: "抜く？ チーズを？ それはもう俺の席で言っちゃいけないやつだ。"
        }
      ]
    },
    after_food: {
      voice: null,
      text: "彼は追加券を扇のように並べ、どのタイミングでチーズを重ねるか真剣に考えている。"
    },
    choice_hobby: {
      voice: null,
      text: "理想は、まず全面チーズ、次に混ぜる、肉汁を吸わせる、最後にもう一回かける。豪快だけど繊細なんだ。",
      choices: [
        {
          label: "層にするから味が変わるんだね",
          delta: 18,
          mood: "blush",
          voice: null,
          response: "そう！ チーズは量だけじゃない、層。最初と最後で表情が変わるんだよ。"
        },
        {
          label: "追いチーズのタイミングが大事そう",
          delta: 14,
          mood: "shy",
          voice: null,
          response: "大事。熱が残ってるギリギリで落とす。そこが一番伸びる。"
        },
        {
          label: "カロリーすごそう",
          delta: -8,
          mood: "sad",
          voice: null,
          response: "まあ、すごい。でも今日はカロリーじゃなくて覚悟の話をしてる。"
        },
        {
          label: "混ぜたら見た目が悪くない？",
          delta: -22,
          mood: "angry",
          severe: true,
          voice: null,
          response: "見た目で止まるなよ。ごちゃまぜの先にしかない一体感があるんだ。"
        }
      ]
    },
    choice_anxiety: {
      voice: null,
      text: "……引いた？ だよな。チーズで埋めたいとか、普通に言ったら重いよな。",
      choices: [
        {
          label: "重いくらいが楽しそう",
          delta: 18,
          mood: "blush",
          voice: null,
          response: "重いくらいがいい……その言い方、めちゃくちゃ救われる。"
        },
        {
          label: "好きなものに全力なのいいと思う",
          delta: 15,
          mood: "shy",
          voice: null,
          response: "全力、か。そう言われると、ただの大盛りじゃなくて済むな。"
        },
        {
          label: "食べ切れる量ならいいんじゃない？",
          delta: 7,
          mood: "neutral",
          voice: null,
          response: "そこはもちろん。豪快と無責任は違う。最後までいく。"
        },
        {
          label: "ちょっと胃もたれしそう",
          delta: -20,
          mood: "sad",
          severe: true,
          voice: null,
          response: "胃もたれ……現実を言われると急に弱い。いや、でも俺は食べたい。"
        }
      ]
    },
    midpoint: {
      voice: null,
      text: "豪快な言葉のわりに、彼は追加券の端をそっと揃えていた。好きなものを笑われたくない手つきだった。"
    },
    choice_memory: {
      voice: null,
      text: "いつかさ、牛丼をチーズで真っ白にして、混ぜて、最後にまた白くするのを誰かとやりたかったんだ。",
      choices: [
        {
          label: "その儀式、隣で見たい",
          delta: 19,
          mood: "blush",
          voice: null,
          response: "儀式って言った？ いいな、それ。俺の中の正式名称にする。"
        },
        {
          label: "二人なら限界盛りも楽しそう",
          delta: 16,
          mood: "blush",
          voice: null,
          response: "二人で限界盛り……字面がもう強い。最高かもしれない。"
        },
        {
          label: "写真だけなら見てみたい",
          delta: 3,
          mood: "neutral",
          voice: null,
          response: "写真だけか。まあ最初はそこからでもいい。見たらたぶん食べたくなる。"
        },
        {
          label: "一人でやった方がよくない？",
          delta: -26,
          mood: "angry",
          severe: true,
          voice: null,
          response: "一人でやれるから、誰かとやりたいって話をしてるんだよ。"
        }
      ]
    },
    choice_final: {
      voice: null,
      text: "次、俺とチーマシ限界盛りしてくれる？ 牛丼が見えなくなるまで、ちゃんと付き合ってほしい。",
      choices: [
        {
          label: "限界まで増して、一緒に混ぜよう",
          delta: 25,
          mood: "blush",
          voice: null,
          response: "決まりだ。混ぜる瞬間、絶対楽しい。最後の追いチーズは半分ずつな。"
        },
        {
          label: "追いチーズ担当やるね",
          delta: 18,
          mood: "blush",
          voice: null,
          response: "追いチーズ担当……重要ポジションだぞ。任せたら、たぶん俺かなり喜ぶ。"
        },
        {
          label: "普通盛りからなら",
          delta: -5,
          mood: "sad",
          voice: null,
          response: "普通盛り……入口としてはありか。そこから増せばいいもんな。"
        },
        {
          label: "私はチーズ少なめでいいかな",
          delta: -30,
          mood: "angry",
          severe: true,
          voice: null,
          response: "少なめ……そっか。俺の山には、一緒に登ってくれないんだな。"
        }
      ]
    }
  }
};

const routeEndingOverrides = {
  analyst: {
    good: {
      voice: null,
      text: "君の返答で、仮説が更新されました。次は二人の好みを変数に入れて、最高の組み合わせを作りたいです。"
    },
    normal: {
      voice: null,
      text: "今日はサンプル数1として、かなり有意義でした。次があれば、もう少し短く、でも正確に話します。"
    },
    bad: {
      voice: null,
      text: "論点が最後まで噛み合いませんでした。これ以上続けても、互いの期待値が下がるだけです。帰ります。"
    }
  },
  night: {
    good: {
      voice: null,
      text: "次は限界までチーズ増そう。混ぜて、埋めて、最後にもう一回かける。君となら絶対うまい。"
    },
    normal: {
      voice: null,
      text: "今日はありがとな。いきなり限界盛りは重かったかもだけど、次は一口だけでも付き合ってくれたら嬉しい。"
    },
    bad: {
      voice: null,
      text: "チーズ少なめって言われると、さすがにきつい。俺、今日は一人で増して帰るわ。"
    }
  }
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function assetPath(path) {
  return `${basePath}${path}`;
}

const bgmAssets = {
  normal: "/assets/audio/bgm/normal.mp3",
  sad: "/assets/audio/bgm/sad.mp3"
};

const sfxAssets = {
  uiClick: "/assets/audio/sfx/ui-click.mp3",
  choiceSelect: "/assets/audio/sfx/choice-select.mp3",
  affectionUp: "/assets/audio/sfx/affection-up.mp3",
  affectionDown: "/assets/audio/sfx/affection-down.mp3",
  timeout: "/assets/audio/sfx/timeout.mp3",
  successSting: "/assets/audio/sfx/success-sting.mp3",
  badSting: "/assets/audio/sfx/bad-sting.mp3",
  maleHappy: "/assets/audio/voice/male-happy.mp3",
  maleDespair: "/assets/audio/voice/male-despair.mp3"
};

function voicePath(voiceId) {
  return `/assets/audio/voice/${voiceId}.mp3`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getTimerLimit(dokiLevel) {
  if (dokiLevel >= 3) return 10;
  if (dokiLevel === 2) return 14;
  return 18;
}

function getDokiLevel(affection) {
  if (affection >= 70) return 3;
  if (affection >= 40) return 2;
  return 1;
}

function getEnding(affection, severeMistakes, timeouts) {
  if (affection <= 0 || severeMistakes >= 2 || timeouts >= 2) return "bad";
  if (affection >= 70) return "good";
  if (affection >= 40) return "normal";
  return "bad";
}

function routeSpeaker(speaker, route) {
  if (!speaker) return "";
  return speaker === "チー牛くん" ? route.name : speaker;
}

function getRouteChoiceBonus(route, sceneId, choiceIndex) {
  return route.choiceBias?.[sceneId]?.[choiceIndex] ?? 0;
}

function getCharacterSource(routeId, expression) {
  return routeCharacterAssets[routeId]?.[expression] ?? characterAssets[expression] ?? characterAssets.neutral;
}

function routeVoiceId(routeId, sceneId) {
  if (!routeStoryOverrides[routeId]?.[sceneId]) return null;
  return `route-${routeId}-${sceneId.replace(/_/g, "-")}`;
}

function routeChoiceVoiceId(routeId, sceneId, choiceIndex) {
  if (!routeStoryOverrides[routeId]?.[sceneId]?.choices?.[choiceIndex]) return null;
  return `route-${routeId}-${sceneId.replace(/_/g, "-")}-response-${choiceIndex + 1}`;
}

function routeEndingVoiceId(routeId, type) {
  if (!routeEndingOverrides[routeId]?.[type]) return null;
  return `route-${routeId}-ending-${type}`;
}

function getRouteScene(routeId, sceneId) {
  const scene = sceneMap.get(sceneId);
  const override = routeStoryOverrides[routeId]?.[sceneId];
  if (!scene || !override) return scene;
  const choices = override.choices
    ? override.choices.map((choice, index) => ({
        ...choice,
        voice: choice.voice ?? routeChoiceVoiceId(routeId, sceneId, index)
      }))
    : scene.choices;

  return {
    ...scene,
    ...override,
    voice: override.voice ?? routeVoiceId(routeId, sceneId),
    choices
  };
}

function endingScene(type, routeId = DEFAULT_ROUTE_ID) {
  let scene;
  if (type === "good") {
    scene = {
      speaker: "チー牛くん",
      expression: "blush",
      title: "成功エンド",
      voice: "ending-good",
      text: "ありがとう。次は、ぼくがちゃんと誘う。君と食べるチーズ牛丼、きっと一番おいしいから。"
    };
  } else if (type === "normal") {
    scene = {
      speaker: "チー牛くん",
      expression: "neutral",
      title: "通常エンド",
      voice: "ending-normal",
      text: "今日はありがとう。まだ少し緊張するけど、また会えたら……その時は、もう少し話せると思う。"
    };
  } else {
    scene = {
      speaker: "チー牛くん",
      expression: "angry",
      title: "失敗エンド",
      voice: "ending-bad",
      text: "嘘だ！ 絶対そんなこと思ってない！ もういい、帰る！"
    };
  }

  const override = routeEndingOverrides[routeId]?.[type];

  return {
    ...scene,
    ...override,
    image: endingImageAssets[routeId]?.[type] ?? null,
    voice: override?.voice ?? routeEndingVoiceId(routeId, type) ?? scene.voice
  };
}

export default function Home() {
  const [screen, setScreen] = useState("title");
  const [selectedRouteId, setSelectedRouteId] = useState(DEFAULT_ROUTE_ID);
  const [currentId, setCurrentId] = useState("opening");
  const [affection, setAffection] = useState(START_AFFECTION);
  const [expression, setExpression] = useState("neutral");
  const [severeMistakes, setSevereMistakes] = useState(0);
  const [timeouts, setTimeouts] = useState(0);
  const [history, setHistory] = useState([]);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [responseScene, setResponseScene] = useState(null);
  const [ending, setEnding] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [remaining, setRemaining] = useState(18);
  const timerRef = useRef(null);
  const bgmRef = useRef(null);
  const bgmModeRef = useRef(null);
  const voiceRef = useRef(null);
  const endingSfxRef = useRef(null);

  const selectedRoute = routeMap.get(selectedRouteId) ?? routes[0];
  const selectedRouteName = selectedRoute.name;
  const currentScene = useMemo(() => getRouteScene(selectedRouteId, currentId), [currentId, selectedRouteId]);
  const dokiLevel = getDokiLevel(affection);
  const activeEnding = useMemo(() => (ending ? endingScene(ending, selectedRouteId) : null), [ending, selectedRouteId]);
  const visibleScene = activeEnding ?? responseScene ?? currentScene;
  const hasChoices = Boolean(screen === "game" && !ending && !responseScene && currentScene?.choices?.length);
  const timerLimit = useMemo(() => getTimerLimit(dokiLevel), [dokiLevel]);
  const progressLabel = ending ? "0:21 / 0:21" : `0:${String(Math.min(history.length * 2 + 3, 21)).padStart(2, "0")} / 0:21`;
  const endingImageSource = activeEnding?.image ?? null;
  const showCharacter = screen === "game" && !endingImageSource;
  const visibleSpeaker = routeSpeaker(visibleScene?.speaker, selectedRoute);
  const characterSource = getCharacterSource(selectedRoute.id, expression);

  const playSfx = useCallback(
    (key, volume = 0.72) => {
      if (!audioEnabled || muted) return;
      const src = sfxAssets[key];
      if (!src) return;
      const audio = new Audio(assetPath(src));
      audio.volume = volume;
      audio.play().catch(() => {});
    },
    [audioEnabled, muted]
  );

  const playVoice = useCallback(
    (voiceId) => {
      if (voiceRef.current) {
        voiceRef.current.pause();
        voiceRef.current.currentTime = 0;
      }
      if (!audioEnabled || muted || !voiceId) return;
      const audio = new Audio(assetPath(voicePath(voiceId)));
      audio.volume = 0.92;
      voiceRef.current = audio;
      audio.play().catch(() => {});
    },
    [audioEnabled, muted]
  );

  const playBgm = useCallback(
    (mode) => {
      if (!audioEnabled || muted) return;
      if (bgmModeRef.current === mode && bgmRef.current) {
        bgmRef.current.play().catch(() => {});
        return;
      }

      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }

      const audio = new Audio(assetPath(bgmAssets[mode]));
      audio.loop = true;
      audio.volume = mode === "sad" ? 0.28 : 0.24;
      bgmRef.current = audio;
      bgmModeRef.current = mode;
      audio.play().catch(() => {});
    },
    [audioEnabled, muted]
  );

  const enableAudio = useCallback(() => {
    setAudioEnabled(true);
    setMuted(false);
  }, []);

  const resetRun = useCallback((route) => {
    setCurrentId("opening");
    setAffection(route.startAffection);
    setExpression("neutral");
    setSevereMistakes(0);
    setTimeouts(0);
    setHistory([]);
    setLastFeedback(null);
    setResponseScene(null);
    setEnding(null);
    setShowLog(false);
    setShowMenu(false);
    setAutoMode(false);
    setRemaining(18);
    endingSfxRef.current = null;
  }, []);

  const startTitle = useCallback(() => {
    enableAudio();
    setScreen("route");
  }, [enableAudio]);

  const startRoute = useCallback(
    (routeId) => {
      const nextRoute = routeMap.get(routeId) ?? routes[0];
      setSelectedRouteId(nextRoute.id);
      resetRun(nextRoute);
      setScreen("game");
      playSfx("choiceSelect", 0.5);
    },
    [playSfx, resetRun]
  );

  const returnToRoutes = useCallback(() => {
    setScreen("route");
    setShowLog(false);
    setShowMenu(false);
    setAutoMode(false);
    setResponseScene(null);
    setEnding(null);
    playSfx("uiClick", 0.42);
  }, [playSfx]);

  const pushHistory = useCallback((speaker, text) => {
    setHistory((items) => [...items, { speaker, text }].slice(-40));
  }, []);

  const goToScene = useCallback(
    (nextId, score = affection) => {
      setCurrentId(nextId);
      const nextScene = getRouteScene(selectedRouteId, nextId);
      if (nextScene?.expression) setExpression(nextScene.expression);
      if (nextScene?.choices?.length) {
        setRemaining(getTimerLimit(getDokiLevel(score)));
      }
    },
    [affection, selectedRouteId]
  );

  const endGame = useCallback(
    (forcedType) => {
      const activeRoute = routeMap.get(selectedRouteId) ?? routes[0];
      const result = forcedType ?? getEnding(affection, severeMistakes, timeouts);
      const scene = endingScene(result, selectedRouteId);
      setEnding(result);
      setExpression(scene.expression);
      pushHistory(routeSpeaker(scene.speaker, activeRoute), scene.text);
    },
    [affection, pushHistory, selectedRouteId, severeMistakes, timeouts]
  );

  const advance = useCallback(() => {
    if (screen !== "game" || showLog || showMenu || hasChoices || ending) return;
    const activeRoute = routeMap.get(selectedRouteId) ?? routes[0];
    playSfx("uiClick", 0.42);
    if (responseScene) {
      const nextId = responseScene.nextId;
      setResponseScene(null);
      setLastFeedback(null);

      if (responseScene.endingType || nextId === "ending_check") {
        endGame(responseScene.endingType);
        return;
      }

      goToScene(nextId, responseScene.affectionAfter);
      return;
    }

    if (!currentScene) return;

    pushHistory(routeSpeaker(currentScene.speaker, activeRoute), currentScene.text);

    if (currentScene.next === "ending_check") {
      endGame();
      return;
    }

    goToScene(currentScene.next);
    setLastFeedback(null);
  }, [currentScene, endGame, ending, goToScene, hasChoices, playSfx, pushHistory, responseScene, screen, selectedRouteId, showLog, showMenu]);

  const choose = useCallback(
    (choice, index) => {
      if (screen !== "game" || !currentScene || !hasChoices || ending) return;

      const activeRoute = routeMap.get(selectedRouteId) ?? routes[0];
      const routeBonus = getRouteChoiceBonus(activeRoute, currentScene.id, index);
      const totalDelta = choice.delta + routeBonus;
      const newAffection = clamp(affection + totalDelta, 0, MAX_AFFECTION);
      const newSevere = severeMistakes + (choice.severe ? 1 : 0);
      const feedback = {
        index: index + 1,
        delta: totalDelta,
        routeBonus,
        text: choice.response
      };

      playSfx("choiceSelect", 0.58);
      window.setTimeout(() => playSfx(totalDelta >= 0 ? "affectionUp" : "affectionDown", 0.66), 120);
      if (totalDelta >= 18) {
        window.setTimeout(() => playSfx("maleHappy", 0.68), 320);
      }
      if (choice.severe || totalDelta <= -20) {
        window.setTimeout(() => playSfx("maleDespair", 0.74), 320);
      }

      pushHistory(routeSpeaker(currentScene.speaker, activeRoute), currentScene.text);
      pushHistory("私", choice.label);
      pushHistory(activeRoute.name, choice.response);
      setAffection(newAffection);
      setSevereMistakes(newSevere);
      setExpression(choice.mood);
      setLastFeedback(feedback);

      setResponseScene({
        speaker: "チー牛くん",
        expression: choice.mood,
        voice: choice.voice,
        text: choice.response,
        nextId: currentScene.next,
        affectionAfter: newAffection,
        endingType:
          newAffection <= 0 || newSevere >= 2
            ? "bad"
            : currentScene.next === "ending_check"
              ? getEnding(newAffection, newSevere, timeouts)
              : null
      });
    },
    [affection, currentScene, ending, hasChoices, playSfx, pushHistory, screen, selectedRouteId, severeMistakes, timeouts]
  );

  const restart = useCallback(() => {
    const activeRoute = routeMap.get(selectedRouteId) ?? routes[0];
    resetRun(activeRoute);
    setScreen("game");
    playSfx("uiClick", 0.42);
  }, [playSfx, resetRun, selectedRouteId]);

  useEffect(() => {
    if (!hasChoices || ending || showLog || showMenu) {
      window.clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timerRef.current);
          const nextTimeouts = timeouts + 1;
          const nextAffection = clamp(affection - 16, 0, MAX_AFFECTION);
          setTimeouts(nextTimeouts);
          setLastFeedback({ index: 0, delta: -16, text: "沈黙が続いて、気まずさだけが残った。" });
          setAffection(nextAffection);
          setExpression("sad");
          playSfx("timeout", 0.7);
          pushHistory("私", "……。");
          pushHistory(selectedRouteName, "ご、ごめん。困らせたよね。");
          setResponseScene({
            speaker: "チー牛くん",
            expression: "sad",
            voice: "timeout",
            text: "ご、ごめん。困らせたよね。",
            nextId: currentScene.next,
            affectionAfter: nextAffection,
            endingType:
              nextTimeouts >= 2 || nextAffection <= 0
                ? "bad"
                : currentScene.next === "ending_check"
                  ? getEnding(nextAffection, severeMistakes, nextTimeouts)
                  : null
          });
          return timerLimit;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerRef.current);
  }, [affection, currentScene, ending, hasChoices, playSfx, pushHistory, selectedRouteName, severeMistakes, showLog, showMenu, timerLimit, timeouts]);

  useEffect(() => {
    if (!autoMode || hasChoices || ending || showLog || showMenu) return;
    const autoTimer = window.setTimeout(advance, 1650);
    return () => window.clearTimeout(autoTimer);
  }, [advance, autoMode, ending, hasChoices, showLog, showMenu]);

  useEffect(() => {
    const mode = ending === "bad" || expression === "sad" || expression === "angry" ? "sad" : "normal";
    playBgm(mode);
  }, [ending, expression, playBgm]);

  useEffect(() => {
    if (screen !== "game") return;
    playVoice(visibleScene?.voice);
  }, [playVoice, screen, visibleScene?.voice]);

  useEffect(() => {
    if (!ending || endingSfxRef.current === ending) return;
    endingSfxRef.current = ending;
    if (ending === "good") {
      playSfx("successSting", 0.7);
      window.setTimeout(() => playSfx("maleHappy", 0.72), 550);
    } else if (ending === "bad") {
      playSfx("badSting", 0.74);
      window.setTimeout(() => playSfx("maleDespair", 0.76), 420);
    }
  }, [ending, playSfx]);

  useEffect(() => {
    if (!muted || !bgmRef.current) return;
    bgmRef.current.pause();
  }, [muted]);

  useEffect(() => {
    return () => {
      window.clearInterval(timerRef.current);
      if (bgmRef.current) bgmRef.current.pause();
      if (voiceRef.current) voiceRef.current.pause();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const numeric = Number(event.key);

      if (screen === "title") {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          startTitle();
        }
        return;
      }

      if (screen === "route") {
        if (event.key === "Escape") {
          setScreen("title");
          return;
        }
        if (numeric >= 1 && numeric <= routes.length) {
          startRoute(routes[numeric - 1].id);
        }
        return;
      }

      if (event.key === "Escape") {
        setShowLog(false);
        setShowMenu(false);
      }
      if (event.key.toLowerCase() === "l") setShowLog((value) => !value);
      if (event.key.toLowerCase() === "a") setAutoMode((value) => !value);
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        advance();
      }
      if (hasChoices && numeric >= 1 && numeric <= 4) {
        const choice = currentScene.choices[numeric - 1];
        if (choice) choose(choice, numeric - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advance, choose, currentScene, hasChoices, screen, startRoute, startTitle]);

  const timerPercent = hasChoices ? `${(remaining / timerLimit) * 100}%` : "100%";
  const affectionPercent = `${affection}%`;

  return (
    <main className="page-shell">
      <section className="game-stage" aria-label="チー牛くんとの恋愛シミュレーションゲーム">
        <div
          className="shop-background"
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 18%, transparent 78%, rgba(0, 0, 0, 0.18)), url("${assetPath("/assets/backgrounds/gyudon-house-evening.png")}")`
          }}
        />

        {screen === "title" ? <TitleScreen onStart={startTitle} /> : null}

        {screen === "route" ? (
          <RouteSelect routes={routes} selectedRouteId={selectedRouteId} onSelect={startRoute} onBack={() => setScreen("title")} />
        ) : null}

        {screen === "game" ? (
          <>
        {endingImageSource ? (
          <div className={`ending-cg ending-cg-${ending}`} aria-hidden="true">
            <Image
              className="ending-cg-image"
              src={assetPath(endingImageSource)}
              alt=""
              fill
              priority
              unoptimized
              sizes="100vw"
            />
          </div>
        ) : null}

        {showCharacter ? (
          <div className={`character character-${expression} route-portrait-character route-${selectedRoute.id}`} aria-hidden="true">
            <Image
              className="character-image"
              src={assetPath(characterSource)}
              alt=""
              fill
              priority
              unoptimized
              sizes="(max-width: 780px) 70vw, 45vw"
            />
          </div>
        ) : null}

        <div className="date-panel">
          <span>吉乃屋 秋葉原店</span>
          <hr />
          <strong>5/24（土）</strong>
          <b>18:{ending ? "59" : String(40 + Math.min(history.length, 19)).padStart(2, "0")}</b>
        </div>

        <div className="affection-panel">
          <div className="affection-row">
            <span className="heart">♥</span>
            <span>親密度</span>
            <strong>{affection}%</strong>
          </div>
          <div className="meter">
            <i style={{ width: affectionPercent }} />
          </div>
          <small>ドキドキLv.{dokiLevel}</small>
        </div>

        <div className="route-badge">
          <span>攻略中</span>
          <strong>{selectedRoute.name}</strong>
          <small>{selectedRoute.routeTitle}</small>
        </div>

        {lastFeedback && !ending ? (
          <div className={`feedback ${lastFeedback.delta >= 0 ? "plus" : "minus"}`}>
            {lastFeedback.index ? `選択 ${lastFeedback.index}` : "時間切れ"} / 親密度
            {lastFeedback.delta >= 0 ? "+" : ""}
            {lastFeedback.delta}
          </div>
        ) : null}

        <button className={`dialog-box ${hasChoices ? "dialog-with-choices" : ""}`} type="button" onClick={advance}>
          <span className="speaker-label">{visibleSpeaker}</span>
          <span className="dialog-text">
            {activeEnding?.title ? <em>{activeEnding.title}</em> : null}
            {visibleScene?.text}
          </span>
          <span className="dialog-heart">♡</span>
        </button>

        {hasChoices ? (
          <div className="choice-wrap">
            <div className="choice-timer">
              <i style={{ width: timerPercent }} />
            </div>
            {currentScene.choices.map((choice, index) => (
              <button
                className={`choice choice-${index + 1}`}
                key={choice.label}
                type="button"
                onClick={() => choose(choice, index)}
              >
                <span className={`choice-number n${index + 1}`} data-number={index + 1} />
                <span>{choice.label}</span>
              </button>
            ))}
          </div>
        ) : null}

        {ending ? (
          <div className="ending-actions">
            <button type="button" onClick={restart}>もう一度はじめる</button>
            <button type="button" onClick={returnToRoutes}>ルート選択へ</button>
          </div>
        ) : null}

        <div className="bottom-controls">
          <button className="control-log" type="button" onClick={() => setShowLog(true)}>LOG</button>
          <button className={`control-auto ${autoMode ? "active" : ""}`} type="button" onClick={() => setAutoMode((value) => !value)}>AUTO</button>
          <button className="control-menu" type="button" onClick={() => setShowMenu(true)}>MENU</button>
        </div>

        <div className="video-bar" aria-hidden="true">
          <span />
          <b>{progressLabel}</b>
        </div>

        {showLog ? (
          <Overlay title="LOG" onClose={() => setShowLog(false)}>
            {history.length ? (
              <ol className="log-list">
                {history.map((item, index) => (
                  <li key={`${item.speaker}-${index}`}>
                    <strong>{item.speaker}</strong>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p>まだログはありません。</p>
            )}
          </Overlay>
        ) : null}

        {showMenu ? (
          <Overlay title="MENU" onClose={() => setShowMenu(false)}>
            <div className="menu-actions">
              <button type="button" onClick={restart}>最初から</button>
              <button type="button" onClick={returnToRoutes}>ルート選択</button>
              <button type="button" onClick={() => setMuted((value) => !value)}>{muted ? "音を出す" : "音を切る"}</button>
              <button type="button" onClick={() => setShowMenu(false)}>ゲームに戻る</button>
            </div>
            <p>Space / Enterで会話送り、1-4で選択、Lでログ、Aでオート切り替え。</p>
          </Overlay>
        ) : null}
          </>
        ) : null}
      </section>
    </main>
  );
}

function TitleScreen({ onStart }) {
  return (
    <div className="title-screen">
      <Image
        className="title-key-image"
        src={assetPath("/assets/routes/title-key-visual.png")}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
      />
      <div className="title-copy">
        <span className="title-kicker">5分で終わる牛丼恋愛シミュレーション</span>
        <h1>チー牛くんと、恋をする。</h1>
        <p>その一杯に、恋はあるのか。</p>
        <button type="button" onClick={onStart}>ゲームスタート</button>
      </div>
    </div>
  );
}

function RouteSelect({ routes, selectedRouteId, onSelect, onBack }) {
  return (
    <div className="route-screen">
      <Image
        className="route-bg-image"
        src={assetPath("/assets/routes/title-key-visual.png")}
        alt=""
        fill
        unoptimized
        sizes="100vw"
      />
      <div className="route-header">
        <button className="route-back" type="button" onClick={onBack}>戻る</button>
        <div>
          <span>Route Select</span>
          <h2>攻略するチー牛くんを選ぶ</h2>
        </div>
      </div>

      <div className="route-grid">
        {routes.map((route, index) => (
          <button
            className={`route-card ${selectedRouteId === route.id ? "selected" : ""}`}
            key={route.id}
            type="button"
            onClick={() => onSelect(route.id)}
          >
            <span className="route-index">Route {index + 1}</span>
            <span className="route-image-wrap">
              <Image
                className="route-image"
                src={assetPath(route.cardImage)}
                alt=""
                fill
                priority={index === 0}
                unoptimized
                sizes="(max-width: 780px) 86vw, 26vw"
              />
            </span>
            <span className="route-card-body">
              <strong>{route.name}</strong>
              <em>{route.routeTitle}</em>
              <span>{route.catchCopy}</span>
              <small>{route.curiosity}</small>
              <b>難易度: {route.difficulty}</b>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Overlay({ title, children, onClose }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="overlay-panel">
        <div className="overlay-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

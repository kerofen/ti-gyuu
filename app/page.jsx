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
    text: "5月24日、土曜日。秋葉原の牛丼店で、私はいつものカウンター席に座っていた。",
    next: "meet"
  },
  {
    id: "meet",
    speaker: "チー牛くん",
    expression: "shy",
    text: "ぼ、ぼぼぼくと、ち、ちょっとだけ話してくれないかな。チーズ牛丼、好きって聞こえたから……。",
    next: "choice_food"
  },
  {
    id: "choice_food",
    speaker: "チー牛くん",
    expression: "shy",
    text: "あ、あの……チーズ牛丼って、やっぱり変かな？",
    choices: [
      {
        label: "うん、私も好き。おすすめ聞かせて",
        delta: 18,
        mood: "blush",
        response: "ほんと？ えへへ……じゃ、じゃあ温玉を乗せると、すごく幸せなんだ。"
      },
      {
        label: "別に普通じゃない？",
        delta: 4,
        mood: "neutral",
        response: "そ、そうだよね。普通……だよね。"
      },
      {
        label: "急にどうしたの？大丈夫？",
        delta: 10,
        mood: "shy",
        response: "ご、ごめん。ちょっと緊張して、確認したくなっただけ。"
      },
      {
        label: "私は軽めのメニューにするかな",
        delta: -12,
        mood: "sad",
        severe: true,
        response: "そっか……やっぱり重いよね、ぼくも。"
      }
    ],
    next: "after_food"
  },
  {
    id: "after_food",
    speaker: "私",
    expression: "neutral",
    text: "彼はメニュー表を両手で持ったまま、ちらちらとこちらの反応を見ている。",
    next: "choice_hobby"
  },
  {
    id: "choice_hobby",
    speaker: "チー牛くん",
    expression: "neutral",
    text: "ぼ、僕、こういうお店のメニューを眺めるのが好きで……へ、変だよね。",
    choices: [
      {
        label: "値段や組み合わせを見るの楽しいよね",
        delta: 17,
        mood: "blush",
        response: "そ、そう！ 限定メニューの流れとか、見てるだけで物語があるんだ。"
      },
      {
        label: "詳しいんだね。今のおすすめは？",
        delta: 13,
        mood: "shy",
        response: "おすすめ……！ えっと、今日はチーズにねぎ玉が強いと思う。"
      },
      {
        label: "まあ、暇つぶしにはなるよね",
        delta: -4,
        mood: "sad",
        response: "ひ、暇つぶし……うん、そういう感じでもあるかも。"
      },
      {
        label: "それより早く注文しよ",
        delta: -15,
        mood: "sad",
        severe: true,
        response: "ご、ごめん。話すの、遅いよね。"
      }
    ],
    next: "choice_anxiety"
  },
  {
    id: "choice_anxiety",
    speaker: "チー牛くん",
    expression: "sad",
    text: "い、いやだったかな……。ぼ、僕なんかと話してて楽しくなかったよね……。",
    choices: [
      {
        label: "そんなことないよ。私は楽しい",
        delta: 20,
        mood: "blush",
        response: "……う、嬉しい。ちゃんと目を見て言ってくれるの、助かる。"
      },
      {
        label: "不安なら、少しずつ話そう",
        delta: 15,
        mood: "shy",
        response: "少しずつ……それなら、ぼくにもできるかも。"
      },
      {
        label: "悲しいこと言わないで。大丈夫だよ",
        delta: 9,
        mood: "neutral",
        response: "うん……ありがとう。言い方、困らせちゃったね。"
      },
      {
        label: "じゃあ、またね。元気出して",
        delta: -24,
        mood: "angry",
        severe: true,
        response: "嘘だ！ 絶対そんなこと思ってない！ もういい、帰る！"
      }
    ],
    next: "midpoint"
  },
  {
    id: "midpoint",
    speaker: "私",
    expression: "neutral",
    text: "券売機の音、湯気、オレンジ色の看板。短い会話なのに、店内の時間が少しゆっくり流れた。",
    next: "choice_memory"
  },
  {
    id: "choice_memory",
    speaker: "チー牛くん",
    expression: "shy",
    text: "じ、実は今日、誰かと食べる練習をしようと思って来たんだ。",
    choices: [
      {
        label: "練習じゃなくて、もうちゃんと会話だよ",
        delta: 18,
        mood: "blush",
        response: "そっか……ぼく、今ちゃんと会話できてるんだ。"
      },
      {
        label: "その勇気、すごくいいと思う",
        delta: 16,
        mood: "blush",
        response: "勇気……そんなふうに言われたの、初めてかも。"
      },
      {
        label: "次はもっと混んでない店にしよっか",
        delta: 8,
        mood: "neutral",
        response: "あ、うん。静かなところなら、もっと話せる気がする。"
      },
      {
        label: "練習台だったんだ？",
        delta: -22,
        mood: "sad",
        severe: true,
        response: "ち、違う！ そんなつもりじゃ……ごめん。"
      }
    ],
    next: "choice_final"
  },
  {
    id: "choice_final",
    speaker: "チー牛くん",
    expression: "blush",
    text: "も、もし迷惑じゃなければ……また一緒に、チーズ牛丼食べてくれる？",
    choices: [
      {
        label: "もちろん。次は私から誘うね",
        delta: 24,
        mood: "blush",
        response: "えっ……次があるんだ。ぼく、今日のこと忘れない。"
      },
      {
        label: "うん。おすすめトッピングも教えて",
        delta: 18,
        mood: "blush",
        response: "任せて。次までに、完璧な組み合わせを考えておく。"
      },
      {
        label: "予定が合えばね",
        delta: -6,
        mood: "sad",
        response: "そ、そうだよね。無理にとは言わないよ。"
      },
      {
        label: "今日だけの思い出にしよ",
        delta: -30,
        mood: "angry",
        severe: true,
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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function assetPath(path) {
  return `${basePath}${path}`;
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

function endingScene(type) {
  if (type === "good") {
    return {
      speaker: "チー牛くん",
      expression: "blush",
      title: "成功エンド",
      text: "ありがとう。次は、ぼくがちゃんと誘う。君と食べるチーズ牛丼、きっと一番おいしいから。"
    };
  }

  if (type === "normal") {
    return {
      speaker: "チー牛くん",
      expression: "neutral",
      title: "通常エンド",
      text: "今日はありがとう。まだ少し緊張するけど、また会えたら……その時は、もう少し話せると思う。"
    };
  }

  return {
    speaker: "チー牛くん",
    expression: "angry",
    title: "失敗エンド",
    text: "嘘だ！ 絶対そんなこと思ってない！ もういい、帰る！"
  };
}

export default function Home() {
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
  const [remaining, setRemaining] = useState(18);
  const timerRef = useRef(null);

  const currentScene = sceneMap.get(currentId);
  const dokiLevel = getDokiLevel(affection);
  const activeEnding = ending ? endingScene(ending) : null;
  const visibleScene = activeEnding ?? responseScene ?? currentScene;
  const hasChoices = Boolean(!ending && !responseScene && currentScene?.choices?.length);
  const timerLimit = useMemo(() => getTimerLimit(dokiLevel), [dokiLevel]);
  const progressLabel = ending ? "0:21 / 0:21" : `0:${String(Math.min(history.length * 2 + 3, 21)).padStart(2, "0")} / 0:21`;
  const showCharacter = currentId !== "opening" || Boolean(responseScene) || Boolean(ending);

  const pushHistory = useCallback((speaker, text) => {
    setHistory((items) => [...items, { speaker, text }].slice(-40));
  }, []);

  const goToScene = useCallback(
    (nextId, score = affection) => {
      setCurrentId(nextId);
      const nextScene = sceneMap.get(nextId);
      if (nextScene?.expression) setExpression(nextScene.expression);
      if (nextScene?.choices?.length) {
        setRemaining(getTimerLimit(getDokiLevel(score)));
      }
    },
    [affection]
  );

  const endGame = useCallback(
    (forcedType) => {
      const result = forcedType ?? getEnding(affection, severeMistakes, timeouts);
      const scene = endingScene(result);
      setEnding(result);
      setExpression(scene.expression);
      pushHistory(scene.speaker, scene.text);
    },
    [affection, pushHistory, severeMistakes, timeouts]
  );

  const advance = useCallback(() => {
    if (showLog || showMenu || hasChoices || ending) return;
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

    pushHistory(currentScene.speaker, currentScene.text);

    if (currentScene.next === "ending_check") {
      endGame();
      return;
    }

    goToScene(currentScene.next);
    setLastFeedback(null);
  }, [currentScene, endGame, ending, goToScene, hasChoices, pushHistory, responseScene, showLog, showMenu]);

  const choose = useCallback(
    (choice, index) => {
      if (!currentScene || !hasChoices || ending) return;

      const newAffection = clamp(affection + choice.delta, 0, MAX_AFFECTION);
      const newSevere = severeMistakes + (choice.severe ? 1 : 0);
      const feedback = {
        index: index + 1,
        delta: choice.delta,
        text: choice.response
      };

      pushHistory(currentScene.speaker, currentScene.text);
      pushHistory("私", choice.label);
      pushHistory("チー牛くん", choice.response);
      setAffection(newAffection);
      setSevereMistakes(newSevere);
      setExpression(choice.mood);
      setLastFeedback(feedback);

      setResponseScene({
        speaker: "チー牛くん",
        expression: choice.mood,
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
    [affection, currentScene, ending, hasChoices, pushHistory, severeMistakes, timeouts]
  );

  const restart = useCallback(() => {
    setCurrentId("opening");
    setAffection(START_AFFECTION);
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
  }, []);

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
          pushHistory("私", "……。");
          pushHistory("チー牛くん", "ご、ごめん。困らせたよね。");
          setResponseScene({
            speaker: "チー牛くん",
            expression: "sad",
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
  }, [affection, currentScene, ending, hasChoices, pushHistory, severeMistakes, showLog, showMenu, timerLimit, timeouts]);

  useEffect(() => {
    if (!autoMode || hasChoices || ending || showLog || showMenu) return;
    const autoTimer = window.setTimeout(advance, 1650);
    return () => window.clearTimeout(autoTimer);
  }, [advance, autoMode, ending, hasChoices, showLog, showMenu]);

  useEffect(() => {
    const onKeyDown = (event) => {
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
      const numeric = Number(event.key);
      if (hasChoices && numeric >= 1 && numeric <= 4) {
        const choice = currentScene.choices[numeric - 1];
        if (choice) choose(choice, numeric - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advance, choose, currentScene, hasChoices]);

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

        {showCharacter ? (
          <div className={`character character-${expression}`} aria-hidden="true">
            <Image
              className="character-image"
              src={assetPath(characterAssets[expression] ?? characterAssets.neutral)}
              alt=""
              fill
              priority
              unoptimized
              sizes="(max-width: 780px) 70vw, 45vw"
            />
          </div>
        ) : null}

        <div className="date-panel">
          <span>牛丼家 秋葉原店</span>
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

        {lastFeedback && !ending ? (
          <div className={`feedback ${lastFeedback.delta >= 0 ? "plus" : "minus"}`}>
            {lastFeedback.index ? `選択 ${lastFeedback.index}` : "時間切れ"} / 親密度
            {lastFeedback.delta >= 0 ? "+" : ""}
            {lastFeedback.delta}
          </div>
        ) : null}

        <button className={`dialog-box ${hasChoices ? "dialog-with-choices" : ""}`} type="button" onClick={advance}>
          <span className="speaker-label">{visibleScene?.speaker}</span>
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
              <button className={`choice choice-${index + 1}`} key={choice.label} type="button" onClick={() => choose(choice, index)}>
                <span className={`choice-number n${index + 1}`} data-number={index + 1} />
                <span>{choice.label}</span>
              </button>
            ))}
          </div>
        ) : null}

        {ending ? (
          <div className="ending-actions">
            <button type="button" onClick={restart}>もう一度はじめる</button>
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
              <button type="button" onClick={() => setShowMenu(false)}>ゲームに戻る</button>
            </div>
            <p>Space / Enterで会話送り、1-4で選択、Lでログ、Aでオート切り替え。</p>
          </Overlay>
        ) : null}
      </section>
    </main>
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

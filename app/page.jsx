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
    name: "計算くん",
    routeTitle: "メニュー研究派",
    catchCopy: "値段、限定、組み合わせ。牛丼店のメニューに物語を見るタイプ。",
    curiosity: "メニュー考察に乗るほど、隠れた照れが出る。",
    difficulty: "会話重視",
    startAffection: 10,
    cardImage: "/assets/routes/route-analyst.png",
    choiceBias: {
      choice_food: { 1: 3 },
      choice_hobby: { 0: 7, 1: 5 },
      choice_memory: { 1: 3 },
      choice_final: { 1: 4 }
    }
  },
  {
    id: "night",
    name: "深夜くん",
    routeTitle: "深夜イヤホン派",
    catchCopy: "夜の窓際で、聞こえないふりをしながら本音を待っている。",
    curiosity: "急かさず、不安に寄り添う返答が効きやすい。",
    difficulty: "繊細",
    startAffection: 14,
    cardImage: "/assets/routes/route-night.png",
    choiceBias: {
      choice_anxiety: { 1: 6, 2: 4 },
      choice_memory: { 2: 5 },
      choice_final: { 1: 3, 2: 2 }
    }
  }
];

const routeMap = new Map(routes.map((route) => [route.id, route]));
const DEFAULT_ROUTE_ID = routes[0].id;

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

function endingScene(type) {
  if (type === "good") {
    return {
      speaker: "チー牛くん",
      expression: "blush",
      title: "成功エンド",
      voice: "ending-good",
      text: "ありがとう。次は、ぼくがちゃんと誘う。君と食べるチーズ牛丼、きっと一番おいしいから。"
    };
  }

  if (type === "normal") {
    return {
      speaker: "チー牛くん",
      expression: "neutral",
      title: "通常エンド",
      voice: "ending-normal",
      text: "今日はありがとう。まだ少し緊張するけど、また会えたら……その時は、もう少し話せると思う。"
    };
  }

  return {
    speaker: "チー牛くん",
    expression: "angry",
    title: "失敗エンド",
    voice: "ending-bad",
    text: "嘘だ！ 絶対そんなこと思ってない！ もういい、帰る！"
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
  const currentScene = sceneMap.get(currentId);
  const dokiLevel = getDokiLevel(affection);
  const activeEnding = ending ? endingScene(ending) : null;
  const visibleScene = activeEnding ?? responseScene ?? currentScene;
  const hasChoices = Boolean(screen === "game" && !ending && !responseScene && currentScene?.choices?.length);
  const timerLimit = useMemo(() => getTimerLimit(dokiLevel), [dokiLevel]);
  const progressLabel = ending ? "0:21 / 0:21" : `0:${String(Math.min(history.length * 2 + 3, 21)).padStart(2, "0")} / 0:21`;
  const showCharacter = screen === "game";
  const visibleSpeaker = routeSpeaker(visibleScene?.speaker, selectedRoute);
  const characterSource = selectedRoute.cardImage ?? characterAssets[expression] ?? characterAssets.neutral;

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
      if (!audioEnabled || muted || !voiceId) return;
      if (voiceRef.current) {
        voiceRef.current.pause();
        voiceRef.current.currentTime = 0;
      }
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
      const activeRoute = routeMap.get(selectedRouteId) ?? routes[0];
      const result = forcedType ?? getEnding(affection, severeMistakes, timeouts);
      const scene = endingScene(result);
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
            {lastFeedback.routeBonus > 0 ? ` / 相性+${lastFeedback.routeBonus}` : ""}
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
            {currentScene.choices.map((choice, index) => {
              const routeBonus = getRouteChoiceBonus(selectedRoute, currentScene.id, index);
              return (
                <button
                  className={`choice choice-${index + 1} ${routeBonus > 0 ? "choice-affinity" : ""}`}
                  key={choice.label}
                  type="button"
                  onClick={() => choose(choice, index)}
                >
                  <span className={`choice-number n${index + 1}`} data-number={index + 1} />
                  <span>{choice.label}</span>
                  {routeBonus > 0 ? <small>相性 +{routeBonus}</small> : null}
                </button>
              );
            })}
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
        <span className="title-kicker">5分で終わる牛丼店恋愛シミュレーション</span>
        <h1>チー牛くん恋愛研究所</h1>
        <p>どの席に座るかで、会話の温度が少し変わる。</p>
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

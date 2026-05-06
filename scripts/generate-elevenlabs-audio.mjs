import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const femaleVoiceId = "JTlYtJrcTzPC71hMLOxo";
const maleVoiceId = "lHuO7jiPwSHOxWn1h1Fy";
const speechEndpoint = "https://api.elevenlabs.io/v1/text-to-speech";
const soundEndpoint = "https://api.elevenlabs.io/v1/sound-generation";
const outputFormat = "mp3_44100_128";
const outRoot = path.resolve("public/assets/audio");

function readEnvValue(content, names) {
  for (const name of names) {
    const line = content
      .split(/\r?\n/)
      .find((item) => item.trim().startsWith(`${name}=`));
    if (line) return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
  }
  return "";
}

async function getApiKey() {
  const env = await readFile(".env", "utf8").catch(() => "");
  return readEnvValue(env, ["ELEVENLABS_API_KEY", "XI_API_KEY", "IRELABO_API_KEY"]);
}

async function existsWithContent(filePath) {
  try {
    const info = await stat(filePath);
    return info.size > 1000;
  } catch {
    return false;
  }
}

async function writeResponseAudio(response, filePath) {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`ElevenLabs request failed: ${response.status} ${body.slice(0, 240)}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);
}

const speechItems = [
  {
    id: "opening",
    voice: femaleVoiceId,
    style: "calm",
    text: "5月24日、土曜日。秋葉原の牛丼店で、私はいつものカウンター席に座っていた。"
  },
  {
    id: "meet",
    voice: maleVoiceId,
    style: "shy",
    text: "ぼ、ぼぼぼくと、ち、ちょっとだけ話してくれないかな。チーズ牛丼、好きって聞こえたから……。"
  },
  {
    id: "choice-food",
    voice: maleVoiceId,
    style: "shy",
    text: "あ、あの……チーズ牛丼って、やっぱり変かな？"
  },
  {
    id: "response-food-1",
    voice: maleVoiceId,
    style: "happy",
    text: "ほんと？ えへへ……じゃ、じゃあ温玉を乗せると、すごく幸せなんだ。"
  },
  {
    id: "response-food-2",
    voice: maleVoiceId,
    style: "neutral",
    text: "そ、そうだよね。普通……だよね。"
  },
  {
    id: "response-food-3",
    voice: maleVoiceId,
    style: "shy",
    text: "ご、ごめん。ちょっと緊張して、確認したくなっただけ。"
  },
  {
    id: "response-food-4",
    voice: maleVoiceId,
    style: "sad",
    text: "そっか……やっぱり重いよね、ぼくも。"
  },
  {
    id: "after-food",
    voice: femaleVoiceId,
    style: "calm",
    text: "彼はメニュー表を両手で持ったまま、ちらちらとこちらの反応を見ている。"
  },
  {
    id: "choice-hobby",
    voice: maleVoiceId,
    style: "shy",
    text: "ぼ、僕、こういうお店のメニューを眺めるのが好きで……へ、変だよね。"
  },
  {
    id: "response-hobby-1",
    voice: maleVoiceId,
    style: "happy",
    text: "そ、そう！ 限定メニューの流れとか、見てるだけで物語があるんだ。"
  },
  {
    id: "response-hobby-2",
    voice: maleVoiceId,
    style: "happy",
    text: "おすすめ……！ えっと、今日はチーズにねぎ玉が強いと思う。"
  },
  {
    id: "response-hobby-3",
    voice: maleVoiceId,
    style: "sad",
    text: "ひ、暇つぶし……うん、そういう感じでもあるかも。"
  },
  {
    id: "response-hobby-4",
    voice: maleVoiceId,
    style: "sad",
    text: "ご、ごめん。話すの、遅いよね。"
  },
  {
    id: "choice-anxiety",
    voice: maleVoiceId,
    style: "sad",
    text: "い、いやだったかな……。ぼ、僕なんかと話してて楽しくなかったよね……。"
  },
  {
    id: "response-anxiety-1",
    voice: maleVoiceId,
    style: "happy",
    text: "……う、嬉しい。ちゃんと目を見て言ってくれるの、助かる。"
  },
  {
    id: "response-anxiety-2",
    voice: maleVoiceId,
    style: "shy",
    text: "少しずつ……それなら、ぼくにもできるかも。"
  },
  {
    id: "response-anxiety-3",
    voice: maleVoiceId,
    style: "neutral",
    text: "うん……ありがとう。言い方、困らせちゃったね。"
  },
  {
    id: "response-anxiety-4",
    voice: maleVoiceId,
    style: "angry",
    text: "嘘だ！ 絶対そんなこと思ってない！ もういい、帰る！"
  },
  {
    id: "midpoint",
    voice: femaleVoiceId,
    style: "calm",
    text: "券売機の音、湯気、オレンジ色の看板。短い会話なのに、店内の時間が少しゆっくり流れた。"
  },
  {
    id: "choice-memory",
    voice: maleVoiceId,
    style: "shy",
    text: "じ、実は今日、誰かと食べる練習をしようと思って来たんだ。"
  },
  {
    id: "response-memory-1",
    voice: maleVoiceId,
    style: "happy",
    text: "そっか……ぼく、今ちゃんと会話できてるんだ。"
  },
  {
    id: "response-memory-2",
    voice: maleVoiceId,
    style: "happy",
    text: "勇気……そんなふうに言われたの、初めてかも。"
  },
  {
    id: "response-memory-3",
    voice: maleVoiceId,
    style: "neutral",
    text: "あ、うん。静かなところなら、もっと話せる気がする。"
  },
  {
    id: "response-memory-4",
    voice: maleVoiceId,
    style: "sad",
    text: "ち、違う！ そんなつもりじゃ……ごめん。"
  },
  {
    id: "choice-final",
    voice: maleVoiceId,
    style: "shy",
    text: "も、もし迷惑じゃなければ……また一緒に、チーズ牛丼食べてくれる？"
  },
  {
    id: "response-final-1",
    voice: maleVoiceId,
    style: "happy",
    text: "えっ……次があるんだ。ぼく、今日のこと忘れない。"
  },
  {
    id: "response-final-2",
    voice: maleVoiceId,
    style: "happy",
    text: "任せて。次までに、完璧な組み合わせを考えておく。"
  },
  {
    id: "response-final-3",
    voice: maleVoiceId,
    style: "sad",
    text: "そ、そうだよね。無理にとは言わないよ。"
  },
  {
    id: "response-final-4",
    voice: maleVoiceId,
    style: "angry",
    text: "……わかった。優しくされたって、勝手に勘違いしただけだよね。"
  },
  {
    id: "timeout",
    voice: maleVoiceId,
    style: "sad",
    text: "ご、ごめん。困らせたよね。"
  },
  {
    id: "ending-good",
    voice: maleVoiceId,
    style: "happy",
    text: "ありがとう。次は、ぼくがちゃんと誘う。君と食べるチーズ牛丼、きっと一番おいしいから。"
  },
  {
    id: "ending-normal",
    voice: maleVoiceId,
    style: "neutral",
    text: "今日はありがとう。まだ少し緊張するけど、また会えたら……その時は、もう少し話せると思う。"
  },
  {
    id: "ending-bad",
    voice: maleVoiceId,
    style: "angry",
    text: "嘘だ！ 絶対そんなこと思ってない！ もういい、帰る！"
  },
  {
    id: "male-happy",
    voice: maleVoiceId,
    style: "happy",
    text: "や、やった……！ うれしい、ほんとにうれしい！"
  },
  {
    id: "male-despair",
    voice: maleVoiceId,
    style: "angry",
    text: "うわぁぁぁぁ！ もうだめだぁぁぁ！"
  }
];

const soundItems = [
  {
    id: "ui-click",
    text: "A very short soft visual novel UI click, gentle button tap, clean, no voice, no music.",
    duration: 0.8
  },
  {
    id: "choice-select",
    text: "A soft bright choice selection chime for a romantic visual novel, clean sparkle, no voice, no music.",
    duration: 1.2
  },
  {
    id: "affection-up",
    text: "A cute heart sparkle sound effect, warm romantic twinkle, short, no voice, no music.",
    duration: 1.6
  },
  {
    id: "affection-down",
    text: "A short awkward descending chime, uneasy but comedic, visual novel affection down, no voice, no music.",
    duration: 1.4
  },
  {
    id: "timeout",
    text: "A short awkward silence sting with a tiny restaurant room tone tail, uncomfortable but comedic, no voice, no music.",
    duration: 2
  },
  {
    id: "success-sting",
    text: "A warm happy romantic success sparkle sting for a visual novel ending, no voice, no music.",
    duration: 2
  },
  {
    id: "bad-sting",
    text: "A brief dramatic comedic despair sting for a visual novel bad ending, no voice, no music.",
    duration: 2
  }
];

function voiceSettings(style) {
  const base = {
    stability: 0.42,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    speed: 0.95
  };

  if (style === "happy") return { ...base, stability: 0.32, style: 0.62, speed: 1.02 };
  if (style === "sad") return { ...base, stability: 0.5, style: 0.44, speed: 0.9 };
  if (style === "angry") return { ...base, stability: 0.28, style: 0.78, speed: 1.03 };
  if (style === "shy") return { ...base, stability: 0.36, style: 0.42, speed: 0.92 };
  if (style === "calm") return { ...base, stability: 0.55, style: 0.18, speed: 0.96 };
  return base;
}

async function generateSpeech(apiKey, item) {
  const filePath = path.join(outRoot, "voice", `${item.id}.mp3`);
  if (await existsWithContent(filePath)) {
    console.log(`skip voice/${item.id}.mp3`);
    return;
  }

  const response = await fetch(`${speechEndpoint}/${item.voice}?output_format=${outputFormat}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      text: item.text,
      model_id: "eleven_multilingual_v2",
      language_code: "ja",
      apply_language_text_normalization: true,
      voice_settings: voiceSettings(item.style)
    })
  });

  await writeResponseAudio(response, filePath);
  console.log(`generated voice/${item.id}.mp3`);
}

async function generateSound(apiKey, item) {
  const filePath = path.join(outRoot, "sfx", `${item.id}.mp3`);
  if (await existsWithContent(filePath)) {
    console.log(`skip sfx/${item.id}.mp3`);
    return;
  }

  const response = await fetch(`${soundEndpoint}?output_format=${outputFormat}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      text: item.text,
      duration_seconds: item.duration,
      prompt_influence: 0.35
    })
  });

  await writeResponseAudio(response, filePath);
  console.log(`generated sfx/${item.id}.mp3`);
}

async function main() {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error("ElevenLabs API key was not found in .env. Use ELEVENLABS_API_KEY, XI_API_KEY, or IRELABO_API_KEY.");
  }

  await mkdir(path.join(outRoot, "voice"), { recursive: true });
  await mkdir(path.join(outRoot, "sfx"), { recursive: true });

  for (const item of speechItems) {
    await generateSpeech(apiKey, item);
  }

  for (const item of soundItems) {
    await generateSound(apiKey, item);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

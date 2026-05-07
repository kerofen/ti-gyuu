import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const femaleVoiceId = "JTlYtJrcTzPC71hMLOxo";
const maleVoiceId = "lHuO7jiPwSHOxWn1h1Fy";
const speechEndpoint = "https://api.elevenlabs.io/v1/text-to-speech";
const outputFormat = "mp3_44100_128";
const outRoot = path.resolve("public/assets/audio/voice");

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

function voiceSettings(style) {
  const base = {
    stability: 0.4,
    similarity_boost: 0.8,
    style: 0.35,
    use_speaker_boost: true,
    speed: 0.96
  };

  if (style === "narration") return { ...base, stability: 0.58, style: 0.18, speed: 0.95 };
  if (style === "logical") return { ...base, stability: 0.36, style: 0.45, speed: 1.04 };
  if (style === "logicalHappy") return { ...base, stability: 0.3, style: 0.66, speed: 1.05 };
  if (style === "logicalSharp") return { ...base, stability: 0.28, style: 0.78, speed: 1.1 };
  if (style === "logicalSad") return { ...base, stability: 0.48, style: 0.44, speed: 0.98 };
  if (style === "cheese") return { ...base, stability: 0.34, style: 0.52, speed: 1.0 };
  if (style === "cheeseHappy") return { ...base, stability: 0.26, style: 0.78, speed: 1.04 };
  if (style === "cheeseSad") return { ...base, stability: 0.48, style: 0.5, speed: 0.94 };
  if (style === "cheeseSharp") return { ...base, stability: 0.25, style: 0.82, speed: 1.05 };
  return base;
}

function speech(id, text, style, voice = maleVoiceId) {
  return { id, text, style, voice };
}

const speechItems = [
  speech(
    "route-analyst-opening",
    "5月24日、土曜日。秋葉原の牛丼店で、私はやけに書き込みの多いメニュー表を見つけた。",
    "narration",
    femaleVoiceId
  ),
  speech(
    "route-analyst-meet",
    "す、すみません。いまの限定チーズ牛丼、価格と満足度の期待値がかなり歪んでて……少しだけ考察、聞いてもらえますか。",
    "logicalSad"
  ),
  speech(
    "route-analyst-choice-food",
    "チーズ牛丼は感情論じゃなくて、価格、満腹度、再現性の三点で評価すべきなんです。あなたはどう見ます？",
    "logical"
  ),
  speech("route-analyst-choice-food-response-1", "そ、それです！ 交点という言い方、かなり解像度が高い。今の返答は理論値に近いです。", "logicalHappy"),
  speech("route-analyst-choice-food-response-2", "希少性……そこに気づきますか。期間限定は味だけじゃなく、体験コストも乗るんです。", "logicalHappy"),
  speech("route-analyst-choice-food-response-3", "いや、それは論点が粗いです。おいしいの内訳を分解しないと、再注文の精度が落ちます。", "logicalSharp"),
  speech("route-analyst-choice-food-response-4", "十分、という言葉は危険です。比較対象も条件も置かずに結論だけ出すのは、雑すぎます。", "logicalSharp"),
  speech(
    "route-analyst-after-food",
    "彼のノートには、値段、満腹感、限定性、チーズの伸びまで細かく記録されていた。",
    "narration",
    femaleVoiceId
  ),
  speech(
    "route-analyst-choice-hobby",
    "注文の順番にも最適解があります。券売機、席、提供時間、溶け具合……全部つながってるんです。",
    "logical"
  ),
  speech("route-analyst-choice-hobby-response-1", "式！ まさに式です。食べる前から勝負は始まっている、という話がやっと通じた。", "logicalHappy"),
  speech("route-analyst-choice-hobby-response-2", "今日はチーズ、ねぎ、温玉。塩味と油分の補正がきれいに噛み合います。", "logicalHappy"),
  speech("route-analyst-choice-hobby-response-3", "疲れるかどうかではなく、納得できるかです。そこを混同すると会話が崩れます。", "logicalSharp"),
  speech("route-analyst-choice-hobby-response-4", "決めています。むしろ根拠なく急ぐほうが、後続の満足度を毀損します。", "logicalSharp"),
  speech(
    "route-analyst-choice-anxiety",
    "……でも、こういう話をすると大体引かれます。説明が長いって言われるし、早口だって。",
    "logicalSad"
  ),
  speech("route-analyst-choice-anxiety-response-1", "中身……そこを見てくれるなら、話す速度は少し落とせます。たぶん。", "logicalSad"),
  speech("route-analyst-choice-anxiety-response-2", "結論ファースト。いい整理です。あなた、会話設計がうまいですね。", "logicalHappy"),
  speech("route-analyst-choice-anxiety-response-3", "難しい、で止めると改善点が不明です。どの変数が重かったですか。", "logicalSharp"),
  speech("route-analyst-choice-anxiety-response-4", "論破ではなく検証です。そこを同一視されると、こちらも訂正せざるを得ません。", "logicalSharp"),
  speech(
    "route-analyst-midpoint",
    "早口の奥にあるのは、勝ちたい気持ちではなく、自分の考えを一度でいいから正確に受け取ってほしい願いだった。",
    "narration",
    femaleVoiceId
  ),
  speech(
    "route-analyst-choice-memory",
    "この表、実は誰かに見せたくて作りました。自分だけの理論が、ただの変なこだわりじゃないって確かめたくて。",
    "logicalSad"
  ),
  speech("route-analyst-choice-memory-response-1", "二人で……サンプル数が増える。いや、それ以上に、少し嬉しいです。", "logicalHappy"),
  speech("route-analyst-choice-memory-response-2", "面白い、ですか。変じゃなくて、面白い。かなり大きな差があります。", "logicalHappy"),
  speech("route-analyst-choice-memory-response-3", "要約版……必要ですね。情報量を落とさずに圧縮する方法を考えます。", "logical"),
  speech("route-analyst-choice-memory-response-4", "違います。自慢なら、こんなに不安そうに確認しません。前提が間違っています。", "logicalSharp"),
  speech(
    "route-analyst-choice-final",
    "次に会うなら、二人用の最適解を組んでもいいですか。あなたの好みも変数に入れたい。",
    "logicalSad"
  ),
  speech("route-analyst-choice-final-response-1", "了解です。単独最適じゃなく、二人の最適解。これはかなり強いテーマです。", "logicalHappy"),
  speech("route-analyst-choice-final-response-2", "ノート……本気ですね。では比較表の項目から一緒に決めましょう。", "logicalHappy"),
  speech("route-analyst-choice-final-response-3", "ほどほど、は曖昧ですが……たぶん配慮の言葉ですよね。受け取ります。", "logicalSad"),
  speech("route-analyst-choice-final-response-4", "そうですか。では、この会話の継続条件は満たせません。帰ります。", "logicalSharp"),
  speech("route-analyst-ending-good", "君の返答で、仮説が更新されました。次は二人の好みを変数に入れて、最高の組み合わせを作りたいです。", "logicalHappy"),
  speech("route-analyst-ending-normal", "今日はサンプル数1として、かなり有意義でした。次があれば、もう少し短く、でも正確に話します。", "logical"),
  speech("route-analyst-ending-bad", "論点が最後まで噛み合いませんでした。これ以上続けても、互いの期待値が下がるだけです。帰ります。", "logicalSharp"),
  speech(
    "route-night-opening",
    "5月24日、土曜日。秋葉原の牛丼店で、私は山のようなチーズ追加券を握る青年を見かけた。",
    "narration",
    femaleVoiceId
  ),
  speech(
    "route-night-meet",
    "なあ……チーズ、増せるだけ増す派？ 俺、牛丼がチーズで見えなくなる瞬間が一番好きなんだ。",
    "cheese"
  ),
  speech(
    "route-night-choice-food",
    "牛丼をチーズで埋め尽くして、ぐちゃっと混ぜて、最後に追いチーズ。これ、わかる？",
    "cheese"
  ),
  speech("route-night-choice-food-response-1", "それ！ 白い雪原みたいにしてから掘るんだよ。今ので完全に伝わった。", "cheeseHappy"),
  speech("route-night-choice-food-response-2", "強い。追いチーズは締めじゃない、第二開幕なんだ。わかってるな。", "cheeseHappy"),
  speech("route-night-choice-food-response-3", "少しだけ……それだと牛丼がまだ牛丼の顔をしてる。俺は埋めたいんだ。", "cheeseSad"),
  speech("route-night-choice-food-response-4", "抜く？ チーズを？ それはもう俺の席で言っちゃいけないやつだ。", "cheeseSharp"),
  speech(
    "route-night-after-food",
    "彼は追加券を扇のように並べ、どのタイミングでチーズを重ねるか真剣に考えている。",
    "narration",
    femaleVoiceId
  ),
  speech(
    "route-night-choice-hobby",
    "理想は、まず全面チーズ、次に混ぜる、肉汁を吸わせる、最後にもう一回かける。豪快だけど繊細なんだ。",
    "cheese"
  ),
  speech("route-night-choice-hobby-response-1", "そう！ チーズは量だけじゃない、層。最初と最後で表情が変わるんだよ。", "cheeseHappy"),
  speech("route-night-choice-hobby-response-2", "大事。熱が残ってるギリギリで落とす。そこが一番伸びる。", "cheeseHappy"),
  speech("route-night-choice-hobby-response-3", "まあ、すごい。でも今日はカロリーじゃなくて覚悟の話をしてる。", "cheeseSad"),
  speech("route-night-choice-hobby-response-4", "見た目で止まるなよ。ごちゃまぜの先にしかない一体感があるんだ。", "cheeseSharp"),
  speech(
    "route-night-choice-anxiety",
    "……引いた？ だよな。チーズで埋めたいとか、普通に言ったら重いよな。",
    "cheeseSad"
  ),
  speech("route-night-choice-anxiety-response-1", "重いくらいがいい……その言い方、めちゃくちゃ救われる。", "cheeseHappy"),
  speech("route-night-choice-anxiety-response-2", "全力、か。そう言われると、ただの大盛りじゃなくて済むな。", "cheeseHappy"),
  speech("route-night-choice-anxiety-response-3", "そこはもちろん。豪快と無責任は違う。最後までいく。", "cheese"),
  speech("route-night-choice-anxiety-response-4", "胃もたれ……現実を言われると急に弱い。いや、でも俺は食べたい。", "cheeseSad"),
  speech(
    "route-night-midpoint",
    "豪快な言葉のわりに、彼は追加券の端をそっと揃えていた。好きなものを笑われたくない手つきだった。",
    "narration",
    femaleVoiceId
  ),
  speech(
    "route-night-choice-memory",
    "いつかさ、牛丼をチーズで真っ白にして、混ぜて、最後にまた白くするのを誰かとやりたかったんだ。",
    "cheeseSad"
  ),
  speech("route-night-choice-memory-response-1", "儀式って言った？ いいな、それ。俺の中の正式名称にする。", "cheeseHappy"),
  speech("route-night-choice-memory-response-2", "二人で限界盛り……字面がもう強い。最高かもしれない。", "cheeseHappy"),
  speech("route-night-choice-memory-response-3", "写真だけか。まあ最初はそこからでもいい。見たらたぶん食べたくなる。", "cheeseSad"),
  speech("route-night-choice-memory-response-4", "一人でやれるから、誰かとやりたいって話をしてるんだよ。", "cheeseSharp"),
  speech(
    "route-night-choice-final",
    "次、俺とチーマシ限界盛りしてくれる？ 牛丼が見えなくなるまで、ちゃんと付き合ってほしい。",
    "cheese"
  ),
  speech("route-night-choice-final-response-1", "決まりだ。混ぜる瞬間、絶対楽しい。最後の追いチーズは半分ずつな。", "cheeseHappy"),
  speech("route-night-choice-final-response-2", "追いチーズ担当……重要ポジションだぞ。任せたら、たぶん俺かなり喜ぶ。", "cheeseHappy"),
  speech("route-night-choice-final-response-3", "普通盛り……入口としてはありか。そこから増せばいいもんな。", "cheeseSad"),
  speech("route-night-choice-final-response-4", "少なめ……そっか。俺の山には、一緒に登ってくれないんだな。", "cheeseSharp"),
  speech("route-night-ending-good", "次は限界までチーズ増そう。混ぜて、埋めて、最後にもう一回かける。君となら絶対うまい。", "cheeseHappy"),
  speech("route-night-ending-normal", "今日はありがとな。いきなり限界盛りは重かったかもだけど、次は一口だけでも付き合ってくれたら嬉しい。", "cheeseSad"),
  speech("route-night-ending-bad", "チーズ少なめって言われると、さすがにきつい。俺、今日は一人で増して帰るわ。", "cheeseSharp")
];

async function writeResponseAudio(response, filePath) {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`ElevenLabs request failed: ${response.status} ${body.slice(0, 240)}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);
}

async function generateSpeech(apiKey, item) {
  const filePath = path.join(outRoot, `${item.id}.mp3`);
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

async function main() {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error("ElevenLabs API key was not found in .env. Use ELEVENLABS_API_KEY, XI_API_KEY, or IRELABO_API_KEY.");
  }

  await mkdir(outRoot, { recursive: true });

  for (const item of speechItems) {
    await generateSpeech(apiKey, item);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

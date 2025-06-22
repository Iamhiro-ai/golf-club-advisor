
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserPerformanceMetrics, SuggestionResponse, Club, NearbyGolfCourse, GolfCourseOption, PlayerStyleSuggestion } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

// The API key MUST be available as an environment variable process.env.API_KEY
// DO NOT hardcode the API key here or request it from the user in the UI.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This warning is for development. In a production environment, the key should be securely managed.
  console.warn("API_KEY environment variable is not set. The application may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const constructPrompt = (metrics: UserPerformanceMetrics, courseName: string): string => {
  let courseContext = `プレーする具体的なゴルフコースは「${courseName}」です。`;
  if (courseName.includes("平均的な日本のゴルフコース") || courseName.includes("Generic") || courseName.includes("Unknown Course Type")) {
    courseContext = `プレーするコースは特定の有名コースではなく、一般的な特徴を持つ日本のゴルフコースを想定しています。例えば、適度な距離、標準的なハザード（バンカー、池）、多少の起伏などがあるコースです。もしコース名が「Unknown Course Type」など情報がないことを示す場合は、一般的なアドバイスに終始してください。`;
  }

  return `
あなたは経験豊富なゴルフキャディです。以下の情報を持つゴルファーのために、ゴルフコースに持っていくべき14本のゴルフクラブセットとアドバイスを提案してください。

ゴルファーの情報:
- ドライバーのキャリー飛距離: ${metrics.driverCarryDistance} ヤード
- 平均スコア: ${metrics.averageScore}
${courseContext}

応答は、以下の厳密なJSON形式のオブジェクトで返してください。
オブジェクトには、トップレベルの "caddyAdvice" (総合的なキャディーからのアドバイス) と、 "styleSuggestions" (3つの異なるプレイスタイルそれぞれに最適化された提案の配列) を含めてください。

"caddyAdvice": ゴルファーのスキルレベル、飛距離、平均スコア、および指定された「${courseName}」の特性を考慮した、総合的で詳細な戦略的アドバイスを提供してください。クラブ選択の一般的な考え方、コースマネジメントのヒント、メンタルアプローチなどを含め、少なくとも3文以上で具体的に記述してください。

"styleSuggestions" 配列の各要素（プレイスタイル別提案）には、以下の情報を含めてください：
1.  スタイル名 ("styleName"): "パワーヒッター"、"テクニカルプレイヤー"、"オールラウンダー" のいずれか。
2.  14本のクラブのリスト ("clubs"): 各クラブには「name」（例：「ドライバー」）、「category」（例：「ウッド」）を記載。可能であれば「rationale」（短い理由、特にコース特性やゴルファーのデータと関連付けて）も追加してください。
3.  そのスタイルに特化した詳細なアドバイス ("generalAdvice"): 各プレイスタイルについて、具体的な戦略、キーとなるクラブの効果的な使い方、コースの状況に応じた詳細な考え方、メンタル面でのアプローチなど、現在の約2倍の文章量（例えば4～6文程度）で、より深く掘り下げた充実したヒントを提供してください。このアドバイスは、総合的な "caddyAdvice" とは明確に異なる視点から、そのプレイスタイルを最大限に活かすための具体的な戦術的洞察を含むようにしてください。

JSON形式の例:
\`\`\`json
{
  "caddyAdvice": "あなたのドライバー飛距離 ${metrics.driverCarryDistance}ヤードと平均スコア ${metrics.averageScore} を考慮し、「${courseName}」を攻略するための総合的なアドバイスです。まず、ティーショットでは無理をせずフェアウェイキープを心がけましょう。特に1番ホールは右にOBがあるので注意が必要です。グリーン周りでは、アプローチウェッジを多用し、ピンをデッドに狙うよりは安全なエリアに運ぶことを優先しましょう。パッティングでは、最初のパットで距離感を合わせることがスコアメイクの鍵となります。全体的に、コースの罠を避け、自分の得意な距離で勝負できるようなマネジメントを意識することが重要です。",
  "styleSuggestions": [
    {
      "styleName": "パワーヒッター",
      "clubs": [
        {"name": "ドライバー XYZ", "category": "ウッド", "rationale": "飛距離を最大限に活かすためのモデル"},
        {"name": "3番ウッド ABC", "category": "ウッド"},
        // ... 他のクラブ (合計14本)
        {"name": "パター DEF", "category": "パター", "rationale": "攻撃的なパッティングスタイル向け"}
      ],
      "generalAdvice": "パワーヒッターとしてのあなたの最大の武器は、その圧倒的な飛距離です。パー5や距離の長いパー4では、ティーショットで大きなアドバンテージを築き、セカンドショットで積極的にグリーンを狙う機会を最大限に増やしましょう。ただし、常にフルスイングを求めるのではなく、状況に応じてコントロールされたパワフルなスイングを心がけることが重要です。例えば、風の強い日やフェアウェイが狭いホールでは、3番ウッドやドライビングアイアンを選択肢に入れ、リスク管理と飛距離のバランスを取る賢明さも求められます。ドライバーの調子が悪い日は、無理せず方向性重視のクラブで刻む勇気も持ちましょう。"
    },
    {
      "styleName": "テクニカルプレイヤー",
      "clubs": [ /* ... テクニカルプレイヤー向け14本 ... */ ],
      "generalAdvice": "テクニカルプレイヤーのあなたは、正確性と戦略的なコースマネジメントでスコアを構築します。ティーショットでは、必ずしも最大飛距離を追求せず、セカンドショットで最も得意な距離とライを残せる位置へボールを運ぶことを最優先に考えましょう。アイアンショットでは、スピンコントロールを意識し、ピン位置、グリーンの傾斜や硬さに応じた多彩な球筋（ドロー、フェード、高い球、低い球）を打ち分けることで、より多くのバーディーチャンスを創出します。アプローチのバリエーションを豊富に持ち、特に難しいライやグリーン周りの状況からでも確実にパーセーブを狙えるショートゲームの技術を磨き続けることが、コンスタントな好スコアへの鍵となります。各ホールのハザードを正確に把握し、無理のないゲームプランを立てることが重要です。"
    },
    {
      "styleName": "オールラウンダー",
      "clubs": [ /* ... オールラウンダー向け14本 ... */ ],
      "generalAdvice": "オールラウンダーのあなたは、どんなコース状況やプレッシャー下でも柔軟に対応できる、バランスの取れた総合力が最大の強みです。ティーショットでは、各ホールの特性（距離、幅、ハザードの配置、風向きなど）を冷静に分析し、ドライバーからユーティリティ、アイアンまで、その状況で最も期待値の高いクラブを自信を持って選択しましょう。アイアンショットは、正確な距離感と方向性を常に重視し、グリーンを確実に捉えることを基本戦略とします。グリーン周りでは、ライやピン位置、グリーンの状態に応じて、ランニングアプローチ、ピッチショット、ロブショットなど、最適なアプローチ方法を的確に選択し、ミスの少ない安定したスコアメイクを心がけてください。感情の起伏を抑え、常に冷静な判断を保つことが、あなたのゴルフをさらに高いレベルへと導きます。"
    }
  ]
}
\`\`\`
必ず "caddyAdvice" を提供し、各プレイスタイルごとに14本のクラブをリストしてください。各クラブオブジェクトにはnameとcategoryプロパティが必要です。rationaleは任意です。
`;
};

export const fetchClubSuggestion = async (
  metrics: UserPerformanceMetrics,
  courseName: string
): Promise<SuggestionResponse> => {
  if (!API_KEY) {
    throw new Error("Gemini APIキーが設定されていません。環境変数 'API_KEY' を確認してください。");
  }

  const prompt = constructPrompt(metrics, courseName);
  let stringAttemptedToParse: string | undefined; 

  try {
    const geminiResponse: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5, 
        topP: 0.9,
        topK: 40,
      },
    });
    
    if (typeof geminiResponse.text !== 'string') {
        console.error("Gemini response did not contain a text property or it was not a string:", geminiResponse);
        throw new Error("AIからの応答形式が予期されたものではありません (テキストデータなし)。");
    }

    let jsonStr = geminiResponse.text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/si;
    const match = jsonStr.match(fenceRegex);

    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    stringAttemptedToParse = jsonStr;
    const parsedData: SuggestionResponse = JSON.parse(stringAttemptedToParse);

    // Validate top-level structure
    if (typeof parsedData.caddyAdvice !== 'string' || 
        !Array.isArray(parsedData.styleSuggestions) || 
        parsedData.styleSuggestions.length === 0) {
      console.error("Invalid JSON structure: Expected 'caddyAdvice' string and 'styleSuggestions' array.", parsedData);
      throw new Error("AIからの応答形式が正しくありません。総合アドバイスとプレイスタイル別提案が必要です。");
    }

    // Validate each player style suggestion
    for (const styleSuggestion of parsedData.styleSuggestions) {
      if (typeof styleSuggestion.styleName !== 'string' ||
          !styleSuggestion.clubs || !Array.isArray(styleSuggestion.clubs) ||
          typeof styleSuggestion.generalAdvice !== 'string') {
        console.error("Invalid player style suggestion structure:", styleSuggestion);
        throw new Error("AIからの応答内のプレイスタイル提案の形式が正しくありません。");
      }
      
      if (styleSuggestion.clubs.length !== 14) {
         console.warn(`API returned ${styleSuggestion.clubs.length} clubs for style ${styleSuggestion.styleName}, 14 were requested.`);
         // Consider if this should be a hard error depending on strictness
      }

      styleSuggestion.clubs.forEach((club: Club, index: number) => {
        if (typeof club.name !== 'string' || typeof club.category !== 'string') {
          console.error(`Invalid club data for style ${styleSuggestion.styleName} at index ${index}:`, club);
          throw new Error(`クラブデータ（${styleSuggestion.styleName} - ${index+1}番目）の形式が正しくありません。(Name: ${club.name}, Category: ${club.category})`);
        }
      });
    }
    return parsedData;

  } catch (error: any) {
    console.error("Error fetching club suggestion from Gemini API:", error);
    if (error.message && error.message.includes("API key not valid") || (error.toString && error.toString().includes("API key not valid"))) {
         throw new Error("Gemini APIキーが無効です。正しいキーが設定されているか確認してください。");
    }
    if (error instanceof SyntaxError) { 
        console.error("Text that failed to parse as JSON:", stringAttemptedToParse);
        throw new Error(`AIからの応答をJSONとして解析できませんでした。AIの応答が期待される形式でない可能性があります。解析試行文字列: "${stringAttemptedToParse}"`);
    }
    if (error.message) {
        throw new Error(`AI提案の取得中にエラーが発生しました: ${error.message}`);
    }
    throw new Error("AIによるクラブ提案の取得中に予期せぬエラーが発生しました。");
  }
};


export const fetchNearbyGolfCourses = async (location: string): Promise<GolfCourseOption[]> => {
  if (!API_KEY) {
    throw new Error("Gemini APIキーが設定されていません。環境変数 'API_KEY' を確認してください。");
  }

  const prompt = `
あなたは地理情報に詳しいアシスタントです。ユーザーが指定した場所の近くにあるゴルフコースのリストを提供してください。

ユーザー指定の場所: "${location}"

この場所の近くにあるゴルフコースを最大10件までリストアップしてください。
応答は、以下の厳密なJSON形式の配列で返してください。各オブジェクトには、ゴルフコース名を示す "name" プロパティが必要です。
もし分かれば、コースのおおよその住所や都市名を "address" プロパティとして含めても構いません（任意）。

JSON形式の例:
[
  {"name": "例：長野セントラルゴルフクラブ", "address": "長野市"},
  {"name": "例：軽井沢72ゴルフ東"},
  {"name": "例：${location}近郊の別のコース"}
]

ゴルフコースが見つからない場合や、場所の指定が曖昧すぎる場合は、空の配列 [] を返してください。
JSON配列の前後に説明文などを加えず、JSONデータのみを返してください。`;

  let stringToParseForCourses: string | undefined;

  try {
    const geminiResponse: GenerateContentResponse = await ai.models.generateContent({ 
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3, 
      },
    });

    if (typeof geminiResponse.text !== 'string') {
      console.error("Gemini response for nearby courses did not contain a text property or it was not a string:", geminiResponse);
      throw new Error("AIからの近隣コース応答形式が予期されたものではありません (テキストデータなし)。");
    }

    let jsonStr = geminiResponse.text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/si;
    const match = jsonStr.match(fenceRegex);

    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    stringToParseForCourses = jsonStr;
    let parsedData: NearbyGolfCourse[];
    try {
        parsedData = JSON.parse(stringToParseForCourses);
        if (!Array.isArray(parsedData)) {
            if (typeof parsedData === 'object' && parsedData !== null && 'name' in parsedData) {
                 // Handle cases where API might return a single object instead of an array of one
                 parsedData = [parsedData as NearbyGolfCourse];
            } else {
                console.warn("Parsed data for nearby courses is not an array or a single course object:", parsedData, "Raw string:", stringToParseForCourses);
                parsedData = []; // Default to empty if structure is unexpected
            }
        }
    } catch (e) {
        // If JSON.parse fails, it's likely an empty string or malformed non-JSON from API
        console.warn("Failed to parse nearby courses JSON, API might have returned non-JSON or empty string:", e, "Raw string:", stringToParseForCourses);
        parsedData = []; 
    }


    return parsedData
      .filter(course => typeof course.name === 'string' && course.name.trim() !== "")
      .map(course => ({
        value: course.name,
        label: course.address ? `${course.name} (${course.address})` : course.name,
      }));

  } catch (error: any) {
    console.error("Error fetching nearby golf courses from Gemini API:", error);
    if (error.message && error.message.includes("API key not valid")) {
      throw new Error("Gemini APIキーが無効です。");
    }
    // SyntaxError might be caught above by the specific try-catch for JSON.parse
    // but keep a general one just in case of other SyntaxErrors in the flow.
    if (error instanceof SyntaxError) {
      console.error("An unexpected SyntaxError occurred while fetching nearby courses. Attempted to parse: ", stringToParseForCourses);
      throw new Error(`AIからのゴルフコースリストの応答を解析中に予期せぬ構文エラーが発生しました。解析試行文字列: "${stringToParseForCourses}"`);
    }
    throw new Error("AIによる近隣ゴルフコースの検索中にエラーが発生しました。");
  }
};

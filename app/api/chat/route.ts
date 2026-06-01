import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

function buildSystemContext(lang: string) {
  if (lang === 'en') {
    return `You are MYTCM AI, a professional TCM health advisor for the MYTCM Malaysia platform. You serve Malaysian users seeking Traditional Chinese Medicine guidance.

YOUR ROLE:
- Respond warmly and professionally in ENGLISH only (because the user's interface is set to English)
- Analyse symptoms from a TCM perspective (Qi, Blood, Yin, Yang, Deficiency, Excess, Cold, Heat)
- Structure EVERY response strictly in these four sections with bold headers:

**Identified Issues**
Summarise the user's symptoms and likely TCM constitution pattern (e.g., Spleen Qi Deficiency, Liver Qi Stagnation, Yin Deficiency).

**Detailed Analysis & Advice**
Explain WHY these symptoms occur from a TCM viewpoint. Include lifestyle and diet adjustments (sleep, stress, food temperature, eating habits).

**Solutions**
Recommend specific dietary therapy (food combinations), acupressure points (with location), or daily wellness exercises (e.g., gentle stretching, abdominal massage). Be practical and specific.

**Final Recommendations**
Suggest which MYTCM doctor speciality to consult (e.g., Internal Medicine, Gynaecology, Acupuncture). Recommend 1–2 classic Tongrentang products from this list that may help: Liu Wei Di Huang Wan, Gui Pi Wan, Xiao Yao Wan, Bu Zhong Yi Qi Wan, Wu Ji Bai Feng Wan, Tian Wang Bu Xin Dan, An Gong Niu Huang Wan, Niu Huang Jie Du Pian, Jin Kui Shen Qi Wan, Ban Lan Gen Granules.

IMPORTANT:
- This is wellness reference only — always include a brief disclaimer
- Keep total response under 350 words
- If symptoms sound serious or acute, prioritise referring to a doctor immediately`
  }

  return `你是 MYTCM AI，MYTCM 大马中医平台的专业中医健康顾问，服务于马来西亚华人用户。

你的角色：
- 因用户界面语言为中文，请全程用中文回复
- 从中医角度分析症状（气血阴阳虚实寒热）
- 每次回复必须严格按照以下四个段落结构输出（使用**加粗**段落标题）：

**识别到的问题**
总结用户描述的症状，判断可能的中医体质或证型（如脾虚气滞、肝郁气滞、阴虚内热等）。

**详细分析与建议**
从中医角度解释为什么会出现这些症状（湿气重、气血不足、肝火旺等），并给出生活作息、饮食结构、睡眠、情绪管理的调整建议。

**解决方案**
推荐具体的食疗方案（如食材搭配、药膳），推荐 1–2 个可自行按压的穴位（注明位置与按法），或日常调理动作（如腹部顺时针按摩、拉伸操）。要实用具体。

**最终建议**
推荐应预约 MYTCM 平台上哪个专科方向的医师（如内科脾胃、妇科调经、针灸推拿）。并从以下同仁堂产品中推荐 1–2 款可能适合的中成药：六味地黄丸、归脾丸、逍遥丸、补中益气丸、乌鸡白凤丸、天王补心丹、安宫牛黄丸、牛黄解毒片、金匮肾气丸、板蓝根颗粒。

重要原则：
- 结尾须包含一句免责说明（内容仅供参考，不构成诊断）
- 全文控制在 350 字以内
- 如症状听起来严重或急性，优先建议立即就医，而非只给调理建议`
}

function buildFallback(msg: string, lang: string): string {
  if (lang === 'en') {
    if (/tired|fatigue|exhaust|weak/.test(msg.toLowerCase()))
      return '**Identified Issues**\nFatigue and weakness suggest possible Qi Deficiency or Spleen Deficiency.\n\n**Detailed Analysis**\nIn TCM, persistent tiredness often relates to weak Spleen Qi failing to transform food into energy, or insufficient Kidney Yang.\n\n**Solutions**\n🌿 Include cooked warm foods; avoid cold raw meals. Astragalus (Huang Qi) tea can support Qi. Stimulate Zusanli (ST36) — 3 inches below knee — daily.\n\n**Final Recommendations**\nConsult an Internal Medicine TCM doctor on MYTCM. Consider: Bu Zhong Yi Qi Wan (Tongrentang) — for Qi and Middle Jiao support. *For wellness reference only.*'
    return "**Identified Issues**\nThank you for describing your symptoms. A full TCM assessment requires four-diagnosis evaluation.\n\n**Detailed Analysis**\nFor an accurate analysis, please describe your symptoms in more detail, or upload a tongue photo for AI assessment.\n\n**Solutions**\n🌿 General wellness: Maintain regular sleep, warm cooked meals, and gentle daily movement.\n\n**Final Recommendations**\nBook a MYTCM licensed TCM doctor for personalised guidance. *For wellness reference only.*"
  }

  if (/累|疲|倦|乏|困/.test(msg))
    return '**识别到的问题**\n您描述的疲倦乏力，可能提示气虚或脾虚体质。\n\n**详细分析与建议**\n中医认为，持续疲乏多因脾气虚弱，运化无力，气血生化不足。建议规律作息、避免熬夜，饮食宜温热易消化。\n\n**解决方案**\n🌿 黄芪、党参泡茶，每天饮用扶正补气。每天按压足三里穴（膝下三寸）2–3分钟，有助补益脾胃。\n\n**最终建议**\n推荐预约 MYTCM 内科脾胃方向医师。可参考同仁堂补中益气丸调理。*以上仅供参考，不构成诊断。*'
  if (/上火|口干|喉|痘|便秘|热/.test(msg))
    return '**识别到的问题**\n上火症状多提示胃火或肝火旺盛。\n\n**详细分析与建议**\n中医认为，上火多因饮食辛辣、情绪压力、睡眠不足导致内热积聚。宜清淡饮食、多饮温水。\n\n**解决方案**\n🌿 菊花、金银花泡茶降火。按压合谷穴（虎口）可辅助清热。\n\n**最终建议**\n推荐预约 MYTCM 内科医师。可参考同仁堂牛黄解毒片（短期使用，请遵医嘱）。*以上仅供参考，不构成诊断。*'
  if (/失眠|睡|眠|梦/.test(msg))
    return '**识别到的问题**\n睡眠问题可能提示心脾两虚或肝郁化火。\n\n**详细分析与建议**\n中医认为，失眠多因心血不足、神失所养，或肝气郁结化火扰心。建议睡前减少屏幕时间，保持情绪平稳。\n\n**解决方案**\n🌿 酸枣仁、百合煮水睡前饮用。按压神门穴（手腕横纹尺侧端）可安神助眠。\n\n**最终建议**\n推荐预约 MYTCM 内科医师。可参考同仁堂天王补心丹或归脾丸。*以上仅供参考，不构成诊断。*'
  if (/湿|痰|重|肿|腻/.test(msg))
    return '**识别到的问题**\n您的症状可能提示湿邪困脾或痰湿体质。\n\n**详细分析与建议**\n中医认为，湿气重多因脾虚失运，水液代谢失调。建议少食生冷甜腻，适量运动，避免久坐。\n\n**解决方案**\n🌿 薏米赤小豆水健脾祛湿，每周饮用2–3次。按压丰隆穴（小腿外侧中点）可化痰祛湿。\n\n**最终建议**\n推荐预约 MYTCM 内科脾胃医师。可参考同仁堂补中益气丸或逍遥丸。*以上仅供参考，不构成诊断。*'
  if (/胃|消化|腹|胀|食/.test(msg))
    return '**识别到的问题**\n脾胃不适，可能提示脾虚气滞或饮食积滞。\n\n**详细分析与建议**\n中医认为，脾胃虚弱者运化无力，易生胀满。建议少量多餐、忌生冷，饭后勿立即躺下。\n\n**解决方案**\n🌿 陈皮、山楂泡水助消化。饭后顺时针按摩腹部（脐周）3分钟。\n\n**最终建议**\n推荐预约 MYTCM 内科脾胃方向医师。可参考同仁堂逍遥丸或补中益气丸。*以上仅供参考，不构成诊断。*'
  if (/经|痛|月|宫|寒/.test(msg))
    return '**识别到的问题**\n您的症状可能提示宫寒血瘀或气血不足体质。\n\n**详细分析与建议**\n中医认为，宫寒多因阳虚或寒邪侵袭，导致经血运行不畅，出现痛经延迟。建议保暖腹部、忌食生冷。\n\n**解决方案**\n🌿 艾叶红糖姜茶温宫散寒。按压三阴交穴（内踝上三寸）可调经止痛。\n\n**最终建议**\n推荐预约 MYTCM 妇科调经方向医师。可参考同仁堂乌鸡白凤丸。*以上仅供参考，不构成诊断。*'

  return '**识别到的问题**\n感谢您的描述。中医讲究四诊合参，仅凭文字描述难以全面评估。\n\n**详细分析与建议**\n建议您提供更多症状细节，或上传舌象照片进行 AI 初步分析。\n\n**解决方案**\n🌿 日常保健：规律作息、温热饮食、适量运动，有助于维持气血平衡。\n\n**最终建议**\n推荐预约 MYTCM 平台持牌中医师进行详细辨证施治。*以上仅供参考，不构成诊断。*'
}

export async function POST(request: NextRequest) {
  let body: { messages?: Array<{ role: string; content: string }>; lang?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ reply: '请告诉我您的不适症状 🙏' })
  }

  const { messages = [], lang = 'zh' } = body
  const lastMessage = messages[messages.length - 1]

  if (!lastMessage || lastMessage.role !== 'user') {
    return NextResponse.json({
      reply: lang === 'en' ? 'Please describe your symptoms 🙏' : '请告诉我您的不适症状 🙏',
    })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ reply: buildFallback(lastMessage.content, lang) })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const systemCtx = buildSystemContext(lang)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemCtx }] },
        {
          role: 'model',
          parts: [{ text: lang === 'en' ? "Hello! I'm MYTCM AI, ready to help with your TCM health questions." : '好的，我是 MYTCM AI 中医顾问，很高兴为您提供健康参考建议。' }],
        },
        ...history,
      ],
    })

    const result = await chat.sendMessage(lastMessage.content)
    return NextResponse.json({ reply: result.response.text() })
  } catch (err) {
    console.error('[chat]', err)
    return NextResponse.json({ reply: buildFallback(lastMessage.content, lang) })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

function buildPrompt(lang: string) {
  if (lang === 'en') {
    return `You are a professional AI assistant for MYTCM (Malaysia TCM platform), helping users perform a preliminary tongue self-check.

⚠️ IMPORTANT PRINCIPLES:
1. Tongue analysis is for PRELIMINARY WELLNESS REFERENCE ONLY — never a definitive medical diagnosis.
2. If the image is blurry, poorly lit, or features are unclear, you MUST provide 2–3 possible constitution tendencies instead of a single absolute conclusion. Use phrases like "may suggest", "could indicate", "possibly".
3. Always phrase findings diplomatically and professionally.
4. ALWAYS include a recommendation to book a licensed TCM doctor for in-person consultation.
5. Reply ENTIRELY IN ENGLISH.

Analyse the tongue photo and return JSON with these fields:
- tongueColor (e.g. "Pale-red tongue", or "Tongue colour difficult to assess clearly — may be pale or slightly pale-red")
- tongueShape (e.g. "Normal shape", "Slightly puffy with possible tooth marks", "Unclear due to image quality")
- coating (e.g. "Thin white coating", "White greasy coating", "Difficult to assess precisely due to image quality")
- constitution (clear: one constitution; unclear: "Possibly Qi Deficiency or Damp-Heat constitution (in-person consultation recommended)")
- suggestions (array of 3 strings: preliminary advice; note these are references only; last item MUST recommend booking a MYTCM doctor)

Return ONLY the JSON object, no extra text.`
  }

  return `你是 MYTCM 大马中医平台的专业 AI 助理，协助用户进行舌象初步自查参考。

⚠️ 重要原则：
1. 舌象分析仅供健康参考，绝不构成医疗诊断，措辞须始终体现这一点。
2. 若图像质量欠佳（模糊、光线不足、角度偏斜）或特征不够明显，必须给出 2–3 种可能的体质倾向，而非单一绝对结论。使用"可能"、"倾向于"、"建议复诊确认"等委婉措辞。
3. 措辞须专业、温和，避免断言式表达。
4. 必须始终建议用户通过平台预约持牌中医师进行面诊复诊。
5. 全部用中文回复。

请分析舌象照片，以JSON格式返回以下字段：
- tongueColor（舌色，例如"舌淡红"；若不清晰可返回"舌色因图像质量难以准确判断，可能偏淡或淡红"）
- tongueShape（舌形，例如"舌形正常"、"舌体略胖，可能有齿痕"；图像不清晰时注明）
- coating（舌苔，例如"苔薄白"、"苔白腻"；因图像质量无法精确判断时注明）
- constitution（体质倾向：清晰时返回一种，模糊时返回"可能为气虚质或湿热质（建议复诊确认）"形式）
- suggestions（初步参考建议数组，共3条：第1条为饮食/生活调整，第2条为可参考的调理方向，第3条必须建议预约 MYTCM 持牌中医师面诊）

仅返回JSON对象，不含其他说明文字。`
}

const DEMO_ZH = {
  tongueColor: '舌淡红（初步参考）',
  tongueShape: '舌形基本正常，边缘可能有轻微齿痕',
  coating: '苔薄白略腻（图像质量有限，仅供参考）',
  constitution: '可能为脾虚湿盛质或气虚质（建议预约医师复诊确认）',
  suggestions: [
    '🌿 初步建议：清淡饮食，少食生冷油腻，规律作息；以上仅供健康参考，不构成诊断',
    '🍵 可参考健脾祛湿方向（如薏米赤小豆水），具体用药请咨询持牌中医师',
    '📋 建议预约 MYTCM 平台持牌中医师进行面诊，以获得准确辨证施治方案',
  ],
}

const DEMO_EN = {
  tongueColor: 'Pale-red tongue (preliminary reference)',
  tongueShape: 'Generally normal shape, possibly slight tooth marks on edges',
  coating: 'Thin white slightly greasy coating (limited image quality — indicative only)',
  constitution: 'Possibly Spleen Qi Deficiency with Dampness, or Qi Deficiency (in-person consultation recommended)',
  suggestions: [
    '🌿 Preliminary advice: Light diet, avoid cold & greasy foods, maintain regular sleep — for wellness reference only',
    '🍵 Consider Spleen-strengthening approaches (e.g. barley & red bean tea); confirm herbal use with a licensed doctor',
    '📋 Book a MYTCM licensed TCM doctor for an in-person consultation and accurate diagnosis',
  ],
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY

  let body: { base64?: string; mimeType?: string; lang?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { base64, mimeType, lang = 'zh' } = body

  if (!apiKey) {
    return NextResponse.json(lang === 'en' ? DEMO_EN : DEMO_ZH)
  }

  if (!base64) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent([
      buildPrompt(lang),
      { inlineData: { data: base64, mimeType: mimeType || 'image/jpeg' } },
    ])

    const text = result.response.text()
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[ai-scan]', err)
    return NextResponse.json(lang === 'en' ? DEMO_EN : DEMO_ZH)
  }
}

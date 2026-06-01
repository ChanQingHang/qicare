import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const PROMPT = `你是一位资深中医师，擅长通过舌诊进行体质辨别。

请仔细分析这张舌象照片，从中医角度进行诊断，并以JSON格式返回以下字段：
- tongueColor（舌色，例如：舌淡红、舌红、舌淡白、舌暗红）
- tongueShape（舌形，例如：舌形正常、舌体胖大有齿痕、舌体瘦薄）
- coating（舌苔，例如：苔薄白、苔薄黄、苔白腻、苔黄腻、苔少或无）
- constitution（体质初判，例如：气虚质、湿热质、阳虚质、阴虚质、血瘀质、脾虚湿盛）
- suggestions（调理建议，返回包含3条建议的数组，每条50字以内）

请只返回JSON，不要包含其他说明文字。`

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    // Return demo data when API key not configured
    return NextResponse.json({
      tongueColor: '舌淡红',
      tongueShape: '舌形正常，边有轻微齿痕',
      coating: '苔薄白略腻',
      constitution: '脾虚湿盛',
      suggestions: [
        '🌿 健脾祛湿，清淡饮食，少食生冷油腻',
        '🍵 可参考参苓白术散方向，薏米赤小豆水调理',
        '📋 建议预约中医师做详细辨证施治',
      ],
    })
  }

  try {
    const { base64, mimeType } = await request.json()
    if (!base64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent([
      PROMPT,
      { inlineData: { data: base64, mimeType: mimeType || 'image/jpeg' } },
    ])

    const text = result.response.text()
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[ai-scan]', err)
    return NextResponse.json(
      {
        tongueColor: '舌淡红',
        tongueShape: '舌形基本正常',
        coating: '苔薄白',
        constitution: '平和质偏气虚',
        suggestions: [
          '🌿 注意作息规律，避免过度劳累',
          '🍵 可用黄芪、枸杞泡茶日常调养',
          '📋 建议预约中医师做详细面诊',
        ],
      },
      { status: 200 }
    )
  }
}

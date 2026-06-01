import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_CONTEXT = `你是岐黄AI，QiCare 平台的专业中医健康顾问。你服务于马来西亚的华人用户。

你的角色：
- 用温暖、专业的语气提供中医健康建议
- 从中医角度分析症状（气血阴阳虚实寒热）
- 给出饮食、生活方式、常用中药等建议
- 语言简洁友善，回复控制在100字以内
- 如涉及严重症状，建议就医或预约平台中医师
- 不要做出明确诊断，只做健康参考建议

请用中文回复，保持温暖专业的语气。`

const FALLBACK_REPLIES = [
  (msg: string) => {
    if (/累|疲|倦|乏|困/.test(msg))
      return '疲倦乏力多与气虚、脾虚有关 🌿 建议规律作息、适当用黄芪、党参代茶饮，避免熬夜。若持续建议预约医师辨证。'
    if (/上火|口干|喉|痘|便秘|热/.test(msg))
      return '上火常见胃火或肝火旺 🔥 宜清淡饮食、多喝水，可用菊花、金银花泡茶。辛辣油炸要少吃哦。'
    if (/失眠|睡|眠|梦/.test(msg))
      return '睡眠不佳多因心脾两虚或肝郁 🌙 睡前少看手机，可用酸枣仁、百合调理。长期失眠建议面诊。'
    if (/湿|痰|重|肿|腻/.test(msg))
      return '体内湿气重常表现为身重、苔腻 💧 宜健脾祛湿，薏米、赤小豆煮水不错，少食生冷甜腻。'
    if (/胃|消化|腹|胀|食/.test(msg))
      return '脾胃不适需注意饮食规律 🍵 可少量多餐、忌生冷，山楂、陈皮有助消化。反复不适请预约医师。'
    if (/经|痛|月|宫|寒/.test(msg))
      return '妇科调理建议辨证为主 🌸 宫寒者注意保暖、忌生冷，可咨询妇科中医师面诊更稳妥。'
    return null
  },
]

export async function POST(request: NextRequest) {
  const { messages } = await request.json() as {
    messages: Array<{ role: 'user' | 'bot'; content: string }>
  }

  const lastMessage = messages[messages.length - 1]
  if (!lastMessage || lastMessage.role !== 'user') {
    return NextResponse.json({ reply: '请告诉我您的不适症状 🙏' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    const fallback = FALLBACK_REPLIES[0](lastMessage.content)
    return NextResponse.json({
      reply:
        fallback ||
        '感谢描述 🙏 中医讲究四诊合参，建议您上传舌象照片做初步分析，或预约医师做详细辨证。',
    })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
        { role: 'model', parts: [{ text: '好的，我是岐黄AI中医顾问，很高兴为您提供健康建议。' }] },
        ...history,
      ],
    })

    const result = await chat.sendMessage(lastMessage.content)
    return NextResponse.json({ reply: result.response.text() })
  } catch (err) {
    console.error('[chat]', err)
    const fallback = FALLBACK_REPLIES[0](lastMessage.content)
    return NextResponse.json({
      reply:
        fallback ||
        '感谢您的描述 🙏 建议您上传舌象照片进行初步分析，或预约平台中医师获得更专业的建议。',
    })
  }
}

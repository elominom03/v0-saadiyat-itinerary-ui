// Quick test script to verify Gemini API is working
import 'dotenv/config'
import { GoogleGenAI } from '@google/genai'

async function testGemini() {
  console.log('\n🧪 Testing Gemini API...\n')
  
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env')
    process.exit(1)
  }
  
  console.log('✓ API key found:', apiKey.substring(0, 10) + '...')
  
  const ai = new GoogleGenAI({ apiKey })
  
  // Test with different models
  const models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ]
  
  console.log('\nTrying different models...\n')
  
  for (const modelName of models) {
    try {
      console.log(`Testing: ${modelName}`)
      
      const result = await ai.models.generateContent({
        model: modelName,
        contents: 'Say hello in 5 words'
      })
      
      console.log(`✅ SUCCESS! ${modelName} is working!`)
      console.log(`   Response: "${result.text.trim()}"`)
      console.log('\n🎉 GEMINI IS WORKING!\n')
      console.log(`Use this model in your app: ${modelName}\n`)
      process.exit(0)
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message?.substring(0, 100)}`)
    }
  }
  
  console.log('\n❌ ALL MODELS FAILED')
  console.log('\nPossible issues:')
  console.log('1. API key invalid - get new one from: https://makersuite.google.com/app/apikey')
  console.log('2. Generative Language API not enabled')
  console.log('3. Gemini 2.0+ not available for your project yet')
  console.log('\nCheck: https://console.cloud.google.com/apis/dashboard\n')
  process.exit(1)
}

testGemini().catch(error => {
  console.error('\n❌ Test failed:', error)
  process.exit(1)
})

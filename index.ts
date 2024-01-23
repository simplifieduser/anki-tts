#!/usr/bin/env/ node

import sdk from "microsoft-cognitiveservices-speech-sdk"
import { readFile } from "fs/promises"

if (process.env.SPEECH_KEY == undefined || process.env.SPEECH_REGION == undefined) process.exit(1)
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION)
speechConfig.speechSynthesisVoiceName = "ja-JP-NanamiNeural"

const stringList = await readFile("input.json") 
const list = stringList.toString().split("\n")

let i = 0

for (const item of list) {

  const outputFile = "./out/" + i + ".mp3"
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputFile)

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)
  synthesizer.speakTextAsync()
  

}

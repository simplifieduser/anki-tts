#!/usr/bin/env/ node

import sdk from "microsoft-cognitiveservices-speech-sdk"
import { readFile, mkdir } from "fs/promises"
import dotenv from "dotenv"

dotenv.config()

if (process.env.AZURE_KEY == undefined || process.env.AZURE_REGION == undefined) process.exit(1)
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.AZURE_KEY, process.env.AZURE_REGION)
speechConfig.speechSynthesisVoiceName = "ja-JP-NanamiNeural"

await mkdir("./out", { recursive: true })

const stringList = await readFile("input.txt") 
const list = stringList.toString().split("\n")

let i = 1

for (let item of list) {

  console.log("Converting " + i + ": \"" + item + "\"")

  const outputFile = "./out/" + i + ".mp3"
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputFile)

  let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)

  await new Promise<void>((res) => synthesizer.speakTextAsync(item, () => res()))
  synthesizer.close()

  i++;

}

console.log("Done!")
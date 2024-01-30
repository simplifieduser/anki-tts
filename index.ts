#!/usr/bin/env/ node

import sdk from "microsoft-cognitiveservices-speech-sdk"
import { readFile, mkdir, writeFile } from "fs/promises"
import dotenv from "dotenv"

dotenv.config()
if (process.env.AZURE_KEY == undefined || process.env.AZURE_REGION == undefined) process.exit(1)

const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.AZURE_KEY, process.env.AZURE_REGION)
speechConfig.speechSynthesisVoiceName = process.env.AZURE_VOICE || "en-US-AriaNeural"
speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3

await mkdir("./out", { recursive: true })

const stringList = await readFile("input.txt") 
const list = stringList.toString().split("\n")

const prefix = process.env.FILE_PREFIX || ""

const fieldIndexString = process.env.FIELD_INDEX || "0"
let fieldIndex = parseInt(fieldIndexString)
if (isNaN(fieldIndex) || fieldIndex < 0) fieldIndex = 0

let numberOfDigits = (Math.log10((list.length ^ (list.length >> 31)) - (list.length >> 31)) | 0) + 1
let fileNames: string[] = []
let i = 1

for (let line of list) {

  line.trim()
  if (line == "" || line.startsWith("#")) continue
  const items = line.split("\t")

  const item = items[fieldIndex]

  console.log("Converting " + i + ": \"" + item + "\"")

  const fileName = prefix + i.toLocaleString("de-DE", {
    minimumIntegerDigits: numberOfDigits,
    useGrouping: false
  })
  const outputFile = "./out/" + fileName + ".mp3"
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputFile)

  fileNames.push(fileName + ".mp3")

  let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)

  await new Promise<void>((res) => synthesizer.speakTextAsync(item, (result) => {
    if (result.errorDetails != undefined) console.log(result.errorDetails)
    res()
  }))
  synthesizer.close()

  await new Promise<void>((res) => setTimeout(res, 500))

  i++;

}


let outputString = ""
let j = 0;

for (let item of list) {

  if (item.trimEnd() == "") {
    continue
  }
  else if (item.startsWith("#")) {

    outputString += item.trimEnd() + "\n"

  }
  else {

    item = item.trimEnd()
    if (item.indexOf("[sound:") > 0)
      item = item.slice(0, item.indexOf("[sound:"))
    item = item.trimEnd()

    outputString += item + "\t[sound:" + fileNames[j] + "]\n"
    j++;

  }

}

await writeFile("output.txt", outputString)

console.log("Done!")
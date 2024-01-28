# Anki Flashcards TTS Converter

## Description
This script is a Text-to-Speech (TTS) converter for Anki flashcards. It uses the Microsoft Cognitive Services Speech SDK to convert text from a specified field in the flashcards into speech. The speech is then saved as an MP3 file.

## Options
Options may be set by environmental variables, like a .env file.

| Name          | Description                                           | Default             |
|---------------|-------------------------------------------------------|---------------------|
| AZURE_KEY*    | Azure Speech Resource API-Key                         | must be set by user |
| AZURE_REGION* | Azure Speech Resource Region                          | must be set by user |
| AZURE_VOICE   | Azure voice to use                                    | en-US-AriaNeural    |
| FILE_PREFIX   | Prefix added to generated audio files                 | no prefix           |
| FIELD_INDEX   | (Zero-)Index of the field that should be synthesized. | 0 (first)           |
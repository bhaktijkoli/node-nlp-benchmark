const { readFileSync } = require('fs')
const { dockStart } = require('@nlpjs/basic')

const MODEL_PATH = './model.nlp'
const MESSAGES_PATH = './messages.json'

const getDifferenceInSeconds = (date1, date2) => {
  const difference = date2.getTime() - date1.getTime();
  const seconds = difference / 1000;
  return seconds;
}

const start = async () => {
  console.log("Starting Benchmark")
  let start = new Date()
  const dock = await dockStart({
    settings: {
      nlp: {
        forceNER: true,
        languages: ['en'],
        autoSave: false
      }
    },
    use: ['Basic', 'LangEn']
  })
  manager = dock.get('nlp')
  await manager.load(MODEL_PATH)
  console.log("Model loading time: " + getDifferenceInSeconds(start, new Date()) + "s")
  const messages = JSON.parse(readFileSync(MESSAGES_PATH, 'utf8'))
  start = new Date()
  await manager.process('en', messages[0])
  console.log("Processing time for 1 message: " + getDifferenceInSeconds(start, new Date()) + "s")
  start = new Date()
  for (const message of messages) {
    await manager.process('en', message)
  }
  console.log(`Processing time for ${messages.length} messages: ` + getDifferenceInSeconds(start, new Date()) + "s")
}

start()


const moment = require('moment')
const wrap = require('word-wrap')
const chalk = require('chalk')
const { path } = require('ramda')
const Config = require('./config/index')
const api = require('../api/index')
module.exports = {
  command:'notifications',
  short: 'n',
  options: [
    ['-u, --unread', 'only show unread messages']
  ],
  action: async (commandObj) => {
    const config = new Config()
    await config.init()
    const apiToken = await config.get('apiToken')
    if (!apiToken) {
      throw new Error('Api token not set, run ptim config apiToken <YOUR TOKEN>')
    }
    const { notifications } = api(apiToken)
    const n = await notifications()
    let data = (await notifications())
      .data
      .reverse()
      .map((notification) => new Notification(notification))

    if (commandObj.unread) {
      data = data.filter(n => !n.read)
    }
    const unreadCount = data.filter(n => !n.read).length

    data.map(d => d.render())
    console.log(`${chalk.white.bgRed(` ${unreadCount} `)} unread messages`)
    console.log('')
  }
}

class Notification {
  constructor (data) {
   this.data = data
  }
  render () {
    const datePadding = 36
    const prePad = ' '.repeat(datePadding)
    const d = this.localTimestamp.padEnd(datePadding)
    const sid = ('#' + this.storyId).padEnd(datePadding)
    if (this.read) {
      console.log(chalk.dim.gray(d + this.storyName))
      console.log(chalk.dim.gray(sid + this.message))
      console.log(chalk.dim.underline.gray(this.url))
      console.log('\n\n')
      return
    }
    console.log(chalk.blueBright(d) + chalk.white(this.storyName))
    console.log(chalk.grey(sid) + chalk.yellow(this.message))
    if (this.context) {
      const c = wrap(this.context)
        .split('\n')
        .forEach(line => console.log(prePad.slice(2) + chalk.green(line)))
    }
    console.log(chalk.dim.underline.blue(this.url))
    console.log('\n\n')
  }
  get id () {
    return this.data.id
  }

  get message () {
    return this.data.message
  }

  get url () {
    let uri = `https://www.pivotaltracker.com/story/show/${this.data.story.id}`
    if (this.data.comment_id) { uri += `/comments/${this.data.comment_id}`  }
    return uri
  }
  get read () {
    return !!this.data.read_at
  }

  get storyName () {
    return this.data.story.name 
  }

  get storyId () {
   return this.data.story.id
  }

  get context () {
    return this.data.context
  }

  get unixTimestamp () {
    return (new Date(this.data.updated_at)).getTime()
  }

  get localTimestamp () {
    return moment(this.data.updated_at).format('YYYY-MM-DD dddd h:m a')
  }
}
/*

{ kind: 'notification',
       id: 453415776,
       project: [Object],
       performer: [Object],
       message: 'Brian Goodman accepted your story',
       notification_type: 'story',
       action: 'acceptance',
       story: [Object],
       created_at: '2019-09-19T01:19:03Z',
       updated_at: '2019-09-19T01:37:35Z',
       read_at: '2019-09-19T01:37:35Z' },
     { kind: 'notification',
       id: 453415817,
       project: [Object],
       performer: [Object],
       message: 'Brian Goodman accepted your story',
       notification_type: 'story',
       action: 'acceptance',
       story: [Object],
       created_at: '2019-09-19T01:20:40Z',
       updated_at: '2019-09-19T01:37:19Z',
       read_at: '2019-09-19T01:37:19Z' },
     { kind: 'notification',
       id: 453415501,
       project: [Object],
       performer: [Object],
       message: 'Brian Goodman added the comment',
       context:
        '@thoeyn - our hangup and difficulty here is with the upload/attachment of a purchase order. A few questions for you\n- does SHI themselves make up most of these? \n- do the POs generally have the sam
e few things\n- do we *have* to have a copy of it or can w…',
       notification_type: 'comment',
       new_attachment_count: 0,
       action: 'create',
       story: [Object],
       comment_id: 206841128,
       created_at: '2019-09-19T01:11:22Z',
       updated_at: '2019-09-19T01:11:22Z' }
       */

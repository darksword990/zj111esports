module.exports = {
    name: 'avatar',
    description: 'Shows mentioned member\'s profile picture or your own profile picture',
    aliases: ['av'],
    category: `essentials`,
    usage: `<member mention/member id>(optional)`,
    examples: ['@Crawler', '767858235465342', 'crawler', 'thor'],
    run: async (client, message, args, prefix) => {
        if (!args.length) {
            return message.channel.send(
                {
                    embed: {
                        title: `Avatar`,
                        author: {
                            name: message.member.user.tag,
                            icon_url: message.member.user.displayAvatarURL({format: 'png', dynamic: true})
                        },
                        image: {
                            url: message.member.user.displayAvatarURL({format: 'png', dynamic: true, size: 4096})
                        }
                    }
                }
            )
        }
        let strings = []
        for (const arg of args) {
            strings.push(arg.toLowerCase())
        }
        const member = message.guild.members.cache.find(f => f.displayName.toLowerCase().includes(strings.join(" "))) || message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (member) {
            message.channel.send(
                {
                    embed: {
                        title: `Avatar`,
                        author: {
                            name: message.member.user.tag,
                            icon_url: message.member.user.displayAvatarURL({format: 'png', dynamic: true})
                        },
                        image: {
                            url: member.user.displayAvatarURL({format: 'png', dynamic: true, size: 4096})
                        }
                    }
                }
            )
        }
    }
}
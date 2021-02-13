const disable = require('../../schemas/enable-disable-cmd-schema')

module.exports = {
    name: `disablecmd`,
    aliases: ['disable'],
    description: 'Disables the mentioned command',
    permissions: ['ADMINISTRATOR'],
    category: 'essentials',
    usage: '<command name>',
    examples: [`kick`, `warn`],
    run: async (client, message, args) => {
        const commandName = args[0]
        const c = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
        if (!c) return;
        let cmd = await disable.findOne({
            Guild: message.guild.id
        })
        
        if (!cmd.Command.includes(c.name)) {
            await disable.findOneAndUpdate(
                {
                    Guild: message.guild.id
                },
                {
                    Guild: message.guild.id,
                    $push: {
                        Command: c.name
                    }
                },
                {
                    new: true,
                    upsert: true
                }
            )
            message.channel.send(`Successfully disabled the command`)
        } else {
            message.channel.send(`Command already disabled`)
        }
    }
}
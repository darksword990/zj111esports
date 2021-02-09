module.exports = {
    name: 'listbans',
    aliases: ['lbans', 'lb'],
    description: `Lists all the banned members from this guild`,
    permissions: [`BAN_MEMBERS`],
    category: `moderation`,
    run: async (client, message, args, prefix) => {
        let bans = await message.guild.fetchBans()
        let bansarray = bans.array()
        if (bansarray.length == 0) {
            return message.channel.send(`There's no banned member`)
        }
        let bansinfos = []
        for (const ban of bansarray) {
            let fetched = await client.users.fetch(ban.user.id)
            bansinfos.push(`\`${fetched.tag}\``)
        }
        let currentpage = 0
        let embeds = generateEmbeds(bansinfos)
        const embed = {
            color: 0xff0000,
            author: {
                name: message.member.user.tag,
                icon_url: message.member.user.displayAvatarURL({format: 'png', dynamic: true})
            },
            title: `Guild Bans`,
            description: embeds[currentpage],
            footer: {
                text: `Current Page ${currentpage+1}/${embeds.length}`
            }
        }
        let bansembed = await message.channel.send({embed: embed})
        await bansembed.react('⬅️');
        await bansembed.react('➡️');
        await bansembed.react('❌');

        const filter = (reaction, user) => ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && (message.author.id === user.id);
        const collector = bansembed.createReactionCollector(filter);

        collector.on('collect', async (reaction, user) => {
        // If there are 2 embeds.
        if (reaction.emoji.name === '➡️') {
            if (currentpage < embeds.length-1) {
            currentpage++;
            embed.description = embeds[currentpage]
            embed.footer.text = `Current Page: ${currentpage+1}/${embeds.length}`
            await bansembed.edit({embed: embed})
            } 
        } else if (reaction.emoji.name === '⬅️') {
            if (currentpage !== 0) {
            --currentpage;
            embed.description = embeds[currentpage]
            embed.footer.text = `Current Page: ${currentpage+1}/${embeds.length}`
            await bansembed.edit({embed: embed})
            }
        } else {
            collector.stop();
            console.log('Stopped collector..');
            await bansembed.delete();
        }
        })
    }
}

function generateEmbeds(emb) {
    let embeds = []
    const looptimes = 50
    let k = looptimes
    for (let i = 0; i < emb.length; i += looptimes) {
        const current = emb.slice(i, k)
        k += looptimes
        const info = current.join(", ")
        embeds.push(info)
    }
    return embeds
}
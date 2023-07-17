import {GuildMember} from 'discord.js';
import {useQueue} from 'discord-player';


export default{
  name: 'skip',
  description: 'Skip a song!',
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    ) {
      return void interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const queue = useQueue(interaction.guild.id)
    if (!queue || !queue.currentTrack) return void interaction.followUp({content: '❌ | No music is being played!'});
    const currentTrack = queue.currentTrack;

    const success = queue.node.skip()
    return void interaction.followUp({
      content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
    });
  },
};

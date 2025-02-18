import {GuildMember, ApplicationCommandOptionType} from 'discord.js';
import {useQueue} from 'discord-player';


export default{
  name: 'volume',
  description: 'Change the volume!',
  options: [
    {
      name: 'volume',
      type: ApplicationCommandOptionType.Integer,
      description: 'Number between 0-200',
      required: true,
    },
  ],
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
    const queue = useQueue(interaction.guild.id);
    if (!queue || !queue.currentTrack)
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });

    let volume = interaction.options.getInteger('volume');
    volume = Math.max(0, volume);
    volume = Math.min(200, volume);
    const success = queue.node.setVolume(volume);

    return void interaction.followUp({
      content: success ? `🔊 | Volume set to ${volume}!` : '❌ | Something went wrong!',
    });
  },
};

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('nukeall')
    .setDescription('⚠️ Verwijdert ALLE kanalen in de server (alleen eigenaar)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const ownerId = "1472237148324233361"; // Jouw ID

    if (interaction.user.id !== ownerId) {
      return interaction.reply({
        content: "❌ Jij mag dit command niet gebruiken.",
        ephemeral: true
      });
    }

    await interaction.reply("💣 Server wordt genuked...");

    const guild = interaction.guild;

    // Alle kanalen verwijderen
    for (const [id, channel] of guild.channels.cache) {
      try {
        await channel.delete("Nuke all command uitgevoerd door eigenaar");
      } catch (err) {
        console.log(`Kon kanaal ${channel.name} niet verwijderen:`, err.message);
      }
    }

    // Nieuw kanaal aanmaken zodat je nog kunt praten
    const newChannel = await guild.channels.create({
      name: "reset",
      reason: "Server genuked"
    });

    newChannel.send("💥 Alle kanalen zijn verwijderd door de eigenaar.");
  }
};

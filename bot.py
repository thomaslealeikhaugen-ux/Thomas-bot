import discord
import asyncio
from discord.ext import commands

# ... hier staat je bestaande bot initialisatie (bijv. bot = commands.Bot(...)) ...

@bot.event
async def on_ready():
    print(f'{bot.user} is online en de Status Loop is gestart!')
    
    # Dit zorgt ervoor dat het script oneindig blijft herhalen
    while True:
        try:
            # Forceer jouw status
            await bot.change_presence(
                activity=discord.Game(name="Moderating and more!")
            )
        except Exception as e:
            print(f"Status update mislukt: {e}")
            
        # Wacht 10 seconden voor de volgende push (sneller dan dit kan Discord weigeren)
        await asyncio.sleep(10)

#### nadeBot is a Node.js Discord bot which aims to teach smokes, molotovs and pop flashes on some CS:GO maps.

## Current features:
* Summon bot by @ing it
* Reaction "menus" are used as input, only the user who summoned the bot can use the menu
* Selection of map => grenade type => specific location on map
* Image with 4 perspectives and throw type is sent on selection
* The image/menu can be dismissed by using the "X" on the reacion menu
* Able to process multiple user requests concurrently
* Runs 24/7 on my Raspberry Pi 3B+

## Current issues:
* Requires custom emojis to work. This can be fixed by adding non custom alternate emojis
* If multiple users are using the bot at the same time they are allowed to click on each other's menu
* Currently, only smokes for Mirage have been added. Most of the code is there but the images and .json information need to be made

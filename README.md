# Better Entity Link
Improve your productivity with contextmenus on entity links!


🚀 No configuration

🗺️ Work with all windows

💬 Work with all languages

❤️ Work with all systems

🤝 Extensible with other modules

Minimum Core Version: v9

# Demo

Preview and activate scenes from scene link:

![scene-contextmenu](https://user-images.githubusercontent.com/1334405/128219650-8399151c-f701-4833-b3c9-1d0cca8e45e7.gif)

Roll a table from rolltable link:

![rolltable-contextmenu](https://user-images.githubusercontent.com/1334405/128219658-64f18131-a46f-4ec2-838c-9ff8afd3c21e.gif)

# Extensibility

You are a developer and you want to add your own action to contextmenus? Here's how to !
```js
Hooks.on("ready", () => {

  // Register an action for Scene document link
  game.modules.get("better-entity-link").registerSceneAction({
      name: "SCENES.View",
      icon: "fa-eye fa-fw",
      condition: async document => game.user.isGM,
      callback:  async entity => await entity.view()
  });
  
  // Register "Roll" action on RollTable document link
  game.modules.get("better-entity-link").registerRolltableAction({
      name: "TABLE.Roll",
      icon: "fa-dice-d20",
      condition: async document => game.user.isGM || game.user.isTrusted
          || [CONST.ENTITY_PERMISSIONS.OBSERVER, CONST.ENTITY_PERMISSIONS.OWNER].includes(entity.permission),
      callback:  async document => await document.draw()
  });
    
}
```

Actions menu must be register on "ready" event. All module methods are registered in `game.modules.get("better-entity-link")`. Here is all available methods:
  * registerActorAction(options)
  * registerItemAction(options)
  * registerSceneAction(options)
  * registerJournalEntryAction(options)
  * registerMacroAction(options)
  * registerRolltableAction(options)

Argument `options` is an object like this:
```js
{
    name:      "Action label",        // Name of action displayed in contextmenu. Support i18n key.
    icon:      "fa-eye",              // No need to give all <i> tag, just font-awesome icon name. You can give multiple ones
    condition: async () => true,      // An optional async predicate to show or hide action whyen context menu is rendered
    callback:  async (document) => {} // Async method to execute on click. `document` is resolved for you based on used register methods, id and pack in link.
}
```

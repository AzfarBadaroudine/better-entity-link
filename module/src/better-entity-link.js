import {BetterEntityLink} from "./BetterEntityLink.js";

Hooks.on('ready', () => {

    // Scene - "View" button
    BetterEntityLink.registerSceneAction({
        name: "SCENES.View",
        icon: "fa-eye",
        condition: entity => game.user.isGM,
        callback: async entity => {
            if (entity.active || !game.user.isGM) return
            await entity.view()
        }
    });

    // Scene - "Activate" button
    BetterEntityLink.registerSceneAction({
        name: "SCENES.Activate",
        icon: "fa-bullseye",
        condition: entity => game.user.isGM,
        callback: async entity => {
            if (entity.active || !game.user.isGM) return
            await entity.activate()
        }
    });

    // RollTable - "Roll" button
    BetterEntityLink.registerRolltableAction({
        name: "TABLE.Roll",
        icon: "fa-dice-d20",
        condition: entity => game.user.isGM || game.user.isTrusted
            || [CONST.ENTITY_PERMISSIONS.OBSERVER, CONST.ENTITY_PERMISSIONS.OWNER].includes(entity.permission),
        callback: async entity => await entity.draw()
    });

    // Macro - "Edit Macro" button
    BetterEntityLink.registerMacroAction({
        name: "MACRO.Edit",
        icon: "fa-edit",
        condition: entity => game.user.isGM || game.user.isTrusted
            || [CONST.ENTITY_PERMISSIONS.OBSERVER, CONST.ENTITY_PERMISSIONS.OWNER].includes(entity.permission),
        callback: async entity => entity.sheet.render(true)
    });

    // Actor - "View Character Artwork" button
    BetterEntityLink.registerActorAction({
        name: "SIDEBAR.CharArt",
        icon: "fa-image",
        condition: entity => {
            return entity?.img !== CONST.DEFAULT_TOKEN
                && (game.user.isGM || game.user.isTrusted
                    || [CONST.ENTITY_PERMISSIONS.OBSERVER, CONST.ENTITY_PERMISSIONS.OWNER].includes(entity.permission));
        },
        callback: async entity => {
            const imagePoput = new ImagePopout(entity?.img, {
                title: entity.name,
                shareable: true,
                uuid: entity.uuid
            });
            imagePoput.render(true);
        }
    });

    // Actor - "View Token Artwork" button
    BetterEntityLink.registerActorAction({
        name: "SIDEBAR.TokenArt",
        icon: "fa-image",
        condition: entity => {
            if (entity?.prototypeToken?.texture?.src) return false;
            return ![undefined, null, CONST.DEFAULT_TOKEN].includes(entity?.prototypeToken.texture.src)
                && (game.user.isGM || game.user.isTrusted
                    || [CONST.ENTITY_PERMISSIONS.OBSERVER, CONST.ENTITY_PERMISSIONS.OWNER].includes(entity.permission))
        },
        callback: async entity => {
            const imagePoput = new ImagePopout(entity?.prototypeToken.texture.src, {
                title: entity.name,
                shareable: true,
                uuid: entity.uuid
            });
            imagePoput.render(true);
        }
    });

    // Item - "View Item Artwork" button
    BetterEntityLink.registerItemAction({
        name: "ITEM.ViewArt",
        icon: "fa-image",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN
            && (game.user.isGM || game.user.isTrusted
                || [CONST.ENTITY_PERMISSIONS.OBSERVER, CONST.ENTITY_PERMISSIONS.OWNER].includes(entity.permission)),
        callback: async entity => {
            const imagePoput = new ImagePopout(entity?.img, {
                title: entity.name,
                shareable: true,
                uuid: entity.uuid
            });
            imagePoput.render(true);
        }
    });

    // JournalEntry - "Show players (Text)" button
    BetterEntityLink.registerJournalEntryAction({
        name: `${game.i18n.localize("JOURNAL.ActionShow")} (${game.i18n.localize("JOURNAL.ModeText")})`,
        icon: "fa-eye",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted),
        callback: async entity => {
            await game.socket.emit("showEntry", entity.uuid, "text", true, entry => {
                Journal._showEntry(entity.uuid, "text", true);
                ui.notifications.info(game.i18n.format("JOURNAL.ActionShowSuccess", {
                    mode: "text",
                    title: entity.name,
                    which: "all"
                }));
            });
        }
    });

    // JournalEntry - "Show players (Image)" button
    BetterEntityLink.registerJournalEntryAction({
        name: `${game.i18n.localize("JOURNAL.ActionShow")} (${game.i18n.localize("JOURNAL.ModeImage")})`,
        icon: "fa-eye",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted),
        callback: async entity => {
            await game.socket.emit("showEntry", entity.uuid, "image", true, entry => {
                Journal._showEntry(entity.uuid, "image", true);
                ui.notifications.info(game.i18n.format("JOURNAL.ActionShowSuccess", {
                    mode: "image",
                    title: entity.name,
                    which: "all"
                }));
            });
        }
    });

    // JournalEntry - "View Scene" button
    BetterEntityLink.registerJournalEntryAction({
        name: "SCENES.View",
        icon: "fa-bullseye",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted),
        callback: async entity => {
            let scenes = Array.from(game.scenes)
            for (let i=0; i<scenes.length; i++){
                if (scenes[i]._source.journal == entity._id || scenes[i]._source.journalEntryPage == entity._id){
                    scenes[i].view();
                }
            }

            
        }
    });

    // JournalEntry - "Activate Scene" button
    BetterEntityLink.registerJournalEntryAction({
        name: "SCENES.Activate",
        icon: "fa-bullseye",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted),
        callback: async entity => {
            let scenes = Array.from(game.scenes)
            for (let i=0; i<scenes.length; i++){
                if (scenes[i]._source.journal == entity._id || scenes[i]._source.journalEntryPage == entity._id){
                    scenes[i].activate();
                }
            }

            
        }
    });

    // JournalEntryPage - "View Scene" button
    BetterEntityLink.registerJournalEntryPageAction({
        name: "SCENES.View",
        icon: "fa-bullseye",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted),
        callback: async entity => {
            let scenes = Array.from(game.scenes)
            for (let i=0; i<scenes.length; i++){
                if (scenes[i]._source.journal == entity._id || scenes[i]._source.journalEntryPage == entity._id){
                    scenes[i].view();
                }
            }

            
        }
    });

    // JournalEntryPage - "Activate Scene" button
    BetterEntityLink.registerJournalEntryPageAction({
        name: "SCENES.Activate",
        icon: "fa-bullseye",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted),
        callback: async entity => {
            let scenes = Array.from(game.scenes)
            for (let i=0; i<scenes.length; i++){
                if (scenes[i]._source.journal == entity._id || scenes[i]._source.journalEntryPage == entity._id){
                    scenes[i].activate();
                }
            }

            
        }
    });

    // Cardstacks - "Shuffle" button
    BetterEntityLink.registerCardStacksAction({
        name: "CARDS.Shuffle",
        icon: "fa-random",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted) &&  entity.type.localeCompare("hand", undefined, {sensitivity: "base"}) !== 0,
        callback: async entity => await entity.shuffle()        
    });

    // Cardstacks - "Draw" button
    BetterEntityLink.registerCardStacksAction({
        name: "CARDS.Draw",
        icon: "fa-edit",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted) &&  entity.type.localeCompare("hand", undefined, {sensitivity: "base"}) === 0,
        callback: async entity => await entity.drawDialog()        
    });

    // Cardstacks - "Deal" button
    BetterEntityLink.registerCardStacksAction({
        name: "CARDS.Deal",
        icon: "fa-share-square",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted) &&  entity.type.localeCompare("deck", undefined, {sensitivity: "base"}) === 0,
        callback: async entity => await entity.dealDialog()   
    });

    // Cardstacks - "Pass" button
    BetterEntityLink.registerCardStacksAction({
        name: "CARDS.Pass",
        icon: "fa-share-square",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted) &&  entity.type.localeCompare("deck", undefined, {sensitivity: "base"}) !== 0,
        callback: async entity => await entity.passDialog()   
    });

    // Cardstacks - "Reset" button
    BetterEntityLink.registerCardStacksAction({
        name: "CARDS.Reset",
        icon: "fa-undo",
        condition: entity => entity?.img !== CONST.DEFAULT_TOKEN && (game.user.isGM || game.user.isTrusted),
        callback: async entity => await entity.resetDialog()        
    });


    Hooks.on('renderActorSheet', BetterEntityLink.enhanceEntityLinks);
    Hooks.on('renderJournalPageSheet', BetterEntityLink.enhanceEntityLinks);
    Hooks.on('renderItemSheet', BetterEntityLink.enhanceEntityLinks);
    Hooks.on('renderChatMessage', BetterEntityLink.enhanceEntityLinks);
})

/*
Hooks.on('renderApplication', enhanceEntityLink);
Hooks.on('renderDocumentSheet', enhanceEntityLink);
Hooks.on('renderRollTableConfig', enhanceEntityLink);
Hooks.on('renderSidebarTab', enhanceEntityLink);
Hooks.on('renderFormApplication', enhanceEntityLink);
*/

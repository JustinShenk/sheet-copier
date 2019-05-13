chrome.runtime.onInstalled.addListener(d => {
    chrome.storage.sync.get(["acceptedRisks", "settings", "pluginSettings"], res => {
        if (!res.acceptedRisks) {
            chrome.tabs.create({ url: chrome.extension.getURL("options.html") + "?fullpage=1" });
        }

				if (!res.pluginSettings) {
					let pluginSettings = {};
					if (res.settings) {
							// it needs an update!
							const settings = JSON.parse(res.settings);
							pluginSettings = {
                    agree_all: {
											enabled: true,
                    },
									};
							} else {
								// it"s a fresh install, load the defaults
								pluginSettings = {
									agree_all: {
                        enabled: true
                    },
									};
					}
					chrome.storage.sync.set({
							pluginSettings: JSON.stringify(pluginSettings)
					});
				} else {
	          let pluginUpdated = false;
	          const pluginSettings = JSON.parse(res.pluginSettings);

	          // new plugins
	          if (pluginSettings.agree_all === undefined) {
	              pluginUpdated = true;
	              pluginSettings.agree_all = { enabled: true };
	          }

	          if (pluginUpdated) {
	              chrome.storage.sync.set({
	                  pluginSettings: JSON.stringify(pluginSettings)
	              });
	          }
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "slackPageOpened") {
        chrome.pageAction.show(sender.tab.id);
    } else if (request.type === "closeThisTab") {
        chrome.tabs.remove(sender.tab.id);
    // } else if (request.type.startsWith("Agreed")) {
    //     const parts = request.type.split(".");
    //     const potentialClass = availablePlugins[parts[1]];
		//
    //     if (potentialClass) {
    //         request.type = parts[2];
    //         potentialClass.ProcessExtensionMessage(request, parts[1], sender);
    //     }
    }
});


chrome.commands.onCommand.addListener(function(command) {
  if (command === "agree-first-reaction") {
    chrome.tabs.executeScript({
      code: `
      function clickFirstReaction() {
          const query = "div.c-reaction_bar > button:nth-child(1):not(.c-reaction--reacted)";
          const reactionsToClick = document.querySelectorAll(query);
          const beforeCount = reactionsToClick.length;

          if (reactionsToClick.length) {
              reactionsToClick.forEach((button) => { button.click()} );
          }

          const afterCount = document.querySelectorAll(query).length;
      }
      clickFirstReaction()`
    })
  }
  else if (command === "agree-every-reaction") {
    chrome.tabs.executeScript({
      code: `
      function clickEveryReaction() {
        const query = "div > button.c-reaction:not(.c-reaction--reacted)";
        const reactionsToClick = document.querySelectorAll(query);
        const beforeCount = reactionsToClick.length;

        if (reactionsToClick.length) {
            reactionsToClick.forEach((button) => { button.click()} );
        }

        const afterCount = document.querySelectorAll(query).length;
      }
      clickEveryReaction()`
    })
  }
});

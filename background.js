// Copyright (c) 2019 Justin Shenk.
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

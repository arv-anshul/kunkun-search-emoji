import {
  Action,
  clipboard,
  expose,
  Icon,
  IconEnum,
  List,
  open,
  TemplateUiCommand,
  toast,
  ui,
} from "@kksh/api/ui/template";
import emojiRecord from "emojilib";
import startCase from "lodash/startCase";

function getEmojis(): List.Item[] {
  let items = [];
  for (const [emoji, keywords] of Object.entries(emojiRecord)) {
    items.push(
      new List.Item({
        title: startCase(keywords[0]),
        value: emoji,
        keywords: keywords,
        icon: new Icon({
          type: IconEnum.Text,
          value: emoji,
          bgColor: "#0000",
        }),
      })
    );
  }
  return items;
}

class Emoji extends TemplateUiCommand {
  async load(): Promise<void> {
    // UI tweaks
    ui.setSearchBarPlaceholder("Search Emoji Name...");

    let emojis = getEmojis();
    return ui.render(
      new List.List({
        items: emojis,
        defaultAction: "copy-emoji-name",
        actions: new Action.ActionPanel({
          title: "Emoji Action",
          items: [
            new Action.Action({
              title: "Open Extension Repo",
              value: "open-ext-repo",
              icon: new Icon({
                type: IconEnum.Iconify,
                value: "simple-icons:github",
              }),
            }),
            new Action.Action({
              title: "Copy Emoji Name",
              value: "copy-emoji-name",
              icon: new Icon({
                type: IconEnum.Iconify,
                value: "tabler:copy",
              }),
            }),
          ],
        }),
      })
    );
  }

  async onActionSelected(value: string): Promise<void> {
    switch (value) {
      case "open-ext-repo":
        return open.url("https://github.com/arv-anshul/kunkun-search-emoji");
      case "copy-emoji-name":
        if (this.highlightedListItemValue) {
          return clipboard
            .writeText(this.highlightedListItemValue)
            .then(() => {
              toast.success(`Copied: ${this.highlightedListItemValue}`);
            })
            .catch((e) => {
              console.error(e);
              toast.error(
                `Error while copying emoji ${this.highlightedListItemValue}!`
              );
            });
        } else {
          return toast.error("No emoji selected!");
        }
      default:
        toast.error("Action Fallback!");
        return Promise.resolve();
    }
  }

  async onListItemSelected(value: string): Promise<void> {
    return clipboard.writeText(value).then(
      () => {
        toast.success(`Copied: ${value}`);
      },
      (e) => {
        console.error(e);
        toast.error(`Error while copying emoji ${value}!`);
      }
    );
  }
}

expose(new Emoji());

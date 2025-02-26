import {
  Action,
  clipboard,
  expose,
  Icon,
  IconEnum,
  List,
  Markdown,
  open,
  TemplateUiCommand,
  toast,
  ui,
} from "@kksh/api/ui/template";
import emojiGroup from "unicode-emoji-json/data-by-group.json";

function getEmojisSections(): List.Section[] {
  let sections = [];
  for (const category of emojiGroup) {
    let items = [];
    for (const emoji of category.emojis) {
      items.push(
        new List.Item({
          title: emoji.name,
          value: emoji.emoji,
          icon: new Icon({
            type: IconEnum.Text,
            value: emoji.emoji,
            bgColor: "#000",
          }),
        })
      );
    }
    sections.push(
      new List.Section({
        title: category.name,
        items: items,
      })
    );
  }
  return sections;
}

class Emoji extends TemplateUiCommand {
  async load(): Promise<void> {
    // UI tweaks
    ui.setSearchBarPlaceholder("Search Emoji Name...");
    await ui.render(new List.List({ items: [] })); // render an empty list to render skeleton view quickly

    let emojiSections = getEmojisSections();
    return ui.render(
      new List.List({
        sections: emojiSections,
        detail: new List.ItemDetail({
          children: [
            new Markdown("# Emoji Extension"),
            new Markdown(`## Selected Emoji: ...`),
            new Markdown(`Yet to implement...`),
            new Markdown(
              "### Author is [@arv-anshul](https://github.com/arv-anshul)"
            ),
          ],
          width: 50,
        }),
        actions: new Action.ActionPanel({
          title: "Emoji Action",
          items: [
            new Action.Action({
              title: "Open Extenstion Repo",
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

  onActionSelected(value: string): Promise<void> {
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

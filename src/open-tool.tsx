import { List, ActionPanel, Action, Icon, Color, useNavigation, Form, Clipboard, showToast, Toast, LocalStorage } from "@raycast/api";
import { useState, useMemo, useEffect } from "react";

import { tools, categorySortIndex, iconFor } from "./shared/tools";
import { openInApp, encodeInput, APP_REPO_URL, OpenResult } from "./shared/links";

/**
 * Toast helper for callers that already attempted to open a deep link.
 * If the launch failed, show an error toast with an action to open the
 * Developer Tools Pro repository so the user can install the app.
 */
async function notifyLaunchResult(result: OpenResult, successTitle: string) {
  if (result.ok) {
    await showToast({ title: successTitle, style: Toast.Style.Success });
    return;
  }
  if (result.reason === "not-installed") {
    await showToast({
      title: "Developer Tools Pro not installed",
      message: "Click to view install instructions",
      style: Toast.Style.Failure,
      primaryAction: {
        title: "Open Repository",
        target: APP_REPO_URL,
      },
    });
    return;
  }
  await showToast({
    title: "Could not open Developer Tools Pro",
    message: "Make sure the app is installed and launched once",
    style: Toast.Style.Failure,
  });
}

/**
 * A simple form to collect input for a tool before opening the app.
 */
function ToolInputForm({ tool }: { tool: (typeof tools)[0] }) {
  const { pop } = useNavigation();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Open Tool"
            onSubmit={async (values: { input: string }) => {
              const deepLink = `${tool.deepLink}${tool.deepLink.includes("?") ? "&" : "?"}input=${encodeInput(values.input || "")}`;
              const result = await openInApp(deepLink);
              await notifyLaunchResult(result, `Opened ${tool.name}`);
              if (result.ok) pop();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Description text={`Provide input for ${tool.name}`} />
      <Form.TextArea id="input" title="Input" placeholder="Enter text here..." autoFocus />
    </Form>
  );
}

/**
 * Group tools by category, with pinned tools at the very top.
 */
function groupByCategory(toolList: typeof tools, pinnedIds: string[]) {
  const groups: Record<string, typeof tools> = {};
  const pinned: typeof tools = [];

  for (const tool of toolList) {
    if (pinnedIds.includes(tool.route)) {
      pinned.push(tool);
    } else {
      if (!groups[tool.category]) groups[tool.category] = [];
      groups[tool.category].push(tool);
    }
  }

  // Sort categories by canonical order, then alphabetically.
  const sortedCategories = Object.keys(groups).sort((a, b) => {
    const ai = categorySortIndex(a);
    const bi = categorySortIndex(b);
    if (ai !== bi) return ai - bi;
    return a.localeCompare(b);
  });

  // Sort tools within each category.
  for (const cat of sortedCategories) {
    groups[cat].sort((a, b) => a.name.localeCompare(b.name));
  }
  pinned.sort((a, b) => a.name.localeCompare(b.name));

  return { sortedCategories, groups, pinned };
}

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const { push } = useNavigation();

  // Load pins from LocalStorage
  useEffect(() => {
    LocalStorage.getItem<string>("pinned-tools").then((val) => {
      if (val) {
        try {
          setPinnedIds(JSON.parse(val));
        } catch (e) {
          setPinnedIds([]);
        }
      }
    });
  }, []);

  const togglePin = async (route: string) => {
    const isPinned = pinnedIds.includes(route);
    const newPins = isPinned ? pinnedIds.filter((id) => id !== route) : [...pinnedIds, route];
    setPinnedIds(newPins);
    await LocalStorage.setItem("pinned-tools", JSON.stringify(newPins));
    await showToast({
      title: isPinned ? "Unpinned tool" : "Pinned tool",
      style: Toast.Style.Success,
    });
  };

  const handleAction = async (tool: (typeof tools)[0]) => {
    if (!tool.supportsInput) {
      const result = await openInApp(tool.deepLink);
      await notifyLaunchResult(result, `Opened ${tool.name}`);
      return;
    }

    let clipboard = "";
    try {
      clipboard = (await Clipboard.readText()) || "";
    } catch (e) {
      clipboard = "";
    }

    if (clipboard && clipboard.trim().length > 0) {
      // If clipboard has content, open directly
      const deepLink = `${tool.deepLink}${tool.deepLink.includes("?") ? "&" : "?"}input=${encodeInput(clipboard)}`;
      const result = await openInApp(deepLink);
      if (result.ok) {
        await showToast({
          title: `Opened ${tool.name}`,
          message: "Used clipboard content",
          style: Toast.Style.Success,
        });
      } else {
        await notifyLaunchResult(result, `Opening ${tool.name} failed`);
      }
    } else {
      // Otherwise, push to input form
      push(<ToolInputForm tool={tool} />);
    }
  };

  // Filter by name/category/keywords when the user types.
  const filtered = useMemo(() => {
    if (!searchText.trim()) return tools;
    const q = searchText.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q)),
    );
  }, [searchText]);

  const { sortedCategories, groups, pinned } = useMemo(
    () => groupByCategory(filtered, pinnedIds),
    [filtered, pinnedIds],
  );

  return (
    <List
      searchBarPlaceholder="Search 120+ developer tools…"
      onSearchTextChange={setSearchText}
      searchText={searchText}
      throttle
    >
      {pinned.length > 0 && (
        <List.Section title="Pinned Tools">
          {pinned.map((tool) => (
            <List.Item
              key={tool.route}
              title={tool.name}
              subtitle={tool.description}
              keywords={tool.keywords}
              icon={{ source: Icon.Star, tintColor: Color.Yellow }}
              actions={
                <ActionPanel>
                  <Action title="Open Tool" icon={Icon.ArrowRight} onAction={() => handleAction(tool)} />
                  <Action
                    title="Unpin Tool"
                    icon={Icon.PinDisabled}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "p" }}
                    onAction={() => togglePin(tool.route)}
                  />
                  <Action.CopyToClipboard
                    title="Copy devtpro:// Link"
                    content={tool.deepLink}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                  />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      )}

      {sortedCategories.map((category) => (
        <List.Section key={category} title={category}>
          {groups[category].map((tool) => (
            <List.Item
              key={tool.route}
              title={tool.name}
              subtitle={tool.description}
              keywords={tool.keywords}
              icon={iconFor(tool)}
              actions={
                <ActionPanel>
                  <Action title="Open Tool" icon={Icon.ArrowRight} onAction={() => handleAction(tool)} />
                  <Action
                    title="Pin Tool"
                    icon={Icon.Pin}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "p" }}
                    onAction={() => togglePin(tool.route)}
                  />
                  <Action.CopyToClipboard
                    title="Copy devtpro:// Link"
                    content={tool.deepLink}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                  />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

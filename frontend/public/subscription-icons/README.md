# Subscription icons

Place your company/service SVG (or image) files here. The app loads them via the path dictionary in `SubscriptionManagerTab.tsx`.

**Expected filenames** (must match keys in `SUBSCRIPTION_ICON_PATHS`):

- `spotify.svg` – Spotify Premium
- `netflix.svg` – Netflix
- `amazon.svg` – Amazon Prime
- `apple.svg` – Apple iCloud+
- `disney.svg` – Disney+
- `github.svg` – GitHub Pro
- `openai.svg` – ChatGPT Plus / OpenAI

To add a new subscription icon: add the file here, then add a new entry in `SUBSCRIPTION_ICON_PATHS` in `src/pages/SubscriptionManagerTab.tsx` and use that key in the subscription’s `icon` field.

# Reproducer: iOS `EXC_BAD_ACCESS` in `-[RCTNetworkTask URLRequest:didReceiveData:]`

`<Image>` sources that are bundled **non-png/jpg** assets (`.webp`, `.gif`, `.jpeg`) are not handled by `RCTLocalAssetImageLoader`, so they are loaded through `RCTNetworking` → `RCTFileRequestHandler`. When such an `<Image>` unmounts mid-load, `-[RCTNetworkTask cancel]` → `-invalidate` releases the task's callback blocks on one thread while the file request handler is reading them on another, which crashes with `EXC_BAD_ACCESS` (freed block retained or invoked).

[`ReproducerApp/App.tsx`](ReproducerApp/App.tsx) remounts 60 `<Image>`s sourced from two bundled `.webp` files on every frame.

## Run

```sh
cd ReproducerApp
yarn install
cd ios && bundle install && bundle exec pod install && cd ..
```

Open `ios/ReproducerApp.xcworkspace`, then:

1. Edit Scheme → Run → Build Configuration: **Release**. In Debug, assets come from Metro over HTTP and take a different code path.
2. Optional: Edit Scheme → Run → Diagnostics → **Malloc Scribble**, which makes the crash faster.
3. Run on a **physical device**.

The app crashes with `EXC_BAD_ACCESS` within seconds to about 2 minutes.

## Control

Convert `assets/a.webp` / `assets/b.webp` to `.png` and update the two `require`s. PNG bundle assets go through `RCTLocalAssetImageLoader`, never create an `RCTNetworkTask`, and the app runs indefinitely.

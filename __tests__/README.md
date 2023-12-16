# PubSub Testing

Install emulator

```bash
gcloud components install pubsub-emulator
```

Start emulator

```bash
gcloud beta emulators pubsub start --project=demo-sandbox
```

Set environment variables

```bash
# Normal shells
gcloud beta emulators pubsub env-init

# Fishshell
set -Ux PUBSUB_EMULATOR_HOST localhost:8085

set -Ux PUBSUB_PROJECT_ID demo-sandbox
```

# SupportChatPoC

Proof of Concept (PoC) for the **YourCarYourWay** project: a **multi-user support chat** built with Angular.
This PoC demonstrates **real-time messaging between two users** using browser tabs, **without any backend**.

> Goal: validate the feasibility of a future **customer support real-time channel** (chat) before integrating it with the final architecture (API, database, security).

---

## Project Context (YourCarYourWay)

This PoC is part of the global architecture work for **YourCarYourWay – New customer web application**:
- centralized web app for car rental customers
- support channels: asynchronous tickets + real-time chat/visio
- international-ready (language, date/currency formats, timezones)
- payments handled by an external payment provider (tokenization / PCI-DSS)

**This repository focuses only on the support real-time chat PoC.**

---

## Features

- **Fake Login System**: simple authentication that accepts any username/password (demo-only)
- **Multi-User Chat**: multiple users can chat in the same conversation
- **Real-Time Sync**: messages sync instantly across browser tabs using `localStorage`
- **No Backend Required**: fully client-side implementation
- **Persistent State**: user sessions and messages persist across page refreshes

---

## What This PoC Validates

- Multi-user chat behavior (multiple tabs/windows)
- Real-time synchronization strategy (browser storage events)
- Simple UX flow for demo (login → chat)
- Basic persistence across refresh (client-side only)

---

## Limitations (Expected)

This is **not** a production-ready implementation.

- **No real authentication / authorization**
- **No backend / database**
- **No encryption at rest, no server-side audit logs**
- **Not compliant by itself for production usage**
- Real implementation will be handled by the target architecture:
  - Angular front-end
  - Spring Boot REST API
  - SQL database
  - security & compliance rules (RGPD, PSD2/SCA, PCI-DSS scope reduction via tokenization)

---

## Quick Start

### Development server

```bash
npm install
npm start

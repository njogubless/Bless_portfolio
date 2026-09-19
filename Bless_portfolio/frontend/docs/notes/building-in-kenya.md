---
slug: building-in-kenya
title: "Building software products in Kenya — what nobody tells you"
excerpt: >-
  Payments, connectivity, hiring, and the unique constraints of shipping
  products for East African users. A developer's honest take.
category: career
date: 2025-12-05
tags: [kenya, africa, mpesa, career, product]
---
# Building software products in Kenya — what nobody tells you

## The payment layer is different

M-Pesa is not a nice-to-have in Kenya — it's the default. Integrating Daraja (Safaricom's API) is your first real task on any consumer product. STK push, C2B, B2C — learn them all.

## Network assumptions will hurt you

Don't assume 4G. Test on 3G and even 2G edge cases. Lazy loading, small payloads, and offline-first design aren't optional — they're how you keep users.

## The talent is here

Contrary to what some think, Kenya has serious engineering talent. Nairobi's tech scene is real and growing. The challenge is retention, not availability.

## What I've learned

- Build for the constraints of your actual users, not the users you imagine.
- M-Pesa callbacks are asynchronous — design for that from day one.
- Local community (communities like Nairobi Dev) is underrated for growth.

## Final thought

Building in Kenya is hard in specific ways and exciting in specific ways. The problems are real, the market is young, and the opportunity is genuine.

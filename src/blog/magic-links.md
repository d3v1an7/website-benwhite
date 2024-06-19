---
title: Magic links are great, until they’re not
standfirst: We want to make good, helpful, smart things. However, people who use your things don’t care about your good intentions. They just want to do a thing, and have the thing work.
date: 2024-06-19
---

It was a short discussion when determining the auth method for [Capital Brief](https://www.capitalbrief.com/). Some flavour of passwordless was a must, and when thinking back to passwordless experiences that brought me joy, Slack came to mind.

I remembered signing from my phone for the first time. I entered my email address and hit sign in, expecting a password prompt to follow. But instead, bing! An email with a sign in link. I opened the link and... whoa, I am signed in to Slack. Just like magic.

That flow felt great to me! I wanted to replicate that.

I experimented with a few auth providers, chose one, built the thing and launched it.

Things seemed to be going well, but then:

> “When I try to sign in, the site says the link has expired.”

Uh oh, that doesn’t seem like a nice experience. Turns out we have some readers that work in, let’s say, fairly corporate environments. Their security teams want to protect their users from phishing. That’s good!

Unfortunately, checking emails for phishing requires an automated process to open links, and... oh no, the link checker has the sign in token now, not the user. That’s bad.

We had a chat with our US based auth provider and they said they already have checks on their end to stop bots from expiring the link. Perhaps we use different security tooling configs here in Australia? With no quick fix in sight, I switched those readers over to one-time password (OTP) instead. Besides the initial friction this seemed to work really well, so we didn't worry to much about magic links, until:

> “The site keeps signing me out.”

This one took a while to figure out. So let’s say a reader is using the LinkedIn app and clicks through to a Capital Brief story. They see the paywall, and proceed to sign in. They go through the flow, read the story, close the app and do it all again the next day. But wait, now the site says I’m not signed in anymore? What gives?

When a user opens a web link from a mobile app, the link typically doesn't open in the users default browser. The link will instead open up in an browser embedded into the application (a "webview") that does not share the state, sessions or cookies of the users default browser. The user wasn’t getting signed out – they were never being signed in on the webview in the first place. Instead, they’re signed in to whatever browser opened when they clicked the sign in link from their email.

We directed people to the plain text link they could copy and paste into the desired browser (or webview), but this felt... extremely suboptimal. Then:

> “We can only receive work emails in Teams, and links open in a sandboxed browser.”

Lmao, okay, we can’t fix this at all.

Earlier this year we removed magic links and switched all users to OTP, to the joy and delight of our support team (hello Dave).

So if you’re building an application, maybe you’ll be fine? I think Slack still use ‘em? But if you’re building a website, it’d recommend sticking with OTP.

---

### TLDR;

- Link checkers/email security tools can accidently expire magic links.
- The magic link flow is super janky when trying to sign in to a website that was loaded in a webview.
- Some users straight up can't make use of magic links to sign in to websites because of security policies.
- Magic links aren't ready for wide adoption as a flow for signing into websites, so we switched to OTP instead.

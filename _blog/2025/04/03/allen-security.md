---
layout: blog
title: "A Billion-dollar EdTech Company Left API Keys in Their App. That's Not Security – That's Sloppy."
date: 2025-04-03
desc: "A billion-dollar Indian edtech giant left sensitive keys exposed in their iOS app bundle. 15 days later, they've done nothing."
---

> Cybersecurity 101: Never trust your users.

How many times have we heard that phrase? Well, to be honest, far too many times to count. But that doesn't stop some people from trusting their users with their most sensitive secrets.

<br>
### TL;DR: Someone Just Taped Their Keys to the Front Door
Taping your keys to your door when you leave your house might be a great way for you to remember where you put them -- they're literally taped to your door! 

But that's not exactly secure, is it? So if a billion dollar giant did exactly that while storing data about people under the age of 18 in the house... would you trust them?


<br>
### What's wrong here?
[Allen](https://www.allen.ac.in)'s iOS app bundle reveals multiple sensitive credentials found in plain-text within .plist files. A simple right-click>Show Package Contents leads to more than 10 sensitive API keys and other sensitive secrets from CleverTap, Google Cloud, DataDog and others.

Here's what's exposed:

- `CLIENT_ID`
- `REVERSED_CLIENT_ID`
- `ANDROID_CLIENT_ID`
- `API_KEY`
- `GCM_SENDER_ID`
- `STORAGE_BUCKET`
- `PROJECT_ID`
- `BUNDLE_ID`
- `GOOGLE_APP_ID`
- `CleverTapToken`
- `APPSFLYER_KEY`
- `DATADOG_KEY`
- `MIXPANEL_API_KEY`
- `CleverTapAccountID`

It is, once again, important to note that no reverse engineering, decryption, or tampering was performed to obtain these credentials. Only a right click and a quick perusal of the .plist files in the app bundle's root directory. While not all of these are sensitive on their own, e.g., `BUNDLE_ID`, they are dangerous to have lying around in the context of everything else that's also accessible. While no active attempts were made to exploit these keys due to ethical reasons, based on security best practices, their exposure represents a serious risk.

<br>
### Timeline
- <b>prior to 19th March</b>
  - keys discovered and report prepared

- <b>19th March</b>
  - email notifications sent to info@allen.in, allendigital@allen.ac.in, bengaluru@allen.in; physical copy of report handed over to Allen Jayanagar, Bangalore; 15-day notice is provided before public disclosure


<img class="unselectable" src="/assets/blog/images/2025-04-03/mail1.png" style="width: 315px">
<img class="unselectable" src="/assets/blog/images/2025-04-03/mail2.png" style="width: 315px">
<div class="caption unselectable">The 2 emails I sent to Allen</div>

- <b>23rd March</b>
  - report sent via WhatsApp on request of Mr. Rajat Bhargava after a friendly reminder was provided

<img class="unselectable" src="/assets/blog/images/2025-04-03/whatsapp.png">
<div class="caption unselectable">WhatsApp message to Mr. Rajat Bhargava</div>	

- <b>3rd April</b>
  - proceed to public disclosure as stated on the report


**Allen was given a fair warning – they chose to ignore it.**

Allen was given 15 days' time to fix this -- and they have done nothing. Not even an acknowledgement.


<br>
### Coda
Allen prides itself on academic excellence, but when it comes to security, they’ve failed their own test.

**What should I do now?**

- **Students:** be aware that your data may not be secure. Ask Allen how they plan to protect it.
- **Parents:** ask Allen why a billion-dollar coaching empire can't follow basic security practices.
- **Everyone else:** this is a serious data security issue affecting minors. Spread the word.

<br><br>
_To the best of my knowledge, Allen has not taken action to remediate this issue as of the time of publishing. If they have done so without acknowledgment, I welcome updates and will note them accordingly._

[Read the full report (PDF) (redacted)](/assets/blog/allen-security-report.pdf)<br>
<i>or</i><br>
[Read my personal opinion on this](/blog/2025-04-03-allen-security-coda.html)<br>
---
layout: blog
title: "Compiling Textmate 2: Rendering Boogaloo"
date: 2025-07-30
desc: "Getting TextMate to show up right on macOS Tahoe"
---


<img class="unselectable" src="/assets/blog/images/2025-07-30/textmate-new.png">
<div class="caption unselectable">TextMate, fresh in 2025, on macOS Tahoe</div>

> TextMate has been a mainstay of my development tool belt for a while now, and it's one of the last truly native macOS editors still around. But development stalled, and with no updates since 2021, I figured -- _"How hard could it be to compile it myself?"_


## The Case of the Missing Gutter

Last time, we arrived at this compiled product:

<img class="unselectable" src="/assets/blog/images/2025-03-05/textmate-compiled.png">

One glaring issue here was the gutter... or lack thereof. In the previous post in this series, I said:

> ... but notice how the gutter is completely missing? And how the file browser's background isn't quite right? I'm not sure what's causing that, but I want to assume it's some `NSColor` deprecation thing that's causing it to behave this way. Although, it's just a hunch, and I'm not sure what to think yet. Some... creative... debugging with Apple's _Quartz Debug_ tool and its "_Flash screen updates_" toggle tells me that whatever's rendering the gutter, _is_, in fact, updating the right bits on screen at the right time -- it's just completely invisible for some reason. 
> 
> Gutter aside, some more digging led me to line 72 in the FileBrowser framework:
> 
> ```
> Frameworks/FileBrowser/src/FileBrowserView.mm : 72
> 
> _outlineView.backgroundColor = NSColor.clearColor;
> ```
> 
> Changing `clearColor` to something like `redColor` showed up immediately, and using `windowBackgroundColor` fixed the issue. But I'm not sure if this is the fix -- I figure that it was set to `clearColor` to let the window background show through, but for some reason the window itself is stuck in this gray color. Although, I could be completely wrong here and the issue could be something else entirely.


But why would changing the background colour fix the issue at all? And why were bits on screen being updated, even though the updates weren't really visual?

Some more debugging later, where I changed the themes around, I realised that that the gutter's divider was being rendered across the entire window, instead of within its own bounds. After changing that to `redColor` instead of having it pick it up from the theme, this bug was caught _red_ handed. (pun intended)

<img class="unselectable" src="/assets/blog/images/2025-07-30/textmate-red.png">
<div class="caption unselectable">A-ha, gotcha!</div>

So, to clip this to bounds, it was quite simple: `
```
Frameworks/OakTextView/src/OakDocumentView.mm

    87: gutterDividerView = OakCreateVerticalLine(OakBackgroundFillViewStyleNone);
```
<span style="color: green">```(+) 88: gutterDividerView.clipsToBounds = YES;```</span>

... and here's the result:

<img class="unselectable" src="/assets/blog/images/2025-07-30/textmate-red-fixed.png">

And changing it back to pick up the theme's settings, this issue is completely fixed:

<img class="unselectable" src="/assets/blog/images/2025-07-30/textmate-normal.png">

<sup>_This was solved in [`fed17e9`](https://github.com/sumukhprasad/textmate/commit/fed17e96d04f67308c1402465531799a2edbd867) **fixed gutter not showing up**_</sup>



## Fixing the tabs

Look closely at the tabs in the last image -- the text seems to be hugging the bottom of the tabs. This somehow wasn't the case last time, so I assume this is because macOS Tahoe increases the height of `NSTitlebarAccessoryView`.

This was quite simple to fix, I just had to change the hard-coded constraints...

```
Frameworks/OakTabBarView/src/OakTabBarView.mm

[self addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:[close]-(4)-|" 
options:0 metrics:nil views:views]];
[self addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:[title]-(3)-|" 
options:0 metrics:nil views:views]];
[self addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:|[overflow]|" 
options:0 metrics:nil views:views]];
```

... to automatic ones:
```
Frameworks/OakTabBarView/src/OakTabBarView.mm


[self addConstraint:[NSLayoutConstraint constraintWithItem:self.closeButton
                                                 attribute:NSLayoutAttributeCenterY
                                                 relatedBy:NSLayoutRelationEqual
                                                    toItem:self
                                                 attribute:NSLayoutAttributeCenterY
                                                multiplier:1
                                                  constant:0]];

[self addConstraint:[NSLayoutConstraint constraintWithItem:self.textField
                                                 attribute:NSLayoutAttributeCenterY
                                                 relatedBy:NSLayoutRelationEqual
                                                    toItem:self
                                                 attribute:NSLayoutAttributeCenterY
                                                multiplier:1
                                                  constant:0]];

[self addConstraint:[NSLayoutConstraint constraintWithItem:self.overflowButton
                                                 attribute:NSLayoutAttributeCenterY
                                                 relatedBy:NSLayoutRelationEqual
                                                    toItem:self
                                                 attribute:NSLayoutAttributeCenterY
                                                multiplier:1
                                                  constant:0]];
```


Et voila, fixed.


<sup>_This was solved in [`ba00428`](https://github.com/sumukhprasad/textmate/commit/ba00428da4bfeaa5693bab1828ee50a4e0813155) **fixed OakTabView constraints to visually center tab bar content on macOS Tahoe**_</sup>



## What next then?

Honestly... no clue. There's a few aesthetic changes I want to make in certain places, but that's about it. TextMate is fully working and completely functional on macOS Tahoe, newly compiled.
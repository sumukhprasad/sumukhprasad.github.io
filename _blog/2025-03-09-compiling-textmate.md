---
layout: blog
title: "Compiling TextMate I: Minimum Compilable Product"
date: 2025-03-09
desc: "I've embarked on a quest to resurrect TextMate, for some reason."
---

<img class="unselectable" src="/assets/blog/images/2025-03-05/textmate-og.png">
<div class="caption unselectable">TextMate</div>


TextMate has been a mainstay of my development tool belt for a while now, and it's one of the last truly native macOS editors still around. But development stalled, and with no updates since 2021, I figured -- _"How hard could it be to compile it myself?"_

Following the [README.md](https://github.com/textmate/textmate) file, I face-planted immediately into an issue. So here's part 1 of trying to compile TextMate.


---

## Dependencies? Didn't I just install them?

TextMate’s official README makes the build process look simple:

> After installing dependencies, make sure you have a full checkout (including submodules) and then run `./configure` followed by `ninja`, for example:
> 
> ```sh
> git clone --recursive https://github.com/textmate/textmate.git
> cd textmate
> ./configure && ninja TextMate/run
> ```
> 
> The `./configure` script simply checks that all dependencies can be found, and then calls `bin/rave` to bootstrap a `build.ninja` file with default config set to `release` and default target set to `TextMate`.

This, however, results in an error saying that `./configure` cannot find dependencies I've already installed, because it doesn't check `homebrew` include/library paths for those dependencies. Some quick fiddling later, that problem was solved.

<sup>_This was solved in [`340efec`](https://github.com/sumukhprasad/textmate/commit/340efec9399151ebd1aef08a32b8f9139a131314) **Modified configure to add homebrew, fixed library search.**_</sup>

---

## Ancient Ruby

Next issue? Ruby. Specifically, system Ruby. Some of the files in `/bin` were still using the default Ruby installation that ships with macOS:

`/System/Library/Frameworks/Ruby.framework/Versions/Current/usr/bin/ruby`

Apple started adding a deprecation notice to the system Ruby installation starting in 10.15 -- you'll see this when you open up `irb` if you're still using it:
```
WARNING: This version of ruby is included in macOS for compatibility with legacy software.
In future versions of macOS the ruby runtime will not be available by
default, and may require you to install an additional package.
```

So, I swapped it out with `/usr/bin/env ruby` in the files that were still using it --

- `bin/expand_variables`
- `bin/extract_changes`
- `bin/gen_build`
- `bin/gen_credits.rb`
- `bin/gen_html`
- `bin/gen_test`
- `bin/update_changes`

With that change, TextMate *finally* compiles! 🎉

<sup>_This was solved in [`060ebc3`](https://github.com/sumukhprasad/textmate/commit/060ebc3081aa1a96d4f39e972bca4e37775c5bb1) **Changed ruby to env ruby instead of system ruby.**_</sup>

---

<img class="unselectable" src="/assets/blog/images/2025-03-05/textmate-compiled.png">
<div class="caption unselectable">TextMate, newly compiled in 2025</div>

## Wait, where's the gutter?

Right, so I've got TextMate to compile -- but notice how the gutter is completely missing? And how the file browser's background isn't quite right? I'm not sure what's causing that, but I want to assume it's some `NSColor` deprecation thing that's causing it to behave this way. Although, it's just a hunch, and I'm not sure what to think yet. Some... creative... debugging with Apple's _Quartz Debug_ tool and its "_Flash screen updates_" toggle tells me that whatever's rendering the gutter, _is_, in fact, updating the right bits on screen at the right time -- it's just completely invisible for some reason. 

Gutter aside, some more digging led me to line 72 in the FileBrowser framework:

```
Frameworks/FileBrowser/src/FileBrowserView.mm : 72

_outlineView.backgroundColor = NSColor.clearColor;
```

Changing `clearColor` to something like `redColor` showed up immediately, and using `windowBackgroundColor` fixed the issue. But I'm not sure if this is the fix -- I figure that it was set to `clearColor` to let the window background show through, but for some reason the window itself is stuck in this gray color. Although, I could be completely wrong here and the issue could be something else entirely.

## Next Steps

Well the first obvious next step is to fix the gutter and file browser. Beyond that, I don't think anything else is broken here -- which is one _**hell**_ of an ode to a _superb_ codebase.

I’m not some seasoned macOS dev -- hell, I'm 18 and just figuring this out as I go. But I love TextMate, and I don’t want to see it die just because it's stuck in the past.

### Commits --

- _[`340efec`](https://github.com/sumukhprasad/textmate/commit/340efec9399151ebd1aef08a32b8f9139a131314)_ Modified configure to add homebrew, fixed library search.
- _[`f3da120`](https://github.com/sumukhprasad/textmate/commit/f3da12087b48876943bb98e5710c8b87607337ab)_ Changed db.close to @db.close.
- _[`060ebc3`](https://github.com/sumukhprasad/textmate/commit/060ebc3081aa1a96d4f39e972bca4e37775c5bb1)_ Changed ruby to env ruby instead of system ruby.



_P.S. Allan, and everybody else on the TextMate [team](https://github.com/orgs/textmate/people), you guys rock -- you built something insanely ahead of its time._
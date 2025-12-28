---
layout: blog
title: "Writing an Operating System from Scratch"
date: 2025-07-14
desc: "Abstracting every single layer of computer software, from metal to user."
---

> *This is a blog-ified version of [this technical document](/projects/boink-kernel-project).*

You have to be all kinds of crazy to build a kernel from scratch. Much less build a kernel, a bootloader, a filesystem, a libc implementation, and a text pager and an image viewer for that kernel, from scratch. 

No, for that you have to be both stupid and stupidly naive.

<br>
## Why?

Technology today is layers and layers of software all folded in on itself. Not really simple, and not really easy to understand the entire stack, top to bottom. So I decided to build my own everything, from bootloader to C Standard Library, just to understand how things work.

<br>
## What?

*BoinkOS*, or more formally the *Boink Kernel Project*, aims to provide a reasonable abstraction for every single layer between user and bare metal --

- filesystem (GLFS)
- bootloader (Boink Interactive Bootloader)
- kernel (BoinkOS)
- text pager (with *Included Search Function (tm)*)
- image viewer
- syscall interface
- custom libc

<br>
## "Allegedly Good Features" I added that definitely did not start as dumb ideas

Of course, starting from scratch gives you ideas for features that you don't see often, and Boink has two such features:

- **kernel scratchpad**<br>
	provides 16kb of "scratchpad" space for the kernel to use — avoids page management where it may not be needed.
- **panic debug shell**<br>
	provides a way to easily debug programs when a panic state is entered. really helpful when you don't have gdb.

<br>
## Milestones

Some (overkill) milestones were (slowly and tediously) achieved on this platform.

- custom 32-bit protected mode bootloader with VESA graphics
- paging and frame allocation
- syscalls + userland mode (ring3) context switching
- ELF binary loading and execution
- basic shell with file viewing, image viewing, and app execution
- interrupt handling with IRQs, ISRs, PIT, and keyboard input
- simple framebuffer-based graphics output
- GLFS — a simple loadable filesystem baked into the boot process


<br>
## A Wild Filesystem Appears

GLFS (good little (luck) file system) is an extremely simple filesystem spec that Boink uses.

```
[sector 0] GLFS SUPERBLOCK
----------
- magic GLFS+version identifier

[sector 1+] DIRECTORY TABLE
-----------
     [entry 0] filename: string
               start sector: int
	       size: int (bytes)

     [entry 1] filename: string
               start sector: int
	       size: int (bytes)
     (...)

[end of table marker]
----------
[file data]
(...)
```

Yes, that's it. Just a superblock, a directory table, and files. No folders, no journaling, no metadata, no permissions... just data.

<br>
## Coda

OS dev is one of those weird hobbies where you can go weeks without your system doing anything at all, end up backtracking days of work just to implement everything again, and then you fix a random paging bug and it suddenly boots a shell and you feel like god. I definitely did not spend a day debugging the VESA graphics after writing VESA info to one location and trying to read it from a completely different location. Definitely.

Next up at some unspecified date in the vague future: **Boink 2: UNIX Boogaloo**


*"How did you do it?"*<br>
*"It's very simple — you read the protocol and write the code."* — Bill Joy, definitely forgetting the mental spiraling bit

<hr style="margin-top: 100px">

## Screenshots

<b>First Steps — printing to the screen in VGA text mode</b><br>
<img src="/assets/projects/boink-kernel-project/1.png" style="width: 50%">
<br><br><br>

<b>GLFS disk reads</b><br>
<img src="/assets/projects/boink-kernel-project/2.png" style="width: 50%">
<br><br><br>

<b>VGA framebuffer graphics</b><br>
<img src="/assets/projects/boink-kernel-project/3.png" style="width: 50%">
<br><br><br>

<b>Less-inspired Text Pager</b><br>
<img src="/assets/projects/boink-kernel-project/4.png" style="width: 49.5%">
<img src="/assets/projects/boink-kernel-project/5.png" style="width: 49.5%">
<br><br><br>

<b>Panic diagnostic shell</b><br>
<img src="/assets/projects/boink-kernel-project/6.png" style="width: 50%">
<br><br><br>

<b>Boink Interactive Bootloader</b><br>
<img src="/assets/projects/boink-kernel-project/7.png" style="width: 50%">
<br><br><br>

<b>Bitmap Image Viewer</b><br>
<img src="/assets/projects/boink-kernel-project/8.png" style="width: 50%">
<br><br><br>

<b>ring3 context switching</b><br>
<img src="/assets/projects/boink-kernel-project/9.png" style="width: 50%">
<br><br><br>

<b>Custom libc with basic I/O support</b><br>
<img src="/assets/projects/boink-kernel-project/10.png" style="width: 50%">
<br><br><br>


<img src="/assets/projects/boink-kernel-project/cover.png" style="width: 100%">
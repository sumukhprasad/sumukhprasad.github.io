---
layout: blog
title: "Cataloging my books with ISBN barcodes and Google Books"
date: 2025-04-21
desc: "Barcodes are a godsend."
---

## As with most things, why?

Over the years I've added many books to my arsenal -- but never kept track of them. I fully blame child-me for lack of foresight. :/

In any case, I wanted to have a list of what books I had. But cataloging 4 shelves worth of books wouldn't be easy.


<br>
## Enter ISBN

ISBN stands for _International Standard Book Number_, and is what's represented by the barcodes you'll find on the backs of most books. Here's what a standard 13-digit ISBN is comprised of --
```
ISBN 978-93-5333-371-3
      a   b   c   d  e

a - GS1 prefix
b - registration group
c - registrant
d - publication
e - check digit
```

<br>
## Right, but... ???

What I did with this number was this -- I had a script look it up on Google Books.

- Most (~100) books were already there on Google Books -- only took around 45 minutes.
- Some (~20) books, that were from smaller publishers or, this was annoying, that had other stickers stuck on top of the barcode, I had to find the information manually. This took nearly an hour and a half.

I added a way for me to select what camera I wanted to use, and I turned over my iPhone and used Continuity Camera to use it as a webcam. There, then I was able to just hover books over my table and have them be scanned in.

<img class="unselectable" src="/assets/blog/images/2025-04-21/scanning.png">
<div class="caption unselectable">Scanning barcodes like I'm in a library</div>
<div class="caption unselectable"><sup>I don't actually have "Louie (The Puppy Place #51)," -- that's because <code>pyzbar</code> kept reading some 1s as 7s.</sup></div>

<br>
## Should you do this?

Here's what actually went down behind the scenes: the script uses `pyzbar` and `opencv` to extract the ISBN from the camera feed. Then it pipes that ISBN into a function that calls the Google Books API, grabs all the metadata (title, author, publisher, dates), and dumps it all into a CSV file. End result? A searchable, sortable catalog of all my books. Hey, I even found some books I thought I'd lost along the way!

Frankly, you should do this. If you have any amount of books that you want to keep track of, you absolutely should do this. It's just so much cleaner and easier to refer to a spreadsheet to search for things than to go digging in the wrong shelf twice.


[Get the code >](https://gist.github.com/sumukhprasad/dc5b7c9014a2b4528a20f08105efdf27)
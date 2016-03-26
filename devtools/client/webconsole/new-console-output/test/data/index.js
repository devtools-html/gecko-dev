/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const data = new Map();

const datafiles = [
  "console-log"
];

datafiles.forEach(function(file) {
  const filepath = `./${file}`;
  data.set(file, require(filepath));
});

module.exports = data;

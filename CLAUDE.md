# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Platforms** is a personal portfolio/landing page built with vanilla JavaScript, SCSS, and HTML. It's hosted on GitHub Pages at `enkr1.github.io/platforms/`. The project showcases social links, blog highlights, and Spotify integration.

## Repository Structure

This is a **monorepo** containing two related projects:

```
_platforms/
├── platforms/                    # Production code (GitHub Pages deployed)
│   ├── js/main.js               # OBFUSCATED - do not edit directly
│   ├── js/spotify.js            # Spotify integration helpers
│   ├── scss/                    # SCSS source files
│   ├── css/main.css             # Compiled CSS
│   ├── _data/                   # JSON data files (platform_obj.json, profile.json)
│   └── index.html               # Main entry point
│
└── _platforms_unencrypted_js/   # Source JavaScript (separate git repo)
    ├── main.js                  # EDIT THIS - source JavaScript
    └── obfuscator.js            # Obfuscation script
```

**Critical**: The `platforms/js/main.js` is obfuscated output. Always edit `_platforms_unencrypted_js/main.js` instead.

## Build Commands

```bash
# Source aliases (from repo root)
source aliases.sh

# Obfuscate JS (run from repo root)
node _platforms_unencrypted_js/obfuscator.js
# or use alias:
o

# Deploy platforms (obfuscate + commit + push)
deploy_platforms

# Git push platforms only
gpm

# Git push unencrypted JS only
gpo
```

## SCSS Compilation

SCSS files are in `platforms/scss/`. The main entry point is `main.scss` which imports partials:
- `_00-colours.scss` - Color variables
- `_01-loading.scss` - Loading screen styles
- `_variables.scss` - Size/breakpoint variables
- `_theme.scss` - Theme definitions
- `_platforms_container.scss` - Platform links grid
- `_spotify_container.scss` - Spotify widget
- `_articles_container.scss` - Blog article cards

**Note**: There's no automated SCSS compilation configured. Compile manually or set up a watcher.

## Linting

Trunk is configured for linting (see `platforms/.trunk/trunk.yaml`):
```bash
cd platforms
trunk check      # Run all linters
trunk fmt        # Format code
```

Enabled linters: prettier, markdownlint, checkov, svgo, oxipng, trufflehog

## Data Files

Content is configured via JSON in `platforms/_data/`:
- `platform_obj.json` - Social links (listIcons) and action buttons (listButtons)
- `profile.json` - Personal info, roles, bio

## Key Architecture Notes

1. **Module Pattern**: The unobfuscated `main.js` uses the module pattern with IIFEs (Immediately Invoked Function Expressions) for code organization while keeping everything in a single file for obfuscation.

2. **Resource Loading**: Custom `ResourceLoader` class handles preloading of images and tracking load progress for the loading screen animation.

3. **External APIs**:
   - Spotify API integration for "currently playing" widget
   - Blog posts fetched from `blog.enkr1.com` RSS/DOM parsing

4. **No Build Framework**: This is intentionally vanilla JS/HTML/SCSS without React/Vue/bundlers to demonstrate pure web development skills.

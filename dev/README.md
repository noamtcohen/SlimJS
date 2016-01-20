### IDE Setup for Mac

I use these scripts to setup my dev environment on my mac.
I couldn't find a plugin to integrate FitNesse with [WebStorm](https://www.jetbrains.com/webstorm/specials/webstorm/webstorm.html?&gclid=Cj0KEQiA_fy0BRCwiLaQ5-iFgpwBEiQA884sOev2YlIuM8R6pcQRWjm0YNUnFt9OLLnwz0dpwVY09m4aAji58P8HAQ&gclsrc=aw.ds) so this is what I did and it's a comfortable setup for any IDE on a Mac:

Install [Chrome Canary](https://www.google.com/chrome/browser/canary.html)

Install [SIMBL](http://www.culater.net/software/SIMBL/SIMBL.php) 

Install Afloat:

```bash
curl https://raw.githubusercontent.com/rwu823/aflot/master/install.sh | sh
```

Create automator service with global keyboard shortcut:

```applescript
tell application "Google Chrome Canary"
  repeat with theWindow in every window
    repeat with theTab in every tab of theWindow
      tell theTab to reload
    end repeat
  end repeat
end telldev

```

Run:

```bash
dev/start-fit.sh
```

This will open a small Chrome Canary window and float it above all other windows load the FitNesse test page and start the FitNesse server.

So now I can work in my IDE and reload the test page with the global service keyboard shortcut and see the test result in the floating Canary window without switching applications.

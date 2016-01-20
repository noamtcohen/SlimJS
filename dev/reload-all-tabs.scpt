tell application "Google Chrome Canary"
  repeat with theWindow in every window
    repeat with theTab in every tab of theWindow
      tell theTab to reload
    end repeat
  end repeat
end telldev
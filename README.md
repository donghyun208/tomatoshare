# Tomatoshare - A Sharable Pomodoro Timer

## How to Use: 

Share the URL with friends and coworkers to work on Tomatoes together, or let others know when you shouldn't be disturbed. Anyone who is on the same URL as you (made unique by the 6 character ID) will be able to see the same Timer as you, as well as Pause, Reset, and change the time length.

The User glyph on the right side of the webpage indicates how many people are currently viewing the same URL as you - useful for knowing when the other person has successfully logged onto the site. (If there are 3 or more users, the site will only show 3 Users.)


## Connecting to APIs:
You can use localStorage to connect this Timer with other RESTful APIs. 
When using a 25min or 15min Timer, the browser will send a GET request to URLs stored at localStorage['tomatoshare_start'] and localStorage['tomatoshare_end'] (if the keys exist), when the Timer starts and ends, respectively.

This feature can be used with services such as IFTTT's Maker Channel, or the Android App Tasker. For example, I have a profile set up using the Tasker App to set my phone to toggle Do Not Disturb mode when the timer starts and ends.

---
To connect with IFTTT's API, set up the Maker channel, and set the following keys:

localStorage['tomatoshare_start'] = "https://maker.ifttt.com/trigger/TOMATOSHARE_START/with/key/YOUR_MAKERCHANNEL_KEY"
localStorage['tomatoshare_end'] = "https://maker.ifttt.com/trigger/TOMATOSHARE_END/with/key/YOUR_MAKERCHANNEL_KEY"

where "TOMATOSHARE_START" and "TOMATOSHARE_END" within the URL can be replaced with any keywords you'd like to use.

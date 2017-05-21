#Tomatoshare - A Sharable Pomodoro Timer

## How to Use: 

Share the current URL with friends and coworkers to work on Tomatoes together, or let others know when you shouldn't be disturbed. Anyone who is on the same URL as you (including the 6 character identifier) will be able to see the same Timer as you, as well as Pause, Reset, and change the time length.

The User glyph on the right side indicates how many people are currently viewing the same URL as you - useful for knowing when the other person has successfully logged onto the site. If there are 3 or more users, the site will only show the Group Glyph.


## LocalStorage:
You can use localStorage to connect this Timer with other RESTful APIs. When a 25min or 15min Timer starts or ends, your browser will send a GET request (if the keys exist), to URLs stored at localStorage['tomatoshare_start'] and localStorage['tomatoshare_end'], respectively.

This feature can be used with services such as IFTTT's Maker Channel, or the Android App Tasker. For example, I have a profile set up using the Tasker App to set my phone to toggle Do Not Disturb mode when the timer starts and ends.

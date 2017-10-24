curl -X POST -H "Content-Type: application/json" -d '{
"get_started":{
    "payload":""
},
"greeting":[
  {
    "locale":"default",
    "text":"Hello {{user_first_name}}! Thanks for getting in touch with us on Messenger. Order any food from our rich menu and get delivered on your address.!"
  }
],
"persistent_menu":[
  {
    "locale":"default",
    "composer_input_disabled": true,
    "call_to_actions":[
      {
        "title":"Quick order",
        "type":"postback",
        "payload":"QUICK_ORDER_POSTBACK"
      }
      {
        "title":"View cart",
        "type":"postback",
        "payload":"VIEW_CART_POSTBACK"
      }
      {
        "title":"More",
        "type":"nested",
        "call_to_actions":[
          {
            "title":"Restart bot",
            "type":"postback",
            "payload":"RESTART_BOT_POSTBACK"
          },
          {
            "title":"Developed by SIGMIND",
            "type":"web_url",
            "url":"fb.com/anjantb",
            "webview_height_ratio":"full"
          }
        ]
      }
    ]
  },
  {
    "locale":"zh_CN",
    "composer_input_disabled":false
  }
]
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAAcaq8rzMQoBAMr1FgOiTW3Y4rn3fMZApefDoSSqrztUBFD74YaC8wLR50ELPGQwcFrX7qz6JEUbeLZBDaQlimlpYj5ujLZBvOZAW8v2qCvtVhnWaKrYdqgqrQkENlPzqETQZC9A2MdUZAH6UHK42vGq8mcEuV78kCLnc1ZA7xBzwZDZD"



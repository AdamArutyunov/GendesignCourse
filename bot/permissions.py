ADMINS = [115178271, 227496872]


def admin_required(old_func):
    def func(update, context):
        if update.message.chat_id not in ADMINS:
            return update.message.reply_text('Недостаточно прав.')

        old_func(update, context)

    return func

